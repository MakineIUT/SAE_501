import { useState } from "react";
import { X, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api.js";

export default function FormationDetailsModal({ formation, close }) {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const idApprenant = user?.idApprenant || user?.idUtilisateur;
  const isConnected = !!idApprenant;

  const handleInscription = async () => {
    if (!isConnected) {
      navigate("/inscription");
      return;
    }

    if (!selectedSession) {
      alert("Veuillez sélectionner une session");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/apprenants/${idApprenant}/inscriptions?idFormation=${formation.idFormation}&idSession=${selectedSession.idSession}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'inscription");
      }
      close();
    
      alert("✅ Inscription validée ! Rendez-vous dans votre panier pour finaliser le paiement.");
      
      // redirection vers le panier (onglet "Achats" du dashboard)
      navigate("/dashboard/apprenant", { state: { openTab: "panier" } });

    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5" >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] max-w-[900px] w-full max-h-[90vh] overflow-auto relative shadow-2xl">
        <button onClick={close}
          className="absolute top-5 right-5 bg-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md z-10 hover:bg-gray-100 transition-colors" >
          <X size={24} color="#666" />
        </button>

        {/* Header Image */}
        <div className="relative h-[300px] overflow-hidden rounded-t-[20px]">
          <img
            src={formation.image}
            alt={formation.nom}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-10 text-white">
            <h2 className="text-3xl font-bold m-0">{formation.nom}</h2>
            <p className="text-xl mt-2 opacity-90">{formation.descriptionCourte}</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-5 mb-8">
            <InfoCard icon="💰" label="Prix" value={formation.prix} />
            <InfoCard icon="📊" label="Niveau" value={formation.niveau} />
            <InfoCard icon="⏱️" label="Durée" value={formation.duree} />
          </div>

          <h3 className="text-xl font-bold mb-4 text-gray-800">Sessions disponibles</h3>
          {/* Liste des sessions */}
          {formation.sessions && formation.sessions.length > 0 ? (
            <div className="grid gap-3 mb-8">
              {formation.sessions.map((s) => (
                <SessionCard
                  key={s.idSession}
                  session={s}
                  isSelected={selectedSession?.idSession === s.idSession}
                  onSelect={() => setSelectedSession(s)}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500 mb-8">
              Aucune session disponible pour le moment
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleInscription}
              disabled={loading || !selectedSession}
              className={`flex-1 p-4 rounded-xl font-bold text-lg transition-all ${
                loading || !selectedSession 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-[#A828F6] text-white hover:bg-[#9622dd] shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? "Inscription en cours..." : "✓ Confirmer l'inscription"}
            </button>
            <button 
              onClick={close} 
              className="px-8 py-4 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// composant pour afficher une carte d'information
function InfoCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100 hover:border-purple-300 transition-colors">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">{label}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
    </div>
  );
}

// composant pour afficher une session
function SessionCard({ session, isSelected, onSelect }) {
  const isComplet = session.placesDisponibles <= 0;
  
  return (
    <div
      onClick={!isComplet ? onSelect : null}
      className={`p-4 border-2 rounded-xl transition-all ${
        isSelected 
          ? 'border-purple-500 bg-purple-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${
        isComplet 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <span className="font-bold text-gray-800">📅 {session.date}</span>
          <span className="text-gray-600">📍 {session.ville}</span>
          <span className={`font-bold ${
            isComplet ? 'text-red-500' : 'text-green-600'
          }`}>
            {isComplet ? 'Complet' : `✓ ${session.placesDisponibles} places`}
          </span>
        </div>
        {isSelected && (
          <span className="text-purple-600 font-bold text-xl">✓</span>
        )}
      </div>
    </div>
  );
}