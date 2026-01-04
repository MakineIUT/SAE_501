import { useState } from "react";
import { X, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api.js";

export default function FormationDetailsModal({ formation, close }) {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const idApprenant = user?.idApprenant || user?.idUtilisateur;
  const isConnected = !!idApprenant;

  const handleInscription = async () => {
    // Vérifier si connecté
    if (!isConnected) {
      alert("⚠️ Vous devez être connecté pour vous inscrire");
      navigate("/connexion");
      return;
    }

    // Vérifier si session sélectionnée
    if (!selectedSession) {
      alert("⚠️ Veuillez sélectionner une session");
      return;
    }

    // Vérifier places disponibles
    if (selectedSession.placesDisponibles <= 0) {
      alert("⚠️ Cette session est complète");
      return;
    }

    try {
      setLoading(true);
      console.log("📝 Inscription en cours...", {
        idApprenant,
        idFormation: formation.idFormation,
        idSession: selectedSession.idSession
      });

      // Appel API pour créer l'inscription
      const response = await fetch(
        `${API_URL}/apprenants/${idApprenant}/inscriptions?idFormation=${formation.idFormation}&idSession=${selectedSession.idSession}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de l'inscription");
      }

      console.log("✅ Inscription créée avec succès");
      alert("✅ Inscription validée ! Rendez-vous dans votre panier pour finaliser le paiement.");
      
      close();
      navigate("/dashboard-apprenant");

    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("❌ Erreur lors de l'inscription : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 10
          }}
        >
          <X size={24} color="#666" />
        </button>

        {/* Image */}
        <div style={{ position: "relative", height: "300px", overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
          <img
            src={formation.image}
            alt={formation.nom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: "40px 30px 20px",
            color: "#fff"
          }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>{formation.nom}</h2>
            <p style={{ fontSize: "1.2rem", margin: "10px 0 0 0", opacity: 0.9 }}>
              {formation.descriptionCourte}
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: "30px" }}>
          {/* Informations principales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
            <InfoCard icon="💰" label="Prix" value={formation.prix} />
            <InfoCard icon="📊" label="Niveau" value={formation.niveau} />
            <InfoCard icon="⏱️" label="Durée" value={formation.duree} />
          </div>

          {/* Sessions disponibles */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "15px", color: "#333" }}>
              📅 Sessions disponibles
            </h3>

            {formation.sessions && formation.sessions.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {formation.sessions.map((session) => (
                  <SessionCard
                    key={session.idSession}
                    session={session}
                    isSelected={selectedSession?.idSession === session.idSession}
                    onSelect={() => setSelectedSession(session)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: "30px", 
                textAlign: "center", 
                background: "#f9f9f9", 
                borderRadius: "12px",
                color: "#999"
              }}>
                <Calendar size={48} style={{ margin: "0 auto 15px", opacity: 0.5 }} />
                <p style={{ margin: 0 }}>Aucune session disponible pour le moment</p>
              </div>
            )}
          </div>

          {/* Bouton d'action */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={handleInscription}
              disabled={loading || !selectedSession || (selectedSession && selectedSession.placesDisponibles <= 0)}
              style={{
                flex: 1,
                padding: "15px",
                background: loading || !selectedSession || (selectedSession && selectedSession.placesDisponibles <= 0) 
                  ? "#ccc" 
                  : "linear-gradient(135deg, #a855f7, #6366f1)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: loading || !selectedSession || (selectedSession && selectedSession.placesDisponibles <= 0) 
                  ? "not-allowed" 
                  : "pointer",
                transition: "all 0.3s"
              }}
            >
              {loading ? "⏳ Inscription en cours..." : "✅ S'inscrire"}
            </button>

            <button
              onClick={close}
              style={{
                padding: "15px 30px",
                background: "#f3f4f6",
                color: "#333",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Annuler
            </button>
          </div>

          {!selectedSession && (
            <p style={{ marginTop: "15px", color: "#f59e0b", textAlign: "center", fontSize: "0.9rem" }}>
              ⚠️ Sélectionnez une session pour vous inscrire
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------- COMPONENTS ------------------- */

function InfoCard({ icon, label, value }) {
  return (
    <div style={{
      padding: "20px",
      background: "#f9fafb",
      borderRadius: "12px",
      textAlign: "center",
      border: "2px solid #f3f4f6"
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "5px", fontWeight: "500" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#111" }}>
        {value}
      </div>
    </div>
  );
}

function SessionCard({ session, isSelected, onSelect }) {
  const isComplet = session.placesDisponibles <= 0;

  return (
    <div
      onClick={isComplet ? null : onSelect}
      style={{
        padding: "18px",
        border: isSelected ? "3px solid #a855f7" : "2px solid #e5e7eb",
        borderRadius: "12px",
        cursor: isComplet ? "not-allowed" : "pointer",
        background: isSelected ? "#f3e8ff" : isComplet ? "#f9fafb" : "#fff",
        transition: "all 0.3s",
        opacity: isComplet ? 0.6 : 1,
        position: "relative"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "25px", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "140px" }}>
            <Calendar size={18} color="#6b7280" />
            <span style={{ fontWeight: "600", color: "#111" }}>{session.date}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
            <MapPin size={18} color="#6b7280" />
            <span style={{ color: "#6b7280" }}>{session.ville}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={18} color={isComplet ? "#ef4444" : "#10b981"} />
            <span style={{ 
              fontWeight: "600", 
              color: isComplet ? "#ef4444" : "#10b981" 
            }}>
              {session.placesDisponibles} {session.placesDisponibles > 1 ? "places" : "place"}
            </span>
          </div>
        </div>

        {isComplet && (
          <span style={{
            padding: "4px 12px",
            background: "#fee2e2",
            color: "#ef4444",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: "600"
          }}>
            COMPLET
          </span>
        )}

        {isSelected && !isComplet && (
          <div style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#a855f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold"
          }}>
            ✓
          </div>
        )}
      </div>
    </div>
  );
}