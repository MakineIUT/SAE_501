import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logotritech from "../assets/logotritech.jpg";
import { ChevronDown, User, Settings, LogOut, FileText } from 'lucide-react';
import { authService } from "../services/authService";
import { USE_MOCK_AUTH } from "../config";

function Header() {
  const [ProfilOuvert, setProfilOuvert] = useState(false);
  const [userRole, setUserRole] = useState(authService.getUserRole());
  const navigate = useNavigate();

  // Mettre à jour le rôle si on change manuellement (utile pour le rechargement)
  useEffect(() => {
    setUserRole(authService.getUserRole());
  }, []);

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  const toggleMenuprofil = () => {
    setProfilOuvert(!ProfilOuvert);
  };

  const handleLogout = () => {
    authService.logout();
    setProfilOuvert(false);
  };

  // Logique de filtrage des liens selon le rôle
  const getFilteredMenuOptions = () => {
    // Liens communs (ou pas de liens si pas besoin)
    let options = [];

    if (!userRole) {
      // VISITEUR (Non connecté)
      options = [
        { label: "Connexion", link: "connexion" },
        { label: "Inscription", link: "inscription" },
      ];
    } else {
      // CONNECTÉ - Liens spécifiques au rôle
      switch (userRole) {
        case 'apprenant':
          options.push({ label: "Mon Dashboard", link: "dashboard/apprenant" });
          break;
        case 'formateur':
          options.push({ label: "Espace Formateur", link: "dashboard/formateur" });
          break;
        case 'admin':
          options.push({ label: "Administration", link: "dashboard/admin" });
          break;
        default:
          // Rôle inconnu ?
          break;
      }
      // Ajouter le bouton déconnexion à la fin pour tous les connectés
      // Note: On peut le traiter à part, mais ici je l'ajoute comme option spéciale
    }
    return options;
  };

  const menuOptions = getFilteredMenuOptions();

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
                borderRadius: "50%"
              }}>
              <img
                src={logotritech}
                alt="Logo"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain"
                }} /></div>
          </div>

          {/* Navigation */}
          <nav className="d-flex gap-5 align-items-center">
            {/* DEBUG TOOL : Visible uniquement en mode TEST */}
            {USE_MOCK_AUTH && (
              <select
                className="form-select form-select-sm bg-warning text-dark border-0 fw-bold"
                style={{ maxWidth: '150px' }}
                value={userRole || ""}
                onChange={(e) => authService.setMockRole(e.target.value)}
              >
                <option value="">Mode: Visiteur</option>
                <option value="apprenant">Mode: Apprenant</option>
                <option value="formateur">Mode: Formateur</option>
                <option value="admin">Mode: Admin</option>
              </select>
            )}

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
                src="/user.png"
                alt="Profil"
                className="rounded-circle border border-white"
                style={{ width: "39.6px", height: "39.6px" }}
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

                {/* Bouton déconnexion séparé si l'utilisateur est connecté */}
                {userRole && (
                  <button
                    className="btn w-100 text-start text-danger border-top border-secondary mt-1 pt-2"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;