import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logotritech from "../assets/logotritech.jpg";
import { ChevronDown, User, Settings, LogOut, FileText } from 'lucide-react';



function Header() {
  const [ProfilOuvert, setProfilOuvert] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (page) => {
  navigate(`/${page}`);
};

  const toggleMenuprofil = () => {
    setProfilOuvert(!ProfilOuvert);
  };

  const menuOptions = [
    // { label: "Accueil", link: "accueil" },
    { label: "Connexion", link: "connexion" },
    { label: "Inscription", link: "inscription" },
    { label: "DashboardApprenant", link: "dashboard/apprenant" },
    { label: "DashboardAdmin", link: "dashboard/admin" },
    { label: "DashboardFormateur", link: "dashboard/formateur" }
  ];

  return (
    <header style={{
    background: "linear-gradient(90deg, rgba(69,0,171,1) 0%, rgba(135,0,194,1) 100%)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)"
  }}
  className="shadow">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">

          {/* Logo */}
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px", cursor: "pointer" }}
            onClick={() => handleNavigation("accueil")}
          >
            <div className="d-flex align-items-center justify-content-center"
  style={{
    width: "64px",
    height: "64px",
    backgroundColor: "#fff",
    borderRadius: "50%"}}>
  <img
    src={logotritech}
    alt="Logo"
    style={{
      width: "40px",
      height: "40px",
      objectFit: "contain"}}/></div>
          </div>

          {/* Navigation */}
          <nav className="d-flex gap-5">
            <button className="btn btn-link text-white text-decoration-none"
              onClick={() => handleNavigation("accueil")}
            >
              Accueil
            </button>
            <button className="btn btn-link text-white text-decoration-none"
              onClick={() => handleNavigation("formations")}
            >
              Formations
            </button>
            <button className="btn btn-link text-white text-decoration-none"
              onClick={() => handleNavigation("apropos")}
            >
              À propos
            </button>
          </nav>

          {/* Profil */}
          <div className="position-relative">
            <button
              onClick={toggleMenuprofil}
              className="btn p-0 border-0 bg-transparent d-flex align-items-center gap-2"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Profil"
                className="rounded-circle border border-white"
                style={{ width: "45px", height: "45px" }}
              />
              <span className="text-white">▼</span>
            </button>

            {ProfilOuvert && (
  <div
    className="position-absolute end-0 rounded shadow"
    style={{
      width: "200px",
      backgroundColor: "rgba(97, 0, 171, 1)",
      top: "100%",
      marginTop: "6px",
      zIndex: 1
    }}
  >
    {menuOptions.map((option, index) => (
      <button
        key={index}
        className="btn w-100 text-start text-white"
        onClick={() => {
          handleNavigation(option.link);
          setProfilOuvert(false);
        }}
      >
        {option.label}
      </button>
    ))}
  </div>
)}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;