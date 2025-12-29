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
      <div className="mt-0 flex items-center justify-center  py-12 min-h-[calc(100vh-80px)] bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
        <div className="mt-0 container mx-auto mb-32 px-4">
          <div className="mt-0 flex justify-center">
            <div className="mt-0 w-full max-w-5xl">
              {/*Titre*/}
              <div className=" text-center text-white my-5">
                <h1 className=" font-bold text-6xl mb-4 tracking-tight text-balance">Title Copy Goes Here</h1>
                <p className="py-3 mt-8 text-lg font-normal text-pretty">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. </p>
                <button className="text-md text-black text-uppercase bg-white rounded-full font-semibold px-4 py-2">
                  Commencer
                </button>
              </div>

              {/*Card hero */}
              <div className="p-6 shadow-2xl rounded-[2rem] bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-[1px]">
                 {/*Titre et texte*/}
                  <div className="text-center text-[#D4ACE3] ">
                    <h3 className="text-4xl py-2">Nos formations</h3>
                    <p className="text-xs py-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. </p>
                  </div>
                  
                  {/*Grille formations*/}
                  <div>
                    {/*rangé de 2 formations*/}
                    <div className="flex flex-row justify-center ">
                      <div className="flex flex-col"><h5>Dev web</h5></div>
                      <div className="flex flex-col"><h5>Cyber sécurité</h5></div>
                    </div>
                    {/*rangé de 2 formations*/}
                    <div className="flex flex-row justify-center">
                      <div className="flex flex-col"><h5>design</h5></div>
                      <div className="flex flex-col"><h5>hébergement</h5></div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Accueil;