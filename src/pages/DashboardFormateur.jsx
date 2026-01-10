import { useState, useEffect } from "react";
import { User, BookOpen, LayoutDashboard, Save, CheckCircle } from 'lucide-react';
import API_URL from "../api.js";

// Composant principal du dashboard formateur
export default function DashboardFormateur() {
  // État pour l'onglet actif du menu
  const [menu, setMenu] = useState("sessions");
  // État pour l'élément sélectionné (apprenant ou session)
  const [selected, setSelected] = useState(null);
  // État pour la liste des sessions
  const [sessions, setSessions] = useState([]);
  // État pour la liste des apprenants
  const [apprenants, setApprenants] = useState([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour les erreurs
  const [error, setError] = useState(null);
  // État pour la session sélectionnée
  const [selectedSession, setSelectedSession] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const idFormateur = user?.idFormateur || user?.idUtilisateur;

  // Effet pour charger les sessions au montage du composant
  useEffect(() => {
    if (idFormateur) {
      chargerSessions();
    } else {
      setError("Formateur non connecté");
      setLoading(false);
    }
  }, [idFormateur]);

  // Fonction pour charger les sessions du formateur
  const chargerSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/formateurs/${idFormateur}/sessions`);
      if (!response.ok) throw new Error("Erreur sessions");
      const data = await response.json();
      setSessions(data);
      if (data.length > 0) {
        setSelectedSession(data[0].idSession);
        await chargerApprenants(data[0].idSession);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les apprenants d'une session
  const chargerApprenants = async (idSession) => {
    try {
      const resApp = await fetch(`${API_URL}/formateurs/sessions/${idSession}/apprenants`);
      const dataApp = await resApp.json();
      
      const resNotes = await fetch(`${API_URL}/formateurs/sessions/${idSession}/notes`);
      const dataNotes = resNotes.ok ? await resNotes.json() : [];

      const complet = dataApp.map(app => {
        const n = dataNotes.find(note => note.apprenant?.idApprenant === app.idApprenant);
        return {
          ...app,
          note: n?.valeur || null,
          commentaire: n?.commentaire || ""
        };
      });
      setApprenants(complet);
    } catch (err) { 
      console.error(err); 
    }
  };

  // Fonction pour changer de session
  const changerSession = (id) => {
    setSelectedSession(id);
    setSelected(null);
    chargerApprenants(id);
  };

  // Fonction pour sauvegarder une note
  const sauvegarderNote = async (data) => {
    try {
      console.log("DEBUG - idFormateur:", idFormateur);
      console.log("DEBUG - data:", data);
      console.log("DEBUG - selectedSession:", selectedSession);
      
      const payload = {
        idApprenant: data.idApprenant,
        idSession: selectedSession,
        idFormateur: idFormateur,
        note: parseFloat(data.note)
      };
      
      console.log("Envoi:", payload);
      
      const response = await fetch(`${API_URL}/formateurs/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Note enregistrée !");
        chargerApprenants(selectedSession);
        setSelected(null);
      } else {
        const errorText = await response.text();
        alert("Erreur : " + errorText);
      }
    } catch (err) { 
      alert("Erreur note : " + err.message); 
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}>TriTech</h1>
          </div>
          <MenuItem label="Sessions" icon={<LayoutDashboard size={20} />} active={menu === "sessions"} onClick={() => { setMenu("sessions"); setSelected(null); }} />
          <MenuItem label="Apprenants" icon={<BookOpen size={20} />} active={menu === "apprenants"} onClick={() => { setMenu("apprenants"); setSelected(null); }} />
          <MenuItem label="Profil" icon={<User size={20} />} active={menu === "profil"} onClick={() => { setMenu("profil"); setSelected(null); }} />
        </div>

        <div style={styles.content}>
          {menu !== "profil" && sessions.length > 0 && (
            <div style={styles.sessionSelector}>
              <select value={selectedSession || ""} onChange={(e) => changerSession(Number(e.target.value))} style={styles.select}>
                {sessions.map(s => (
                  <option key={s.idSession} value={s.idSession}>
                    Session #{s.idSession} - {s.lieu?.ville || "En ligne"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? <Loader /> : error ? <p style={{ color: "red" }}>{error}</p> : (
            <>
              {menu === "apprenants" && !selected && <ApprenantsList apprenants={apprenants} onSelect={setSelected} />}
              {menu === "apprenants" && selected && <Notation apprenant={selected} onBack={() => setSelected(null)} onSave={sauvegarderNote} />}
              {menu === "sessions" && !selected && <SessionsList sessions={sessions} onSelect={setSelected} />}
              {menu === "sessions" && selected && (
                <SessionDetail 
                  session={selected} 
                  idFormateur={idFormateur}
                  onBack={() => setSelected(null)} 
                />
              )}
              {menu === "profil" && <ProfilFormateur formateur={user} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionDetail({ session, idFormateur, onBack }) {
  // État pour la liste des apprenants avec présences
  const [list, setList] = useState([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour la sauvegarde en cours
  const [saving, setSaving] = useState(false);

  // Effet pour charger les présences au montage
  useEffect(() => {
    chargerPresences();
  }, [session.idSession]);

  // Fonction pour charger les présences des apprenants
  const chargerPresences = async () => {
    try {
      const resApp = await fetch(`${API_URL}/formateurs/sessions/${session.idSession}/apprenants`);
      const dataApp = await resApp.json();
      
      const resPres = await fetch(`${API_URL}/formateurs/sessions/${session.idSession}/presences`);
      const dataPres = resPres.ok ? await resPres.json() : [];

      const fusion = dataApp.map(a => ({
        ...a,
        present: dataPres.find(p => p.apprenant?.idApprenant === a.idApprenant)?.present || false
      }));
      setList(fusion);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Fonction pour basculer la présence d'un apprenant
  const handleCheck = (app) => {
    setList(list.map(item => 
      item.idApprenant === app.idApprenant 
        ? { ...item, present: !item.present } 
        : item
    ));
  };

  // Fonction pour sauvegarder les présences
  const sauvegarderPresences = async () => {
    setSaving(true);
    try {
      const promises = list.map(app => 
        fetch(`${API_URL}/formateurs/presences`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idApprenant: app.idApprenant,
            idSession: session.idSession,
            idFormateur: idFormateur,
            present: app.present
          })
        })
      );

      await Promise.all(promises);
      alert("Présences enregistrées avec succès !");
      await chargerPresences();
    } catch (err) {
      console.error("Erreur présences", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <FormCard>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        Présences - Session #{session.idSession}
      </h3>
      
      <div style={{ marginBottom: "20px" }}>
        {list.map(a => (
          <label key={a.idApprenant} style={presenceRow(a.present)}>
            <input 
              type="checkbox" 
              checked={a.present} 
              onChange={() => handleCheck(a)} 
              style={{ marginRight: "12px", width: "18px", height: "18px", cursor: "pointer" }} 
            />
            <span style={{ fontSize: "1rem", fontWeight: "500" }}>
              {a.nom} {a.prenom}
            </span>
          </label>
        ))}
      </div>

      <button 
        onClick={sauvegarderPresences} 
        disabled={saving}
        style={{
          ...styles.btnFull,
          opacity: saving ? 0.6 : 1,
          cursor: saving ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        {saving ? "Enregistrement..." : (
          <>
            <Save size={18} />
            Sauvegarder les présences
          </>
        )}
      </button>
    </FormCard>
  );
}

function Notation({ apprenant, onBack, onSave }) {
  // État pour la note
  const [note, setNote] = useState(apprenant.note ?? "");

  // Fonction pour soumettre la note
  const handleSubmit = () => {
    if (!note || note < 0 || note > 20) {
      alert("Veuillez entrer une note entre 0 et 20");
      return;
    }
    
    console.log("Apprenant complet:", apprenant);
    console.log("ID Apprenant:", apprenant.idApprenant);
    
    onSave({ 
      idApprenant: apprenant.idApprenant || apprenant.idUtilisateur,
      note 
    });
  };

  return (
    <FormCard>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        Noter : {apprenant.nom} {apprenant.prenom}
      </h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
          Note sur 20
        </label>
        <input 
          type="number" 
          min="0" 
          max="20" 
          step="0.5"
          placeholder="Ex: 15.5" 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          style={styles.input} 
        />
      </div>

      <button style={styles.btnFull} onClick={handleSubmit}>
        <CheckCircle size={18} style={{ marginRight: "8px" }} />
        Enregistrer la note
      </button>
    </FormCard>
  );
}

const presenceRow = (isPresent) => ({
  display: "flex",
  alignItems: "center",
  padding: "15px",
  marginBottom: "10px",
  background: isPresent ? "#e8f5e9" : "#fff",
  borderRadius: "12px",
  border: `2px solid ${isPresent ? "#4caf50" : "#e0e0e0"}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: isPresent ? "0 2px 8px rgba(76, 175, 80, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)"
});

const styles = {
  page: { 
    minHeight: "100vh", 
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "20px" 
  },
  container: { 
    width: "95%", 
    maxWidth: "1200px", 
    minHeight: "85vh", 
    background: "#fff", 
    borderRadius: "30px", 
    display: "flex", 
    overflow: "hidden", 
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)" 
  },
  sidebar: { 
    width: "260px", 
    padding: "40px 20px", 
    background: "linear-gradient(180deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)", 
    color: "#fff" 
  },
  content: { 
    flex: 1, 
    padding: "40px", 
    overflowY: "auto", 
    background: "#fafbfc" 
  },
  sessionSelector: { 
    marginBottom: "30px", 
    padding: "20px", 
    background: "#fff", 
    borderRadius: "15px", 
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)" 
  },
  select: { 
    width: "100%", 
    padding: "12px 16px", 
    borderRadius: "10px", 
    border: "2px solid rgba(130, 3, 192, 0.3)", 
    fontSize: "1rem", 
    fontWeight: "600",
    cursor: "pointer",
    background: "#fff"
  },
  input: { 
    width: "100%", 
    padding: "14px", 
    borderRadius: "10px", 
    border: "2px solid #e0e0e0", 
    fontSize: "1rem",
    transition: "border 0.3s ease"
  },
  btnFull: { 
    width: "100%", 
    padding: "14px", 
    background: "linear-gradient(135deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)", 
    color: "#fff", 
    border: "none", 
    borderRadius: "10px", 
    cursor: "pointer", 
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  backBtn: { 
    background: "none", 
    border: "none", 
    color: "rgba(130, 3, 192, 1)", 
    cursor: "pointer", 
    marginBottom: "20px", 
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "8px 0"
  }
};

function MenuItem({ label, icon, active, onClick }) {
  // Composant pour un élément du menu latéral
  return (
    <div onClick={onClick} style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "14px 20px",
      borderRadius: active ? "16px 0 0 16px" : "16px",
      marginBottom: "8px",
      marginRight: active ? "-20px" : "0",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.95rem",
      color: active ? "rgba(130, 3, 192, 1)" : "#fff",
      background: active ? "#fff" : "transparent",
      transition: "all 0.3s ease",
      position: "relative",
      zIndex: active ? 10 : 1
    }}>
      {icon} <span>{label}</span>
    </div>
  );
}

function Loader() { 
  // Composant d'indicateur de chargement
  return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <div style={{ 
        display: "inline-block", 
        width: "50px", 
        height: "50px", 
        border: "5px solid #f3f3f3", 
        borderTop: "5px solid rgba(130, 3, 192, 1)", 
        borderRadius: "50%", 
        animation: "spin 1s linear infinite" 
      }}></div>
      <p style={{ marginTop: "20px", color: "#666" }}>Chargement...</p>
    </div>
  );
}

function ApprenantsList({ apprenants, onSelect }) {
  // Composant pour afficher la liste des apprenants
  return (
    <div>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "25px", color: "#333" }}>Liste des Apprenants</h2>
      <div style={{ background: "#fff", borderRadius: "15px", padding: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {apprenants.map(a => (
          <div key={a.idApprenant} style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "16px 20px", 
            borderBottom: "1px solid #f0f0f0" 
          }}>
            <span style={{ fontSize: "1rem", fontWeight: "500" }}>
              {a.nom} {a.prenom} 
              {a.note && <span style={{ marginLeft: "10px", color: "#4caf50", fontWeight: "bold" }}>({a.note}/20)</span>}
            </span>
            <button onClick={() => onSelect(a)} style={{ 
              background: "rgba(130, 3, 192, 1)", 
              color: "#fff", 
              border: "none", 
              padding: "8px 20px", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              Noter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionsList({ sessions, onSelect }) {
  // Composant pour afficher la liste des sessions
  return (
    <div>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "25px", color: "#333" }}>Mes Sessions</h2>
      <div style={{ display: "grid", gap: "15px" }}>
        {sessions.map(s => (
          <div key={s.idSession} style={{ 
            padding: "20px", 
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                Session #{s.idSession}
              </h3>
              <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                {s.lieu?.ville || "En ligne"}
              </p>
            </div>
            <button onClick={() => onSelect(s)} style={{ 
              background: "rgba(130, 3, 192, 1)", 
              color: "#fff", 
              border: "none", 
              padding: "10px 24px", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontWeight: "600"
            }}>
              Gérer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilFormateur({ formateur }) {
  // Composant pour afficher le profil du formateur
  return (
    <div style={{ 
      background: "#fff", 
      padding: "40px", 
      borderRadius: "20px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)" 
    }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "25px", color: "#333" }}>Mon Profil</h2>
      <div style={{ fontSize: "1rem", lineHeight: "2" }}>
        <p><strong>Nom:</strong> {formateur?.nom}</p>
        <p><strong>Prénom:</strong> {formateur?.prenom}</p>
        <p><strong>Email:</strong> {formateur?.email}</p>
        <p><strong>Spécialité:</strong> {formateur?.specialite || "Non définie"}</p>
      </div>
    </div>
  );
}

function FormCard({ children }) {
  // Composant wrapper pour les formulaires
  return (
    <div style={{ 
      maxWidth: "700px", 
      margin: "0 auto", 
      background: "#fff", 
      borderRadius: "20px", 
      padding: "35px", 
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)" 
    }}>
      {children}
    </div>
  );
}