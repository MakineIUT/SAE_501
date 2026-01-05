import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormationCard({ formation, onOpenDetails }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleInscription = () => {
    if (!selectedSession) {
      alert("Veuillez sélectionner une session avant de vous inscrire.");
      return;
    }
    
    // Navigue vers la page de paiement avec la formation et la session sélectionnée
    navigate("/paiement", { 
      state: { 
        formation: formation,
        session: selectedSession
      } 
    });
  };

  return (
    <div className="min-w-full flex justify-center snap-center py-10">
      <div className="relative w-[900px] max-w-[90vw]">
        {/* Background Image */}
        <img
          src={formation.image}
          alt={formation.nom}
          className="w-full h-[500px] object-cover rounded-[20px] shadow-2xl"
        />

        {/*Contenu card */}
        <div className="absolute top-8 left-0 md:-left-12 lg:-left-24 w-[380px] max-w-[90%] bg-white rounded-[24px] shadow-2xl p-6 z-10">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2 font-poppins">
            {formation.nom}
          </h2>
          <p className="text-gray-500 font-medium mb-4">{formation.prix}</p>

          <p className="text-gray-400 text-sm mb-2 leading-relaxed line-clamp-3">
            {formation.descriptionCourte}
          </p>

          <button
            onClick={() => onOpenDetails(formation)}
            className="text-left text-gray-800 font-bold underline mb-6 hover:text-gray-600 w-fit text-sm"
          >
            En savoir plus
          </button>

          {/* Dropdown des sessions */}
          <div className="border border-gray-900 rounded-xl mb-4 overflow-hidden bg-white">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-extrabold text-xs tracking-wider uppercase">Sessions</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
              <div className="bg-white border-t border-gray-100 max-h-40 overflow-y-auto">
                {formation.sessions && formation.sessions.length > 0 ? (
                  formation.sessions.map((session, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSession(session);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-0
                          ${selectedSession === session ? "bg-purple-100" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block font-bold text-gray-900 text-sm">{session.ville}</span>
                          <span className="block text-[10px] text-gray-500">{session.date}</span>
                        </div>
                        {selectedSession === session && <span className="text-purple-600 font-bold text-xs">✓</span>}
                      </div>
                      <span className="block text-xs text-pink-500 font-medium mt-1">
                        {session.placesDisponibles} places disponibles !
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    Aucune session disponible
                  </div>
                )}
              </div>
            )}
            
            {selectedSession && !isOpen && (
              <div className="px-4 pb-3 pt-0">
                <div className="p-2 bg-gray-50 rounded text-xs text-gray-700">
                  Sélectionné: <span className="font-bold">{selectedSession.ville}</span> <span className="text-gray-500">({selectedSession.date})</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleInscription}
            className="w-full bg-[#A828F6] text-white font-bold text-lg py-3 rounded-full shadow-lg hover:bg-[#9622dd] transition-transform active:scale-95"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}