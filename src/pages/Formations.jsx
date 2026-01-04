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
        const response = await fetch(`${API_URL}/formations`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des formations');
        }
        
        const data = await response.json();
        
        // Enrichissement avec les sessions complètes
        const enriched = await Promise.all(
          data.map(async (f) => {
            let sessions = [];
            
            try {
              const sessionsRes = await fetch(`${API_URL}/sessions/formation/${f.idFormation}`);
              
              if (sessionsRes.ok) {
                const sessionsData = await sessionsRes.json();
                
                // Pour chaque session, récupérer les infos du lieu
                sessions = await Promise.all(
                  sessionsData.map(async (session) => {
                    let ville = "Lieu non défini";
                    
                    if (session.id_lieu) {
                      try {
                        const lieuRes = await fetch(`${API_URL}/lieux/${session.id_lieu}`);
                        if (lieuRes.ok) {
                          const lieu = await lieuRes.json();
                          ville = lieu.ville || "Lieu non défini";
                        }
                      } catch (err) {
                        console.error("Erreur récupération lieu:", err);
                      }
                    }
                    
                    return {
                      idSession: session.idSession,
                      ville: ville,
                      date: session.date_session ? new Date(session.date_session).toLocaleDateString('fr-FR') : "Date non définie",
                      placesDisponibles: session.places_disponibles || 0
                    };
                  })
                );
              }
            } catch (err) {
              console.error("Erreur sessions pour formation", f.idFormation, err);
            }
            
            return {
              ...f,
              sessions: sessions,
              nom: f.intitule,
              descriptionCourte: f.description,
              image: fondclassforma
            };
          })
        );
        
        setFormations(enriched);
      } catch (err) {
        console.error("Erreur fetch formations:", err);
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