import { useState } from "react";
import "@google/model-viewer";

export default function Apropos() {
  const [openVisite, setOpenVisite] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "80px 10%"
      }}
    >
      {/* SECTION VISITE VIRTUELLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: "30px",
          overflow: "hidden",
          minHeight: "400px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
        }}
      >
        {/* ZONE 3D / APERÇU */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <model-viewer
            src="/3D_Tritech.glb"
            style={{
              width: "90%",
              height: "90%",
              borderRadius: "20px",
              background: "#eaeaea"
            }}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1.2"
            environment-image="neutral"
          />
        </div>

        {/* TEXTE */}
        <div
          style={{
            width: "50%",
            padding: "50px"
          }}
        >
          <h1 style={{ fontWeight: "800", marginBottom: "20px" }}>
            Visite virtuelle
          </h1>

          <p style={{ color: "#555", marginBottom: "30px", lineHeight: "1.6" }}>
            La salle immersive en 3D permet de plonger virtuellement dans un environnement
            de formation réaliste, reproduisant une salle de classe. Cette immersion a pour
            objectif de renforcer l’engagement des apprenants et de leur offrir une meilleure
            projection dans leur futur cadre d’apprentissage.
          </p>

          <button
            onClick={() => setOpenVisite(true)}
            style={{
              padding: "14px 30px",
              background: "#7b2ff7",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Visiter la salle
          </button>
        </div>
      </div>

      {/* POPUP VISITE 3D */}
      {openVisite && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              width: "90%",
              height: "85%",
              background: "#000",
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* BOUTON FERMER */}
            <button
              onClick={() => setOpenVisite(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "18px",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              ✕
            </button>

            {/* 3D VIEWER */}
            <model-viewer
              src="/3D_Tritech.glb"
              style={{ width: "100%", height: "100%" }}
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
            />
          </div>
        </div>
      )}

      {/* PARAGRAPHE DE PRÉSENTATION */}
      <div
        style={{
          marginTop: "60px",
          background: "#fff",
          borderRadius: "20px",
          padding: "60px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <h3 style={{ marginBottom: "30px", color: "black" }}>
          Présentation Entreprise
        </h3>

        <p style={{ color: "#555", lineHeight: "1.8", marginBottom: "30px" }}>
          Notre entreprise est spécialisée dans la formation professionnelle et
          l’accompagnement des apprenants dans le développement de compétences
          techniques et numériques. Nous proposons des formations adaptées aux
          besoins actuels du marché, en combinant pédagogie moderne, outils innovants
          et encadrement par des formateurs qualifiés. Notre objectif est d’offrir un
          environnement d’apprentissage accessible, structuré et orienté vers la
          réussite professionnelle de chaque apprenant.
        </p>

        <p style={{ color: "#555", lineHeight: "1.8", marginBottom: "30px" }}>
          Nous plaçons l’expérience utilisateur et la qualité de l’apprentissage au
          cœur de notre démarche. Grâce à des contenus clairs, des parcours progressifs
          et un suivi personnalisé, nous permettons à chacun d’évoluer à son rythme,
          tout en acquérant des compétences concrètes et directement applicables dans
          le monde professionnel.
        </p>

        <h3 style={{ marginTop: "30px", color: "black" }}>
          Notre rôle et notre vision
        </h3>

        <p style={{ color: "#555", lineHeight: "1.8" }}>
          Notre rôle est d’accompagner les apprenants tout au long de leur parcours de
          formation, depuis l’inscription jusqu’à la validation des compétences
          acquises. Nous assurons un suivi pédagogique rigoureux, une gestion claire
          des formations et des sessions, ainsi qu’un cadre structuré favorisant
          l’engagement et la progression.
        </p>

        <p style={{ color: "#555", lineHeight: "1.8" }}>
          À travers notre plateforme, nous souhaitons créer un lien fort entre les
          apprenants, les formateurs et l’environnement de formation, en proposant une
          solution moderne, intuitive et évolutive.
        </p>
      </div>
    </div>
  );
}
