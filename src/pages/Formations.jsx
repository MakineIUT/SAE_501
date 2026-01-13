import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormationCard from "../components/FormationCard";
import FormationDetailsModal from "../components/FormationDetailsModal";
import fondclassforma from "/fondclassforma.jpg";
import API_URL from "../api.js";

export default function Formations() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  
  const [dragX, setDragX] = useState(0);
  //drag c'est la position du curseur sur la track
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  // gestion ouverture modale détails formation
  const handleFormationClick = (formation) => {
    const user = localStorage.getItem("user");

    if (!user) {
      // si pas de user dans le storage, redirection page inscription
      navigate("/inscription");
    } else {
      // si connecté, on ouvre la modale normalement
      setSelectedFormation(formation);
      setOpenModal(true);
    }
  };

  // useEffect pour fetch des formations et sessions associées car nécessaire pour afficher les places dispos 
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/formations`);
        if (!response.ok) throw new Error("Erreur API");
        const data = await response.json();

        const enrichedPromises = data.map(async (f) => {
          let sessions = [];
          try {
            const res = await fetch(`${API_URL}/sessions/formation/${f.idFormation}`);
            if (res.ok) {
              const rawSessions = await res.json();
              sessions = rawSessions.map((s) => ({
                idSession: s.idSession,
                ville: s.lieu?.ville?.trim() || "Ville non spécifiée",
                date: s.dateDebut ? new Date(s.dateDebut).toLocaleDateString("fr-FR") : "NC",
                placesDisponibles: s.capaciteRestante || 0,
              }));
            }
          } catch (e) {
            console.error(e);
          }

          return {
            idFormation: f.idFormation,
            sessions: sessions,
            nom: f.intitule,
            descriptionCourte: f.categorie || "Formation professionnelle",
            prix: f.prix ? `${f.prix}€` : "250€",
            niveau: f.niveau || "Intermédiaire",
            duree: f.duree ? `${f.duree} semaines` : "1 jour",
            image: fondclassforma,
          };
        });


        // récupération des formations enrichies avec sessions
        const enriched = await Promise.all(enrichedPromises);
        setFormations(enriched);
      } catch (err) {
        console.error("Erreur fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, []);

  // logique du scrollbar custom
  const handleScroll = () => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) return;
    const percent = slider.scrollLeft / maxScroll;
    setDragX(percent * (track.offsetWidth - 18));
  };


  // gestion du drag de la souris
  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current || !sliderRef.current) return;
    const track = trackRef.current;
    const slider = sliderRef.current;
    const rect = track.getBoundingClientRect();
    let x = e.clientX - rect.left - 9;
    const max = rect.width - 18;
    x = Math.max(0, Math.min(x, max));
    setDragX(x);
    slider.scrollLeft = (x / max) * (slider.scrollWidth - slider.clientWidth);
  };

  // scroll pour mettre à jour la position du drag quand on scroll le slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // relâchement de la souris
  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  // affichage pendant le chargement des données
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  // rendu principal
  return (
    <div className="min-h-screen bg-[#FDF7FF]  dark:bg-gradient-to-r from-[#4500ab] to-[#8700c2] py-20 font-sans">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 pb-12 gap-8 items-stretch"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {formations.map((f) => (
          <FormationCard key={f.idFormation} formation={f} onOpenDetails={handleFormationClick} />
        ))}
      </div>
    
      <div
        className="w-full max-w-xs mx-auto mt-8 h-2 bg-gray-200 rounded-full relative cursor-pointer"
        ref={trackRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMouseMove(e);
        }}
      >
        <div
          className="h-[18px] w-[18px] bg-white rounded-full shadow-md border border-gray-100 absolute top-1/2 -translate-y-1/2"
          style={{ left: dragX }}
        />
      </div>
      
      {openModal && <FormationDetailsModal formation={selectedFormation} close={() => setOpenModal(false)} />}
    </div>
  );
}