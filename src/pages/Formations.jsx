import { useRef, useState, useEffect } from "react";
import FormationCard from "../components/FormationCard";
import Session from "../components/Session";
import { useNavigate } from "react-router-dom";
import fondclassforma from "../assets/fondclassforma.jpg";

export default function Formations() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  const user = localStorage.getItem("user");

  const formations = [
    {
      id: 1,
      nom: "Développement Web",
      description: "Créer des sites et applications modernes",
      image: fondclassforma
    },
    {
      id: 2,
      nom: "Cybersécurité",
      description: "Protéger les sytèmes et les données",
      image: fondclassforma
    },
    {
      id: 3,
      nom: "UX / UI Design",
      description: "Concevoir des interfaces efficaces.",
      image: fondclassforma
    },
    {
      id: 4,
      nom: "Data & Analyse",
      description: "Comprendre et exploiter les données.",
      image: fondclassforma
    }
  ];

  // synchronisation scroll → curseur
  const handleScroll = () => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    const maxScroll = slider.scrollWidth - window.innerWidth;
    const percent = slider.scrollLeft / maxScroll;
    setDragX(percent * track.offsetWidth);
  };

  // curseur → scroll
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const track = trackRef.current;
    const slider = sliderRef.current;
    const rect = track.getBoundingClientRect();

    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));

    setDragX(x);

    const percent = x / rect.width;
    const maxScroll = slider.scrollWidth - window.innerWidth;
    slider.scrollLeft = percent * maxScroll;
  };

  const handleInscription = (formation) => {
    if (!user) {
      localStorage.setItem("pendingFormation", formation.id);
      navigate("/inscription");
    } else {
      setSelectedFormation(formation);
      setOpenModal(true);
    }
  };

  useEffect(() => {
    sliderRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      sliderRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#f2e7f9", padding: "80px 0" }}>
      <div
        ref={sliderRef}
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none"
        }}
      >
        {formations.map((f) => (
          <FormationCard
            key={f.id}
            formation={f}
            onInscription={() => handleInscription(f)}
          />
        ))}
      </div>

      {/* CURSEUR */}
      <div
        ref={trackRef}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{
          width: "260px",
          height: "6px",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "6px",
          margin: "60px auto",
          position: "relative"
        }}
      >
        <div
          onMouseDown={() => setIsDragging(true)}
          style={{
            width: "18px",
            height: "18px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "-6px",
            left: dragX,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer"
          }}
        />
      </div>

      {openModal && (
        <Session
          formation={selectedFormation}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}