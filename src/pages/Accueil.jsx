
import { useEffect, useState } from "react";
import API_URL from "../api.js";

function Accueil() {
  const [formations, setFormations] = useState([]);

  // Couleurs fixes
  const colors = ["#c78fefff", "#7CF291", "#5B82F3", "#F6A55A"];

  useEffect(() => {
    fetch(`${API_URL}/formations`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((f, index) => ({
          id: f.idFormation,
          nom: f.intitule,
          description: "Maîtrisez les compétences clés pour réussir dans ce domaine.",
          color: colors[index % colors.length],
        }));
        setFormations(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>

      <div className="mt-0 flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-neutral-50 dark:bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
        <div className="container mx-auto mb-52 px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">

              {/* Titre principal */}
              <div className="text-center text-neutral-950 dark:text-neutral-50 my-5">
                <h1 className="font-bold text-6xl md:text-7xl mb-6 tracking-tight leading-tight">
                  Avec Tritech <br /> apprenez
                  <span className="ml-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    à l'infini
                  </span>
                </h1>
                <p className="py-3 mt-4 text-xl font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
                  Boostez votre carrière avec nos formations. Maîtrisez les compétences tech de demain, grâce à des experts passionnés.
                </p>
                <button className="mt-4 text-xs tracking-widest text-neutral-50 bg-neutral-950 dark:text-neutral-950 uppercase dark:bg-neutral-50 rounded-full font-bold px-8 py-3 shadow-lg hover:text-[#CA00DF] hover:bg-gray-100 transition-all">
                  Commencer
                </button>
              </div>

              {/* Section formations */}
              <div className="mt-16 p-10 lg:p-16 shadow-2xl rounded-[3rem] bg-gradient-to-b from-[#FDFBFE] to-[#F4EBFA] dark:bg-gradient-to-tr dark:from-white/5 dark:to-white/15 dark:backdrop-blur-md dark:border dark:border-[#8700c2]/5">

                <div className="text-center text-neutral-950 dark:text-[#E7D1F0] mb-12">
                  <h3 className="text-4xl font-bold mb-4">Nos formations</h3>
                  <p className="text-sm opacity-70 max-w-2xl mx-auto">
                    Développez vos compétences dans des domaines variés. Offrez vous un nouveau parcours professionnel.
                  </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {formations.map((f) => (
                    <div
                      key={f.id}
                      className="
                        flex
                        overflow-hidden
                        rounded-2xl
                        bg-neutral-50
                        dark:bg-neutral-50/15
                        transition-transform
                        duration-300
                        ease-out
                        hover:-rotate-1
                        hover:scale-105
                        cursor-default
                      "
                    >
                      {/* Couleur */}
                      <div
                        className="w-24 md:w-32 flex-shrink-0"
                        style={{ backgroundColor: f.color }}
                      />

                      {/* Texte */}
                      <div className="flex flex-col justify-center p-4 md:p-6 flex-grow bg-white/5">
                        <h5 className="text-neutral-900 dark:text-neutral-50 font-bold text-sm md:text-base mb-1">
                          {f.nom}
                        </h5>
                        <p className="text-neutral-800 dark:text-neutral-50/60 text-[10px] md:text-xs leading-snug">
                          {f.description}
                        </p>
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
