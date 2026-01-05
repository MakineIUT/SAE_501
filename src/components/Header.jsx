import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logotritech from "../assets/logotritech.jpg";

function Header() {
  const [ProfilOuvert, setProfilOuvert] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // charger l'utilisateur depuis localStorage
  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setUserRole(user.role); 
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error);
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  
  // recharger l'utilisateur à chaque changement de route
  useEffect(() => {
    loadUser();
  }, [location]);

  // navigation
  const handleNavigation = (page) => {
    navigate(`/${page}`);
    setProfilOuvert(false);
  };

  // menu profil 
  const toggleMenuprofil = () => {
    setProfilOuvert(!ProfilOuvert);
  };

  //déconnexion
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserRole(null);
    setCurrentUser(null);
    setProfilOuvert(false);
    navigate('/accueil');
  };

  // options des différents rôles
  const getFilteredMenuOptions = () => {
    let options = [];

    if (!userRole) {
      // visisteur (Non connecté)
      options = [
        { label: "Connexion", link: "connexion" },
        { label: "Inscription", link: "inscription" },
      ];
    } else {
      // connecté - affiche le nom de l'utilisateur
      if (currentUser) {
        options.push({
          label: `${currentUser.prenom} ${currentUser.nom}`,
          link: "",
          isHeader: true
        });
      }

      // Liens spécifiques au rôle
      switch (userRole) {
        case 'APPRENANT':
          options.push({ label: "Mon Dashboard", link: "dashboard/apprenant" });
          break;
        case 'FORMATEUR':
          options.push({ label: "Espace Formateur", link: "dashboard/formateur" });
          break;
        case 'ADMIN':
          options.push({ label: "Administration", link: "dashboard/admin" });
          break;
        default:
          break;
      }
    }
    return options;
  };


  const menuOptions = getFilteredMenuOptions();

  return (
    <header 
      style={{
        background: "linear-gradient(90deg, rgba(69,0,171,1) 0%, rgba(135,0,194,1) 100%)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)"
      }}
      className="shadow"
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">

          {/* Logo */}
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px", cursor: "pointer" }}
            onClick={() => handleNavigation("accueil")}
          >
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#fff",
                borderRadius: "50%"
              }}
            >
              <img
                src={logotritech}
                alt="Logo"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain"
                }} 
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="d-flex gap-5 align-items-center">
            <button 
              className="btn btn-link text-white text-decoration-none"
              onClick={() => handleNavigation("accueil")}
            >
              Accueil
            </button>
            <button 
              className="btn btn-link text-white text-decoration-none"
              onClick={() => handleNavigation("formations")}
            >
              Formations
            </button>
            <button 
              className="btn btn-link text-white text-decoration-none"
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
                  width: "220px",
                  backgroundColor: "rgba(97, 0, 171, 1)",
                  top: "100%",
                  marginTop: "6px",
                  zIndex: 1000
                }}
              >
                {menuOptions.map((option, index) => (
                  option.isHeader ? (
                    <div
                      key={index}
                      className="px-4 py-3 text-white font-weight-bold border-bottom border-secondary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      👤 {option.label}
                    </div>
                  ) : (
                    <button
                      key={index}
                      className="btn w-100 text-start text-white hover:bg-purple-700 transition"
                      onClick={() => handleNavigation(option.link)}
                    >
                      {option.label}
                    </button>
                  )
                ))}

                {/* Bouton déconnexion */}
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