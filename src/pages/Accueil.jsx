import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Formations from "./Formations.jsx";
import { useNavigate } from "react-router-dom";

function Accueil() {

  const navigate = useNavigate();

const handleNavigation = (page) => {
  console.log(`Navigation vers: ${page}`);
  navigate(`/${page}`);
};


  const formations = [
  { id: 1, color: "#c78fefff", link: "formation-1", nom: "Développement Web", description: "Créer des sites et applications modernes" },
  { id: 2, color: "#7CF291", link: "formation-2", nom: "Cybersécurité", description: "Protéger les sytèmes et les données"},
  { id: 3, color: "#5B82F3", link: "formation-3", nom: "Data & Analyse", description: "Analyser et exploiter les données"},
  { id: 4, color: "#F6A55A", link: "formation-4", nom: "UI / UX Design", description: "Concevoir des interfaces centrées utilisateur"}
];

  return (
    <>

      <div className="min-vh-100 bg-light">

        {/* HERO */}
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold">Tritech</h1>
          <p className="text-muted my-4">
            Formez-vous aujourd’hui aux compétences de demain
          </p>
          <button
            onClick={() => handleNavigation("commencer")}
            className="btn btn-dark btn-lg rounded-pill px-4"
          >
            COMMENCER
          </button>
        </div>

        {/* FORMATIONS */}
        <div className="container pb-5">
          <div 
  style={{
    backgroundColor: "rgba(242, 231, 249, 1)",
    borderRadius: "26px",
    padding: "80px",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.12)"
  }}>
            <h2 className="text-center fw-bold mb-3">
              Nos formations
            </h2>
            <p className="text-center text-muted mb-4"  style={{marginTop: "40px"}}>
Découvrez nos formations professionnelles conçues pour développer vos compétences et vous accompagner vers la réussite.
Chaque parcours est pensé pour allier théorie, pratique et accompagnement personnalisé.            </p>

            <div className="row g-4" style={{marginTop: "40px"}}>
  {formations.map((formation) => (
    <div key={formation.id} className="col-md-6">
      <div
        className="d-flex"
  style={{
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.17)",
    height: "150px",
    overflow: "hidden"
  }}
      >
        {/* Bloc couleur à gauche */}
        <div
          style={{
            backgroundColor: formation.color,
            width: "150px",
            height: "100%"
                    }}
        ></div>

        {/* Texte */}
        <div className="ms-4 flex-grow-1 d-flex flex-column pt-3">
  <h4 className="mb-1">
    {formation.nom}
  </h4>

  <p className="mb-0 fw-medium">
    {formation.description}
  </p>
</div>

        {/* Bouton flèche */}
        <button
  onClick={() => handleNavigation("formations")}
  className="btn d-flex align-items-center justify-content-center align-self-end mb-3 me-3"
  style={{
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: formation.color,
    color: "#fff"
  }}
>
  ↗
</button>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>

    </>
  );
}

export default Accueil;