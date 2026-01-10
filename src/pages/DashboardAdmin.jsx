import { useState, useEffect } from "react";
import API_URL from '../api.js';

// composant du dashboard 
export default function DashboardAdmin() {
  const [menu, setMenu] = useState("formateurs");
  const [selectedUser, setSelectedUser] = useState(null);
  // mode d'action: "add" ou "edit"
  const [mode, setMode] = useState(null);
  // listes des utilisateurs
  const [formateurs, setFormateurs] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    chargerDonnees();
  }, [menu]);

  // chargement des données avec l'api 
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Chargement des utilisateurs...");
      const response = await fetch(`${API_URL}/admin/utilisateurs`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Données reçues:", data);
      
      // séparer les utilisateurs par type
      const formateursList = data.filter(u => 
        u.idFormateur !== undefined && 
        u.idFormateur !== null
      );
      
      // un apprenant est quelqu'un qui n'est NI formateur NI admin
      const apprenantsList = data.filter(u => 
        !u.idFormateur &&
        !u.idAdmin &&     
        (u.idApprenant !== undefined || u.dateInscription !== undefined) // a au moins un attribut d'apprenant
      );

      console.log(`📊 ${formateursList.length} formateurs, ${apprenantsList.length} apprenants`);
      
      setFormateurs(formateursList);
      setApprenants(apprenantsList);
      
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError("Impossible de charger les données. Vérifiez que le backend est lancé sur " + API_URL);
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

  // Ajout d'un utilisateur
  const handleAdd = async (user) => {
    try {
      console.log("Ajout utilisateur:", user);

      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      
      // gestions des erreurs
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur ajouté");
      alert("Utilisateur ajouté avec succès !");
      
      await chargerDonnees();
      setSelectedUser(null);
      setMode(null);
      
    } catch (err) {
      console.error("Erreur ajout:", err);
      alert("Erreur : " + err.message);
    }
  };

  // modification d'un utilisateur
  const handleEdit = async (user) => {
    try {
      console.log("Modification utilisateur:", user);
      
      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur modifié");
      alert("Utilisateur modifié avec succès !");
      
      await chargerDonnees();
      setSelectedUser(null);
      setMode(null);
      
    } catch (err) {
      console.error("Erreur modification:", err);
      alert("Erreur : " + err.message);
    }
  };

  // suppression d'un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }
    
    try {
      console.log("Suppression ID:", id);
      
      const endpoint = menu === "formateurs" ? "/admin/formateurs" : "/admin/apprenants";
      
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur ${response.status}`);
      }
      
      console.log("Utilisateur supprimé");
      alert("Utilisateur supprimé avec succès !");
      
      await chargerDonnees();
      
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur : " + err.message);
    }
  };

  // enregistrement des actions 
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
          {/* Message d'erreur lors du chargement */}
          {error && (
            <div style={errorBoxStyle}>
              <strong>{error}</strong>
              <button onClick={chargerDonnees} style={retryBtnStyle}>
                Réessayer
              </button>
            </div>
          )}

          {loading ? (
            // affiche le loader pendant le chargement
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

// élément de menu dans la sidebar
function MenuItem({ label, active, onClick }) {
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

/* ---------------- LISTE UTILISATEURS ---------------- */

function AdminList({ title, users, getUserId, onAdd, onEdit, onDelete }) {
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
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📋</div>
          <p style={{ fontSize: "1.1rem" }}>Aucun {title.slice(0, -1)} enregistré</p>
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
                    mail :  {user.email || "Email non renseigné"}
                  </div>
                  {user.telephone && (
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      telephone :  {user.telephone}
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

/* ---------------- FORMULAIRE AJOUT/MODIFICATION ---------------- */

function UserForm({ mode, user, userType, onBack, onSave }) {
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validations
    if (!form.nom?.trim() || !form.prenom?.trim() || !form.email?.trim()) {
      alert("Les champs Nom, Prénom et Email sont obligatoires");
      return;
    }

    // Validation email
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

    // sauvegarde des nouvelles données
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
          {mode === "add" ? "" : (form.nom?.charAt(0) || "?")}
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
        {loading ? " Enregistrement..." : mode === "add" ? "Ajouter" : "Modifier"}
      </button>
    </div>
  );
}


// loader chargement 
function Loader() {
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


// composant input 
function Input({ label, type = "text", value, onChange, placeholder }) {
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
  padding: "15px",
  background: "#fee",
  border: "1px solid #fcc",
  borderRadius: "10px",
  marginBottom: "20px",
  color: "#c00",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const retryBtnStyle = {
  marginLeft: "15px",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "none",
  background: "#c00",
  color: "#fff",
  fontWeight: "bold"
};