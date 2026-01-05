import { useState, useEffect } from "react";
import API_URL from "../api.js";

export default function DashboardFormateur() {
  const [menu, setMenu] = useState("sessions");
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const idFormateur = user?.idFormateur || user?.idUtilisateur;

  useEffect(() => {
    if (idFormateur) {
      chargerSessions();
    } else {
      setError("Formateur non connecté");
      setLoading(false);
    }
  }, [idFormateur]);

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

  const chargerApprenants = async (idSession) => {
    try {
      // 1. Charger Apprenants
      const resApp = await fetch(`${API_URL}/formateurs/sessions/${idSession}/apprenants`);
      const dataApp = await resApp.json();
      
      // 2. Charger Notes
      const resNotes = await fetch(`${API_URL}/formateurs/sessions/${idSession}/notes`);
      const dataNotes = resNotes.ok ? await resNotes.json() : [];

      // Fusionner pour avoir tout dans le même tableau
      const complet = dataApp.map(app => {
        const n = dataNotes.find(note => note.apprenant?.idApprenant === app.idApprenant);
        return {
          ...app,
          note: n?.valeur || null,
          commentaire: n?.commentaire || ""
        };
      });
      setApprenants(complet);
    } catch (err) { console.error(err); }
  };

  const changerSession = (id) => {
    setSelectedSession(id);
    setSelected(null);
    chargerApprenants(id);
  };

  // --- METHODE NOTE ---
  const sauvegarderNote = async (data) => {
    try {
      const response = await fetch(`${API_URL}/formateurs/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idApprenant: data.idApprenant,
          idSession: selectedSession,
          note: parseFloat(data.note),
          commentaire: data.commentaire
        })
      });
      if (response.ok) {
        alert("Note enregistrée !");
        chargerApprenants(selectedSession); // Rafraîchir la liste
        setSelected(null);
      }
    } catch (err) { alert("Erreur note"); }
  };

  // --- METHODE PRESENCE ---
  const marquerPresence = async (idApprenant, idSession, present) => {
    try {
      await fetch(`${API_URL}/formateurs/presences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idApprenant, idSession, idFormateur, present })
      });
    } catch (err) { console.error("Erreur présence", err); }
  };

  return (
    <div style={page}>
      <div style={container}>
        <div style={sidebar}>
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>TriTech</h1>
          </div>
          <MenuItem label="Sessions" active={menu === "sessions"} onClick={() => { setMenu("sessions"); setSelected(null); }} />
          <MenuItem label="Apprenants" active={menu === "apprenants"} onClick={() => { setMenu("apprenants"); setSelected(null); }} />
          <MenuItem label="Profil" active={menu === "profil"} onClick={() => { setMenu("profil"); setSelected(null); }} />
        </div>

        <div style={content}>
          {menu !== "profil" && sessions.length > 0 && (
            <div style={{ marginBottom: "25px", padding: "15px", background: "#f9f9f9", borderRadius: "10px" }}>
              <select value={selectedSession || ""} onChange={(e) => changerSession(Number(e.target.value))} style={selectStyle}>
                {sessions.map(s => (
                  <option key={s.idSession} value={s.idSession}>Session #{s.idSession} - {s.lieu?.ville}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? <Loader /> : (
            <>
              {menu === "apprenants" && !selected && <ApprenantsList apprenants={apprenants} onSelect={setSelected} />}
              {menu === "apprenants" && selected && <Notation apprenant={selected} onBack={() => setSelected(null)} onSave={sauvegarderNote} />}
              {menu === "sessions" && !selected && <SessionsList sessions={sessions} onSelect={setSelected} />}
              {menu === "sessions" && selected && (
                <SessionDetail 
                    session={selected} 
                    onBack={() => setSelected(null)} 
                    onMarquerPresence={marquerPresence} 
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

// --- SOUS-COMPOSANTS ---

function SessionDetail({ session, onBack, onMarquerPresence }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
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
    };
    init();
  }, [session.idSession]);

  const handleCheck = (app) => {
    const newStatus = !app.present;
    setList(list.map(item => item.idApprenant === app.idApprenant ? { ...item, present: newStatus } : item));
    onMarquerPresence(app.idApprenant, session.idSession, newStatus);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <h3>Présences - Session #{session.idSession}</h3>
      {list.map(a => (
        <label key={a.idApprenant} style={presenceRow(a.present)}>
          <input type="checkbox" checked={a.present} onChange={() => handleCheck(a)} style={{ marginRight: "10px" }} />
          {a.nom} {a.prenom}
        </label>
      ))}
    </FormCard>
  );
}

function Notation({ apprenant, onBack, onSave }) {
  const [note, setNote] = useState(apprenant.note ?? "");
  const [commentaire, setCommentaire] = useState(apprenant.commentaire ?? "");

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <h2>Noter : {apprenant.nom} {apprenant.prenom}</h2>
      <input type="number" placeholder="Note /20" value={note} onChange={e => setNote(e.target.value)} style={input} />
      <textarea placeholder="Commentaire" value={commentaire} onChange={e => setCommentaire(e.target.value)} style={textarea} />
      <button style={btnFull} onClick={() => onSave({ ...apprenant, note, commentaire })}>✅ Sauvegarder</button>
    </FormCard>
  );
}

// Les autres composants (ApprenantsList, SessionsList, ProfilFormateur) restent identiques à ton code original 
// car ils utilisent déjà les props passées. J'ai juste nettoyé la logique de data-binding.

/* --- STYLES ADDITIONNELS --- */
const presenceRow = (isPresent) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px",
  marginBottom: "8px",
  background: isPresent ? "#e8f5e9" : "#f9f9f9",
  borderRadius: "8px",
  border: isPresent ? "2px solid #4caf50" : "2px solid transparent",
  cursor: "pointer"
});

const selectStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "2px solid #7b2ff7",
  width: "100%",
  fontWeight: "bold"
};

// ... copier les autres styles de ton fichier original (page, container, sidebar, etc.)
const page = { minHeight: "100vh", background: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" };
const container = { width: "95%", maxWidth: "1200px", minHeight: "85vh", background: "#fff", borderRadius: "30px", display: "flex", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };
const sidebar = { width: "240px", padding: "30px", backgroundColor: "rgba(130, 3, 192, 1)", color: "#fff" };
const content = { flex: 1, padding: "40px", overflowY: "auto" };
const FormCard = ({ children }) => <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>{children}</div>;
const input = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" };
const textarea = { ...input, height: "100px" };
const btnFull = { width: "100%", padding: "12px", background: "#7b2ff7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const backBtn = { background: "none", border: "none", color: "#7b2ff7", cursor: "pointer", marginBottom: "15px", fontWeight: "bold" };

function MenuItem({ label, active, onClick }) {
    return (
      <div onClick={onClick} style={{
          padding: "12px 20px", borderRadius: "12px", marginBottom: "10px", cursor: "pointer", fontWeight: "bold",
          background: active ? "#fff" : "transparent", color: active ? "#7b2ff7" : "#fff", transition: "0.3s"
      }}>{label}</div>
    );
}

function Loader() { return <div style={{ textAlign: "center", padding: "50px" }}>Chargement...</div>; }

function ApprenantsList({ apprenants, onSelect }) {
    return (
      <div>
        <h2>Liste des Apprenants</h2>
        {apprenants.map(a => (
          <div key={a.idApprenant} style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #eee" }}>
            <span>{a.nom} {a.prenom} {a.note ? `(${a.note}/20)` : ""}</span>
            <button onClick={() => onSelect(a)} style={{ background: "#7b2ff7", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>Noter</button>
          </div>
        ))}
      </div>
    );
}

function SessionsList({ sessions, onSelect }) {
    return (
      <div>
        <h2>Mes Sessions</h2>
        {sessions.map(s => (
          <div key={s.idSession} style={{ padding: "15px", border: "1px solid #eee", marginBottom: "10px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
            <span>Session #{s.idSession} - {s.lieu?.ville}</span>
            <button onClick={() => onSelect(s)} style={{ background: "#7b2ff7", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>Gérer</button>
          </div>
        ))}
      </div>
    );
}

function ProfilFormateur({ formateur }) {
    return (
      <div>
        <h2>Mon Profil</h2>
        <p>Nom: {formateur.nom}</p>
        <p>Email: {formateur.email}</p>
      </div>
    );
}