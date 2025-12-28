import { useState } from "react";
import { User, Lock } from "lucide-react";

export default function Connexion() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(90deg, rgba(69,0,171,1) 0%, rgba(135,0,194,1) 100%)",
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
                  marginBottom: "32px",
                }}
              >
                Connexion
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    border: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "20px",
                }}
              >
                <label>
                  <input type="checkbox" /> se souvenir de moi
                </label>
                <span style={{ color: "#7b2cbf", cursor: "pointer" }}>
                  mot de passe oublié ?
                </span>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    "linear-gradient(90deg, rgba(69,0,171,1), rgba(135,0,194,1))",
                  marginBottom: "14px",
                }}
              >
                Connexion
              </button>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  background: "white",
                  fontWeight: "bold",
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