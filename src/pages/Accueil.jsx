import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";


function Accueil() {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  const formations = [
    { id: 1, color: "#c78fefff", link: "formation-1", nom: "Développement Web", description: "Lorem ipsum dolor sit amet, adipiscing" },
    { id: 2, color: "#7CF291", link: "formation-2", nom: "Cybersécurité", description: "Lorem ipsum dolor sit amet, adipiscing"},
    { id: 3, color: "#5B82F3", link: "formation-3", nom: "Data & Analyse", description: "Lorem ipsum dolor sit amet, adipiscing"},
    { id: 4, color: "#F6A55A", link: "formation-4", nom: "UI / UX Design", description: "Lorem ipsum dolor sit amet, adipiscing"}
  ];

  return (
    <>
      <div className="mt-0 flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-neutral-50 dark:bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
        <div className="container mx-auto mb-52 px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              
              {/* Titre principal */}
              <div className="text-center text-neutral-950 dark:text-neutral-50 my-5">
                <h1 className="font-bold text-6xl mb-4 tracking-tight">Title Copy Goes Here</h1>
                <p className="py-3 mt-8 text-lg font-normal opacity-90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                </p>
                <button className="mt-4 text-xs tracking-widest text-neutral-50 bg-neutral-950  dark:text-neutral-950 uppercase dark:bg-neutral-50 rounded-full font-bold px-8 py-3 shadow-lg hover:text-[#CA00DF] hover:bg-gray-100 transition-all">
                  Commencer
                </button>
              </div>

              {/* Section Nos Formations */}
              <div className="mt-16 p-10 lg:p-16 shadow-2xl rounded-[3rem] bg-gradient-to-b from-[#FDFBFE] to-[#F4EBFA] dark:bg-gradient-to-tr dark:from-white/5 dark:to-white/15 dark:backdrop-blur-md dark:border dark:border-[#8700c2]/5">
                
                <div className="text-center text-neutral-950 dark:text-[#E7D1F0] mb-12">
                  <h3 className="text-4xl font-bold mb-4">Nos formations</h3>
                  <p className="text-sm opacity-70 max-w-2xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                  </p>
                </div>
                
                {/* Grille des formations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {formations.map((f) => (
                    <div 
                      key={f.id}
                      onClick={() => handleNavigation(f.link)}
                      className="flex overflow-hidden rounded-2xl bg-neutral-50  dark:bg-neutral-50/15 dark:hover:bg-neutral-50/25 transition-all cursor-pointer group "
                    >
                      {/* Carré de couleur */}
                      <div 
                        className="w-24 md:w-32 flex-shrink-0" 
                        style={{ backgroundColor: f.color }}
                      />
                      
                      {/* Texte */}
                      <div className="flex flex-col justify-between p-4 md:p-6 flex-grow bg-white/5 relative">
                        <div>
                          <h5 className="text-neutral-900 dark:text-neutral-50 font-bold text-sm md:text-base mb-1">{f.nom}</h5>
                          <p className="text-neutral-800 dark:text-neutral-50/60 text-[10px] md:text-xs leading-snug">
                            {f.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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