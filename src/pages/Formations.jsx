import { useRef, useState, useEffect } from "react";
import FormationCard from "../components/FormationCard";
import FormationDetailsModal from "../components/FormationDetailsModal";
import fondclassforma from "/fondclassforma.jpg";

export default function Formations() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  // il faudra adapter le code pour qu'il corresponde à la BDD
  const formations = [
    {
      id: 1,
      nom: "Développement Front-end",
      descriptionCourte: "Développez de sites et applications interractives",
      descriptionDetaillee: "Développez de sites et applications interactives avec les dernières technologies web.",
      prix: "200€ / session",
      niveau: "Intermediaire",
      capacite: "12 places par classes",
      duree: "1 jour",
      image: fondclassforma,
      sessions: [
        { ville: "Paris", date: "20/01/2026", placesDisponibles: 2 },
        { ville: "Lyon", date: "20/02/2026", placesDisponibles: 12 },
        { ville: "Marseille", date: "15/03/2026", placesDisponibles: 5 }
      ]
    },
    {
      id: 2,
      nom: "Cybersécurité",
      descriptionCourte: "Apprenez à sécuriser les systèmes d'information et à contrer les cyberattaques.",
      descriptionDetaillee: "Une formation intensive pour maîtriser les enjeux de la sécurité informatique.",
      prix: "350€ / session",
      niveau: "Avancé",
      capacite: "12 places par classes",
      duree: "1 jour",
      image: fondclassforma,
      sessions: [
        { ville: "Paris", date: "25/01/2026", placesDisponibles: 4 },
        { ville: "Bordeaux", date: "10/02/2026", placesDisponibles: 8 }
      ]
    },
    {
      id: 3,
      nom: "UX / UI Design",
      descriptionCourte: "Concevez des interfaces centrées utilisateur, intuitives et esthétiques.",
      descriptionDetaillee: "Découvrez les méthodes de design thinking et de prototypage rapide.",
      prix: "200€ / session",
      niveau: "Débutant",
      capacite: "12 places par classes",
      duree: "1 jour",
      image: fondclassforma,
      sessions: [
        { ville: "Lyon", date: "05/02/2026", placesDisponibles: 10 },
        { ville: "Lille", date: "12/03/2026", placesDisponibles: 15 }
      ]
    },
    {
      id: 4,
      nom: "Data & Analyse",
      descriptionCourte: "Analysez les données pour prendre des décisions stratégiques éclairées.",
      descriptionDetaillee: "Introduction à la data science et à la visualisation de données.",
      prix: "300€ / session",
      niveau: "Intermediaire",
      capacite: "12 places par classes",
      duree: "1 jour",
      image: fondclassforma,
      sessions: [
        { ville: "Paris", date: "18/02/2026", placesDisponibles: 3 },
        { ville: "Nantes", date: "22/03/2026", placesDisponibles: 9 }
      ]
    }
  ];

  // Logic to handle custom scrollbar dragging
  const handleScroll = () => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    // Prevent division by zero if content fits exactly
    if (maxScroll <= 0) {
      setDragX(0);
      return;
    }

    const percent = slider.scrollLeft / maxScroll;
    const maxTrackScroll = track.offsetWidth - 24;
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

  // Also add global mouse up listener to stop dragging even if mouse leaves the track area
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

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
            key={f.id}
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
          // Allow jumping to position on click
          const rect = trackRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left - 9; // center handle
          const max = rect.width - 18;
          const clampedX = Math.max(0, Math.min(x, max));
          setDragX(clampedX);

          // Update scroll
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
            e.stopPropagation(); // prevent parent click logic double firing
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