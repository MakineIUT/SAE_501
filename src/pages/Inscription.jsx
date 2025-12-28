import { useState } from "react";
import { User, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Inscription() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");


const handleNavigation = (page) => {
  console.log(`Navigation vers: ${page}`);
  navigate(`/${page}`);
};

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(90deg, rgba(69,0,171,1) 0%, rgba(135,0,194,1) 100%)"
      }}
    >
      {/* CADRE */}
      <div
        style={{
          width: "80%",
          maxWidth: "1400px",
          height: "650px",
          position: "relative",
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* IMAGE */}
        <img
          src="/src/assets/fond_pconnexioninscr.jpg"
          alt="fond"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* CONTENU */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
          }}
        >
          {/* GAUCHE */}
          <div
            style={{
              width: "50%",
              paddingLeft: "80px",
              paddingTop: "90px",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
              BIENVENUE
            </h1>
            <p style={{ marginTop: "20px", fontWeight: "600" }}>
              Débutez votre reconversion
            </p>
            <p style={{ marginTop: "20px", maxWidth: "420px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>

          {/* DROITE */}
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "360px",
                background: "white",
                borderRadius: "18px",
                padding: "32px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                Inscription
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                Déjà inscrit ?{" "}
                <span onClick={() => handleNavigation("connexion")} style={{ color: "#7b2cbf", cursor: "pointer" }}>
                  Connectez-vous
                </span>
              </p>

              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              {/* Mot de passe */}
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              {/* Nom */}
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="Nom"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              {/* Prénom */}
              <div style={{ marginBottom: "22px" }}>
                <input
                  type="text"
                  placeholder="Prénom"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              <button
              onClick={() => {
    const newUser = {
      role: "APPRENANT",
      email,
      nom,
      prenom
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    navigate("/accueil");
  }}
                style={{
                  width: "100%",
                  padding: "12px",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    "linear-gradient(90deg, rgba(69,0,171,1), rgba(135,0,194,1))",
                }}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}