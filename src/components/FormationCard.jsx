import { useNavigate } from "react-router-dom";

export default function FormationCard({ formation, onInscription }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        scrollSnapAlign: "center"
      }}
    >
      <div style={{ position: "relative", width: "900px" }}>
        {/* IMAGE */}
        <img
          src={formation.image}
          alt={formation.nom}
          style={{
            width: "100%",
            height: "480px",
            objectFit: "cover",
            borderRadius: "20px"
          }}
        />

        {/* CADRE BLANC */}
        <div
          style={{
            position: "absolute",
            left: "-150px",
            top: "20px",
            width: "340px",
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
          }}
        >
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
            {formation.nom}
          </h2>

          <p style={{ marginBottom: "20px", color: "#555" }}>
            {formation.description}
          </p>

          <input
            placeholder="Adresse"
            style={{ width: "100%", marginBottom: "12px", padding: "10px" }}
          />
          <input
            type="date"
            style={{ width: "100%", marginBottom: "12px", padding: "10px" }}
          />
          <input
            type="date"
            style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
          />

          <button
            onClick={onInscription}
            style={{
              width: "100%",
              padding: "12px",
              background: "#8e2de2",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px",
              cursor: "pointer"
            }}
          >
            S’inscrire
          </button>

          <button
            onClick={() => navigate(`/formations/${formation.id}`)}
            style={{
              background: "transparent",
              border: "none",
              color: "#8e2de2",
              cursor: "pointer"
            }}
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
}
