import { useState, useEffect } from "react";
import API_URL from '../api.js';

// Composant principal du dashboard administrateur
export default function DashboardAdmin() {
  // État pour l'onglet actif (formateurs ou apprenants)
  const [menu, setMenu] = useState("formateurs");
  // État pour l'utilisateur sélectionné
  const [selectedUser, setSelectedUser] = useState(null);
  // État pour le mode (ajout ou modification)
  const [mode, setMode] = useState(null);
  // État pour la liste des formateurs
  const [formateurs, setFormateurs] = useState([]);
  // État pour la liste des apprenants
  const [apprenants, setApprenants] = useState([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour les erreurs
  const [error, setError] = useState(null);

  // Effet pour charger les données au montage et changement de menu
  useEffect(() => {
    chargerDonnees();
  }, [menu]);

  // Fonction pour charger les données des utilisateurs depuis l'API
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentative de connexion a:", `${API_URL}/admin/utilisateurs`);
      
      const response = await fetch(`${API_URL}/admin/utilisateurs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors' // Explicitly set CORS mode
      });
      
      console.log("Statut de la reponse:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
      }
      
      // Recuperer le texte brut
      const rawText = await response.text();
      console.log("Longueur de la reponse:", rawText.length);
      
      // Solution radicale : Parser avec une regex pour extraire juste ce qu'on a besoin
      let data = [];
      
      try {
        // Methode 1 : Essayer de parser normalement apres nettoyage agressif
        let cleanedText = rawText;
        
        // Trouver tous les ] et couper apres le premier qui semble valide
        const matches = [...cleanedText.matchAll(/\]/g)];
        if (matches.length > 0) {
          // Prendre le premier ] qui est suivi de peu de caracteres (probablement la vraie fin)
          for (let i = 0; i < matches.length; i++) {
            const endPos = matches[i].index + 1;
            const remaining = cleanedText.length - endPos;
            
            // Si apres le ] il reste moins de 200 caracteres de pollution
            if (remaining < 200 || i === 0) {
              cleanedText = cleanedText.substring(0, endPos);
              console.log(`Coupe a la position ${endPos}, reste ${remaining} chars`);
              break;
            }
          }
        }
        
        // Nettoyer les patterns invalides
        cleanedText = cleanedText.replace(/\}\}\}/g, '}}');
        cleanedText = cleanedText.replace(/\}\}\]/g, '}]');
        cleanedText = cleanedText.replace(/\]\]\]/g, ']]');
        
        try {
          data = JSON.parse(cleanedText);
          console.log("Parsing reussi apres nettoyage!");
        } catch (e) {
          console.log("Parsing echoue, tentative manuelle...");
          
          // Methode 2 : Parser manuellement les objets utilisateur
          // Regex pour trouver les utilisateurs avec leurs proprietes de base
          const userPattern = /"idUtilisateur":\s*(\d+)[\s\S]*?"nom":\s*"([^"]*)"[\s\S]*?"prenom":\s*"([^"]*)"[\s\S]*?"email":\s*"([^"]*)"/g;
          
          let match;
          const users = [];
          while ((match = userPattern.exec(rawText)) !== null) {
            const [, idUtilisateur, nom, prenom, email] = match;
            
            // Extraire l'objet complet autour de cette position
            const startPos = rawText.lastIndexOf('{', match.index);
            let endPos = rawText.indexOf('},', match.index);
            if (endPos === -1) endPos = rawText.indexOf('}]', match.index);
            if (endPos === -1) endPos = rawText.indexOf('}', match.index + 100);
            
            if (startPos !== -1 && endPos !== -1) {
              const userJson = rawText.substring(startPos, endPos + 1);
              
              try {
                const user = JSON.parse(userJson);
                users.push(user);
              } catch (e) {
                // Si le parsing echoue, creer un objet minimal
                const phoneMatch = userJson.match(/"telephone":\s*"([^"]*)"/);
                const idFormateurMatch = userJson.match(/"idFormateur":\s*(\d+)/);
                const idApprenantMatch = userJson.match(/"idApprenant":\s*(\d+)/);
                const idAdminMatch = userJson.match(/"idAdmin":\s*(\d+)/);
                
                users.push({
                  idUtilisateur: parseInt(idUtilisateur),
                  nom,
                  prenom,
                  email,
                  telephone: phoneMatch ? phoneMatch[1] : null,
                  idFormateur: idFormateurMatch ? parseInt(idFormateurMatch[1]) : null,
                  idApprenant: idApprenantMatch ? parseInt(idApprenantMatch[1]) : null,
                  idAdmin: idAdminMatch ? parseInt(idAdminMatch[1]) : null
                });
              }
            }
          }
          
          if (users.length > 0) {
            // Dedupliquer les utilisateurs par idUtilisateur
            const uniqueUsers = [];
            const seenIds = new Set();
            
            for (const user of users) {
              if (!seenIds.has(user.idUtilisateur)) {
                seenIds.add(user.idUtilisateur);
                uniqueUsers.push(user);
              }
            }
            
            data = uniqueUsers;
            console.log("Extraction manuelle reussie:", users.length, "trouves,", uniqueUsers.length, "uniques");
          } else {
            throw new Error("Impossible d'extraire les utilisateurs");
          }
        }
        
      } catch (error) {
        console.error("Erreur complete:", error);
        
        // Methode 3 : Solution de secours - donnees mockees pour permettre de travailler
        console.log("Utilisation de donnees de secours");
        alert("Le serveur retourne des donnees mal formees. Contactez l'administrateur backend pour corriger l'entite Attestation (ajoutez @JsonIgnore sur les relations circulaires).\n\nEn attendant, un mode de secours est active.");
        
        data = []; // Tableau vide pour eviter le crash
      }
      
      console.log("Nombre d'utilisateurs charges:", data.length);
      
      // Afficher la structure du premier utilisateur pour debug
      if (data.length > 0) {
        console.log("Structure du premier utilisateur:", Object.keys(data[0]));
        console.log("Premier utilisateur complet:", data[0]);
        
        // Afficher tous les IDs presents
        data.forEach((u, idx) => {
          console.log(`User ${idx}:`, {
            id: u.idUtilisateur,
            nom: u.nom,
            formateur: u.idFormateur,
            apprenant: u.idApprenant,
            admin: u.idAdmin
          });
        });
      }
      
      // Filtrage plus souple des formateurs
      const formateursList = data.filter(u => {
        const isFormateur = u.idFormateur !== undefined && 
                           u.idFormateur !== null && 
                           u.idFormateur !== '';
        if (isFormateur) {
          console.log("Formateur trouve:", u.nom, u.prenom, "ID:", u.idFormateur);
        }
        return isFormateur;
      });
      
      // Filtrage plus souple des apprenants
      const apprenantsList = data.filter(u => {
        // Un apprenant = pas formateur ET pas admin
        const hasNoFormateur = !u.idFormateur || u.idFormateur === null || u.idFormateur === '';
        const hasNoAdmin = !u.idAdmin || u.idAdmin === null || u.idAdmin === '';
        
        // ET a soit un idApprenant, soit une dateInscription, soit juste idUtilisateur
        const hasApprenantId = u.idApprenant !== undefined && u.idApprenant !== null;
        const hasDateInscription = u.dateInscription !== undefined && u.dateInscription !== null;
        const hasUserId = u.idUtilisateur !== undefined && u.idUtilisateur !== null;
        
        // Si pas formateur et pas admin, c'est probablement un apprenant
        const isApprenant = hasNoFormateur && hasNoAdmin && (hasApprenantId || hasDateInscription || hasUserId);
        
        if (isApprenant) {
          console.log("Apprenant trouve:", u.nom, u.prenom, {
            idApprenant: u.idApprenant,
            idUtilisateur: u.idUtilisateur,
            dateInscription: u.dateInscription
          });
        } else if (hasNoFormateur && hasNoAdmin) {
          console.log("Utilisateur sans role clair:", u.nom, u.prenom, {
            idFormateur: u.idFormateur,
            idApprenant: u.idApprenant,
            idAdmin: u.idAdmin,
            idUtilisateur: u.idUtilisateur
          });
        }
        return isApprenant;
      });

      console.log(`Resultat: ${formateursList.length} formateurs, ${apprenantsList.length} apprenants`);
      
      setFormateurs(formateursList);
      setApprenants(apprenantsList);
      
    } catch (err) {
      console.error("Erreur de chargement complete:", err);
      
      // Message d'erreur plus detaille
      let errorMessage = "Impossible de charger les donnees. ";
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage += "Verifiez que:\n" +
                       "1. Le backend est lance sur " + API_URL + "\n" +
                       "2. Les CORS sont correctement configures\n" +
                       "3. L'URL de l'API est correcte";
      } else if (err.message.includes('404')) {
        errorMessage += "L'endpoint /admin/utilisateurs n'existe pas sur le serveur.";
      } else if (err.message.includes('401') || err.message.includes('403')) {
        errorMessage += "Probleme d'authentification. Verifiez vos permissions.";
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const users = menu === "formateurs" ? formateurs : apprenants;

  // Fonction pour obtenir l'id selon le type d'utilisateur
  const getUserId = (user) => {
    if (user.idFormateur) return user.idFormateur;
    if (user.idApprenant) return user.idApprenant;
    if (user.idUtilisateur) return user.idUtilisateur;
    return user.id;
  };

  // Fonction pour ajouter un utilisateur
  const handleAdd = async (user) => {
    try {
      console.log("Ajout utilisateur:", user);

      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify(user)
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur ajoute");
      alert("Utilisateur ajoute avec succes !");
      
      await chargerDonnees();
      setSelectedUser(null);
      setMode(null);
      
    } catch (err) {
      console.error("Erreur ajout:", err);
      alert("Erreur : " + err.message);
    }
  };

  // Fonction pour modifier un utilisateur
  const handleEdit = async (user) => {
    try {
      console.log("Modification utilisateur:", user);
      
      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify(user)
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur modifie");
      alert("Utilisateur modifie avec succes !");
      
      await chargerDonnees();
      setSelectedUser(null);
      setMode(null);
      
    } catch (err) {
      console.error("Erreur modification:", err);
      alert("Erreur : " + err.message);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm("Etes-vous sur de vouloir supprimer cet utilisateur ?")) {
      return;
    }
    
    try {
      console.log("Suppression ID:", id);
      
      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: "DELETE",
        mode: 'cors'
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur supprime");
      alert("Utilisateur supprime avec succes !");
      
      await chargerDonnees();
      
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur : " + err.message);
    }
  };

  // Fonction pour sauvegarder un utilisateur (ajout ou modification)
  const handleSave = (user) => {
    if (mode === "add") {
      handleAdd(user);
    } else {
      handleEdit(user);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* SIDEBAR */}
        <div style={sidebarStyle}>
          <div style={{ marginBottom: "40px", paddingLeft: "10px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "#fff" }}>TriTech</h1>
            <p style={{ fontSize: "0.8rem", margin: "5px 0 0 0", opacity: 0.8 }}>Administration</p>
          </div>
          
          <MenuItem
            label="Formateurs"
            active={menu === "formateurs"}
            onClick={() => {
              setMenu("formateurs");
              setSelectedUser(null);
              setMode(null);
            }}
          />
          <MenuItem
            label="Apprenants"
            active={menu === "apprenants"}
            onClick={() => {
              setMenu("apprenants");
              setSelectedUser(null);
              setMode(null);
            }}
          />
        </div>

        {/* CONTENU DASHBOARD */}
        <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          {/* Message d'erreur */}
          {error && (
            <div style={errorBoxStyle}>
              <div>
                <strong>Erreur de connexion</strong>
                <pre style={{ 
                  fontSize: "0.85rem", 
                  marginTop: "10px", 
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%"
                }}>
                  {error}
                </pre>
              </div>
              <button onClick={chargerDonnees} style={retryBtnStyle}>
                Reessayer
              </button>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <>
              {!selectedUser && (
                <AdminList
                  title={menu}
                  users={users}
                  getUserId={getUserId}
                  onAdd={() => {
                    setMode("add");
                    setSelectedUser({
                      nom: "",
                      prenom: "",
                      email: "",
                      telephone: "",
                      motDePasse: ""
                    });
                  }}
                  onEdit={(u) => {
                    setMode("edit");
                    setSelectedUser(u);
                  }}
                  onDelete={handleDelete}
                />
              )}

              {selectedUser && (
                <UserForm
                  mode={mode}
                  user={selectedUser}
                  userType={menu}
                  onBack={() => {
                    setSelectedUser(null);
                    setMode(null);
                  }}
                  onSave={handleSave}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------  les composants du dashboard ---------------- */

function MenuItem({ label, active, onClick }) {
  // Composant pour un element du menu lateral
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 20px",
        borderRadius: active ? "16px 0 0 16px" : "16px",
        marginBottom: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        color: active ? "rgba(130, 3, 192, 1)" : "#fff",
        background: active ? "#fff" : "transparent",
        marginRight: active ? "-40px" : "0",
        paddingRight: active ? "50px" : "20px",
        transition: "all 0.3s ease"
      }}
    >
      {label}
    </div>
  );
}

function AdminList({ title, users, getUserId, onAdd, onEdit, onDelete }) {
  // Composant pour afficher la liste des utilisateurs (formateurs ou apprenants)
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ textTransform: "capitalize", fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
          {title === "formateurs" ? "Formateurs" : "Apprenants"}
        </h2>

        <button onClick={onAdd} style={addButtonStyle}>
          Ajouter
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}></div>
          <p style={{ fontSize: "1.1rem" }}>Aucun {title.slice(0, -1)} enregistre</p>
          <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>Cliquez sur "Ajouter" pour commencer</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {users.map((user) => {
            const userId = getUserId(user);
            return (
              <div key={userId} style={cardStyle}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1.05rem", marginBottom: "5px" }}>
                    {user.nom} {user.prenom}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>
                    {user.email || "Email non renseigne"}
                  </div>
                  {user.telephone && (
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {user.telephone}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => onEdit(user)} 
                    style={iconBtn} 
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(userId)} 
                    style={{ ...iconBtn, background: "#fee" }} 
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function UserForm({ mode, user, userType, onBack, onSave }) {
  // Composant pour le formulaire d'ajout/modification d'utilisateur
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.nom?.trim() || !form.prenom?.trim() || !form.email?.trim()) {
      alert("Les champs Nom, Prénom et Email sont obligatoires");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("L'email n'est pas valide");
      return;
    }

    if (mode === "add" && !form.motDePasse) {
      alert("Le mot de passe est obligatoire pour un nouvel utilisateur");
      return;
    }

    if (form.motDePasse && form.motDePasse.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div style={formCardStyle}>
      <button onClick={onBack} style={backBtnStyle}>
        ← Retour
      </button>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ 
          width: "80px", 
          height: "80px", 
          background: "linear-gradient(135deg, #a855f7, #6366f1)", 
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "2rem",
          fontWeight: "bold"
        }}>
          {mode === "add" ? "+" : (form.nom?.charAt(0) || "?")}
        </div>
        <h2 style={{ marginLeft: "20px", fontSize: "1.8rem" }}>
          {mode === "add" 
            ? `Ajouter un ${userType.slice(0, -1)}` 
            : `Modifier ${form.nom} ${form.prenom}`
          }
        </h2>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        <Input 
          label="Nom *" 
          value={form.nom} 
          onChange={(v) => setForm({ ...form, nom: v })} 
          placeholder="Nom de famille"
        />
        
        <Input 
          label="Prénom *" 
          value={form.prenom} 
          onChange={(v) => setForm({ ...form, prenom: v })} 
          placeholder="Prénom"
        />
        
        <Input 
          label="Email *" 
          type="email"
          value={form.email} 
          onChange={(v) => setForm({ ...form, email: v })} 
          placeholder="email@example.com"
        />
        
        <Input 
          label="Téléphone" 
          type="tel"
          value={form.telephone || ""} 
          onChange={(v) => setForm({ ...form, telephone: v })} 
          placeholder="06 12 34 56 78"
        />

        <div style={{ borderTop: "2px solid #eee", paddingTop: "20px", marginTop: "10px" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "15px", color: "#666" }}>
            {mode === "add" ? "Mot de passe *" : "Changer le mot de passe (optionnel)"}
          </h3>
          
          <Input 
            label={mode === "add" ? "Mot de passe *" : "Nouveau mot de passe"} 
            type="password"
            value={form.motDePasse || ""} 
            onChange={(v) => setForm({ ...form, motDePasse: v })} 
            placeholder="Minimum 6 caractères"
          />
          
          {mode === "edit" && (
            <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "8px" }}>
              Laissez vide pour conserver le mot de passe actuel
            </p>
          )}
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading} 
        style={{ ...submitBtnStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Enregistrement..." : mode === "add" ? "Ajouter" : "Modifier"}
      </button>
    </div>
  );
}

function Loader() {
  // Composant d'indicateur de chargement
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", gap: "20px" }}>
      <div style={{ 
        width: "50px", 
        height: "50px", 
        border: "5px solid #f3f3f3", 
        borderTop: "5px solid #7b2ff7", 
        borderRadius: "50%", 
        animation: "spin 1s linear infinite" 
      }} />
      <p style={{ color: "#999", fontSize: "0.95rem" }}>Chargement des données...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }) {
  // Composant pour un champ de saisie
  return (
    <div>
      <label style={{ 
        display: "block", 
        fontWeight: "600", 
        marginBottom: "8px", 
        color: "#333", 
        fontSize: "0.95rem" 
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  background: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const containerStyle = {
  width: "90%",
  maxWidth: "1200px",
  minHeight: "90vh",
  background: "#fff",
  borderRadius: "30px",
  display: "flex",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
};

const sidebarStyle = {
  width: "240px",
  padding: "30px",
  backgroundColor: "rgba(130, 3, 192, 1)",
  color: "#fff"
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  border: "1px solid #f0f0f0",
  transition: "all 0.3s ease"
};

const iconBtn = {
  background: "#f3f3f3",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "18px",
  transition: "all 0.2s"
};

const addButtonStyle = {
  padding: "12px 24px",
  background: "#7b2ff7",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s"
};

const formCardStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  background: "#fff",
  borderRadius: "20px",
  padding: "35px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const backBtnStyle = {
  marginBottom: "20px",
  background: "transparent",
  border: "none",
  color: "#7b2ff7",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  fontSize: "1rem",
  transition: "border 0.2s ease",
  boxSizing: "border-box"
};

const submitBtnStyle = {
  marginTop: "30px",
  width: "100%",
  padding: "14px",
  background: "#7b2ff7",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer"
};

const errorBoxStyle = {
  padding: "20px",
  background: "#fee",
  border: "2px solid #fcc",
  borderRadius: "10px",
  marginBottom: "20px",
  color: "#c00",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start"
};

const retryBtnStyle = {
  marginLeft: "15px",
  padding: "8px 16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  background: "#c00",
  color: "#fff",
  fontWeight: "bold",
  whiteSpace: "nowrap"
};