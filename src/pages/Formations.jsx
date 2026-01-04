import { useRef, useState, useEffect } from "react";
import FormationCard from "../components/FormationCard";
import FormationDetailsModal from "../components/FormationDetailsModal";
import { useNavigate } from "react-router-dom";
import fondclassforma from "/fondclassforma.jpg";
import API_URL from "../api.js";

export default function Formations() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = localStorage.getItem("user");

  // Récupération des formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        
        // Fetch avec un timeout pour éviter que ça bloque
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_URL}/formations`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des formations');
        }
        
        // Lire le texte brut d'abord
        const textData = await response.text();
        
        // Essayer de parser le JSON
        let data;
        try {
          data = JSON.parse(textData);
        } catch (parseError) {
          console.error("Erreur de parsing JSON:", parseError);
          data = [];
        }
        
        // Enrichissement AVEC appel à l'API sessions
        const enrichedPromises = data.map(async (f) => {
          let sessions = [];
          
          try {
            // Appel à l'API pour récupérer les sessions de cette formation
            const sessionsResponse = await fetch(
              `${API_URL}/sessions/formation/${f.idFormation}`
            );
            
            if (sessionsResponse.ok) {
              const rawSessions = await sessionsResponse.json();
              
              // Mapper les sessions au format attendu par FormationCard
              sessions = rawSessions.map(session => {
                // Formater la date
                let dateFormatee = "Date non définie";
                if (session.dateDebut) {
                  const dateObj = new Date(session.dateDebut);
                  dateFormatee = dateObj.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                }
                
                return {
                  idSession: session.idSession,
                  ville: session.lieu?.ville?.trim() || "Ville non spécifiée",
                  date: dateFormatee,
                  placesDisponibles: session.capaciteRestante || 0
                };
              });
            }
          } catch (sessionError) {
            console.error(`Erreur récupération sessions pour formation ${f.idFormation}:`, sessionError);
            // Si l'API échoue, on laisse un tableau vide
            sessions = [];
          }
          
          return {
            idFormation: f.idFormation,
            sessions: sessions,
            nom: f.intitule,
            descriptionCourte: f.categorie || "Formation professionnelle",
            prix: f.prix ? `${f.prix}€` : "250€",
            niveau: f.niveau || "Intermédiaire",
            duree: f.duree ? `${f.duree} semaines` : "1 jour",
            capacite: "12 places par classe",
            image: fondclassforma
          };
        });
        
        const enriched = await Promise.all(enrichedPromises);
        setFormations(enriched);
        
      } catch (err) {
        console.error("Erreur fetch formations:", err);
        
        // En cas d'erreur, on met des données par défaut pour que le site fonctionne
        setFormations([
          {
            idFormation: 1,
            nom: "Développement Web",
            descriptionCourte: "Créer des sites et applications modernes",
            prix: "250€",
            niveau: "Intermédiaire",
            duree: "8 jours",
            capacite: "12 places par classe",
            image: fondclassforma,
            sessions: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  // Logic to handle custom scrollbar dragging
  const handleScroll = () => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) {
      setDragX(0);
      return;
    }

    const percent = slider.scrollLeft / maxScroll;
    setDragX(percent * (track.offsetWidth - 18));
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current || !sliderRef.current) return;

    e.preventDefault();
    const track = trackRef.current;
    const slider = sliderRef.current;
    const rect = track.getBoundingClientRect();
    const handleWidth = 18;

    let x = e.clientX - rect.left - (handleWidth / 2);
    const maxTrackDrag = rect.width - handleWidth;

    x = Math.max(0, Math.min(x, maxTrackDrag));
    setDragX(x);

    const percent = x / maxTrackDrag;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    slider.scrollLeft = percent * maxScroll;
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF7FF] py-20 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Chargement des formations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF7FF] py-20 font-sans">

      {/* Horizontal Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 pb-12 gap-8 items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {formations.map((f) => (
          <FormationCard
            key={f.idFormation}
            formation={f}
            onOpenDetails={(formation) => {
              setSelectedFormation(formation);
              setOpenModal(true);
            }}
          />
        ))}
      </div>

      {/* Custom Scrollbar Track */}
      <div
        className="w-full max-w-xs mx-auto mt-8 h-2 bg-gray-200 rounded-full relative cursor-pointer"
        ref={trackRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          const rect = trackRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left - 9;
          const max = rect.width - 18;
          const clampedX = Math.max(0, Math.min(x, max));
          setDragX(clampedX);

          const slider = sliderRef.current;
          const percent = clampedX / max;
          slider.scrollLeft = percent * (slider.scrollWidth - slider.clientWidth);

          setIsDragging(true);
        }}
      >
        <div
          className="h-[18px] w-[18px] bg-white rounded-full shadow-md border border-gray-100 absolute top-1/2 -translate-y-1/2 transition-transform duration-75 ease-out active:scale-110"
          style={{ left: dragX }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
        />
      </div>

      {/* Details Modal */}
      {openModal && (
        <FormationDetailsModal
          formation={selectedFormation}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}