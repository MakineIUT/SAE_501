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

  // Récupérer l'ID du formateur connecté depuis localStorage
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Erreur lecture localStorage:", e);
      return null;
    }
  };

  const user = getUserFromStorage();
  const idFormateur = user?.idFormateur || user?.idUtilisateur;

  console.log("User connecté:", user);
  console.log("ID Formateur:", idFormateur);

  // Charger les données au démarrage
  useEffect(() => {
    if (idFormateur) {
      chargerSessions();
    } else {
      setError("Formateur non connecté - Veuillez vous reconnecter");
      setLoading(false);
    }
  }, [idFormateur]);

  // Charger les sessions du formateur
  const chargerSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Chargement des sessions pour formateur ${idFormateur}...`);
      const response = await fetch(`${API_URL}/formateurs/${idFormateur}/sessions`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ Sessions reçues:", data);
      
      if (!data || data.length === 0) {
        setError("Aucune session assignée à ce formateur");
        setSessions([]);
        setLoading(false);
        return;
      }
      
      setSessions(data);
      
      // Sélectionner automatiquement la première session
      setSelectedSession(data[0].idSession);
      await chargerApprenants(data[0].idSession);
      
    } catch (err) {
      console.error("❌ Erreur chargement sessions:", err);
      setError("Impossible de charger les sessions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les apprenants d'une session
  const chargerApprenants = async (idSession) => {
    try {
      console.log(`Chargement apprenants pour session ${idSession}...`);
      
      const response = await fetch(`${API_URL}/formateurs/sessions/${idSession}/apprenants`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Apprenants reçus:", data);
      
      if (!data || data.length === 0) {
        console.log("⚠️ Aucun apprenant pour cette session");
        setApprenants([]);
        return;
      }
      
      // Charger les notes
      console.log("Chargement des notes...");
      const responseNotes = await fetch(`${API_URL}/formateurs/sessions/${idSession}/notes`);
      const notes = responseNotes.ok ? await responseNotes.json() : [];
      console.log("✅ Notes reçues:", notes);
      
      // Fusionner apprenants et notes
      const apprenantsAvecNotes = data.map(app => {
        const note = notes.find(n => n.apprenant?.idApprenant === app.idApprenant);
        return {
          id: app.idApprenant,
          idApprenant: app.idApprenant,
          nom: app.nom,
          prenom: app.prenom,
          email: app.email,
          note: note?.valeur || null,
          commentaire: note?.commentaire || ""
        };
      });
      
      console.log("✅ Apprenants avec notes:", apprenantsAvecNotes);
      setApprenants(apprenantsAvecNotes);
      
    } catch (err) {
      console.error("❌ Erreur chargement apprenants:", err);
      setApprenants([]);
    }
  };

  // Changer de session
  const changerSession = async (idSession) => {
    console.log("Changement vers session:", idSession);
    setSelectedSession(idSession);
    setSelected(null);
    await chargerApprenants(idSession);
  };

  // Sauvegarder la note d'un apprenant
  const sauvegarderNote = async (apprenant) => {
    try {
      console.log("💾 Sauvegarde note:", {
        idApprenant: apprenant.idApprenant,
        idSession: selectedSession,
        note: apprenant.note,
        commentaire: apprenant.commentaire
      });
      
      const response = await fetch(`${API_URL}/formateurs/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idApprenant: apprenant.idApprenant,
          idSession: selectedSession,
          note: apprenant.note
        })
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erreur API:", text);
        throw new Error(text || "Erreur sauvegarde note");
      }
      
      console.log("✅ Note sauvegardée");
      alert("✅ Note enregistrée avec succès");
      
      // Recharger les apprenants
      await chargerApprenants(selectedSession);
      setSelected(null);
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("❌ Erreur : " + err.message);
    }
  };

  // Marquer la présence
  const marquerPresence = async (idApprenant, idSession, present) => {
    try {
      console.log("✓ Marquage présence:", { idApprenant, idSession, idFormateur, present });
      
      const response = await fetch(`${API_URL}/formateurs/presences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idApprenant,
          idSession,
          idFormateur,
          present
        })
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erreur API:", text);
        throw new Error(text || "Erreur marquage présence");
      }
      
      console.log("✅ Présence marquée");
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("❌ Erreur : " + err.message);
    }
  };

  // Charger les présences d'une session
  const chargerPresences = async (idSession) => {
    try {
      console.log(`Chargement présences session ${idSession}...`);
      const response = await fetch(`${API_URL}/formateurs/sessions/${idSession}/presences`);
      
      if (!response.ok) {
        console.error("❌ Erreur chargement présences");
        return [];
      }
      
      const data = await response.json();
      console.log("✅ Présences reçues:", data);
      return data;
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      return [];
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        <div style={sidebar}>
          <div style={{ marginBottom: "40px", paddingLeft: "10px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "#fff" }}>TriTech</h1>
            <p style={{ fontSize: "0.8rem", margin: "5px 0 0 0", opacity: 0.8 }}>Espace Formateur</p>
          </div>
          <MenuItem label="Sessions" active={menu === "sessions"} onClick={() => { setMenu("sessions"); setSelected(null); }} />
          <MenuItem label="Apprenants" active={menu === "apprenants"} onClick={() => { setMenu("apprenants"); setSelected(null); }} />
          <MenuItem label="Profil" active={menu === "profil"} onClick={() => { setMenu("profil"); setSelected(null); }} />
        </div>

        <div style={content}>
          {error && (
            <div style={{ padding: "15px", background: "#fee", border: "1px solid #fcc", borderRadius: "10px", marginBottom: "20px", color: "#c00" }}>
              <strong>⚠️ {error}</strong>
              <button onClick={chargerSessions} style={{ marginLeft: "15px", padding: "6px 12px", cursor: "pointer", borderRadius: "6px", border: "none", background: "#c00", color: "#fff" }}>
                🔄 Réessayer
              </button>
            </div>
          )}

          {/* Sélecteur de session */}
          {menu !== "profil" && sessions.length > 0 && (
            <div style={{ marginBottom: "25px", padding: "15px", background: "#f9f9f9", borderRadius: "10px" }}>
              <label style={{ fontWeight: "bold", marginRight: "10px", fontSize: "0.95rem" }}>📅 Session active :</label>
              <select 
                value={selectedSession || ""} 
                onChange={(e) => changerSession(Number(e.target.value))}
                style={{ padding: "10px 15px", borderRadius: "8px", border: "2px solid #7b2ff7", cursor: "pointer", fontWeight: "500", fontSize: "0.95rem" }}
              >
                {sessions.map(s => (
                  <option key={s.idSession} value={s.idSession}>
                    Session #{s.idSession} - {s.lieu?.ville || "Lieu inconnu"} - {new Date(s.dateDebut).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <>
              {menu === "apprenants" && !selected && (
                <ApprenantsList apprenants={apprenants} onSelect={setSelected} />
              )}

              {menu === "apprenants" && selected && (
                <Notation
                  apprenant={selected}
                  onBack={() => setSelected(null)}
                  onSave={sauvegarderNote}
                />
              )}

              {menu === "profil" && <ProfilFormateur formateur={user} />}

              {menu === "sessions" && !selected && (
                <SessionsList sessions={sessions} onSelect={setSelected} />
              )}

              {menu === "sessions" && selected && (
                <SessionDetail
                  session={selected}
                  onBack={() => setSelected(null)}
                  onMarquerPresence={marquerPresence}
                  chargerPresences={chargerPresences}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MENU ITEM ---------------- */

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

/* ---------------- APPRENANTS ---------------- */

function ApprenantsList({ apprenants, onSelect }) {
  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>👥 Apprenants de la session</h2>

      {apprenants.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📋</div>
          <p style={{ fontSize: "1.1rem" }}>Aucun apprenant inscrit pour cette session</p>
          <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>Les apprenants apparaîtront ici une fois inscrits</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {apprenants.map(a => (
            <Card key={a.idApprenant}>
              <div>
                <span style={{ fontWeight: "bold", fontSize: "1.05rem" }}>{a.nom} {a.prenom}</span>
                {a.note !== null && (
                  <span style={{ marginLeft: "15px", padding: "4px 10px", background: "#e0f2e9", color: "#2d6a4f", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600" }}>
                    Note: {a.note}/20
                  </span>
                )}
              </div>
              <button onClick={() => onSelect(a)} style={btn}>
                {a.note !== null ? "✏️ Modifier" : "📝 Noter"}
              </button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- NOTATION ---------------- */

function Notation({ apprenant, onBack, onSave }) {
  const [edit, setEdit] = useState(apprenant.note === null);
  const [note, setNote] = useState(apprenant.note ?? "");
  const [commentaire, setCommentaire] = useState(apprenant.commentaire ?? "");

  const noteNumber = parseFloat(note);
  const favorable = !isNaN(noteNumber) && noteNumber >= 10;

  if (!edit) {
    return (
      <FormCard>
        <button onClick={onBack} style={backBtn}>← Retour</button>

        <h2 style={{ marginBottom: "20px" }}>{apprenant.nom} {apprenant.prenom}</h2>

        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
          <p style={{ marginBottom: "15px" }}><strong>Note :</strong> <span style={{ fontSize: "1.5rem", color: "#7b2ff7", fontWeight: "bold" }}>{note}/20</span></p>
          <p style={{ marginBottom: "15px" }}><strong>Commentaire :</strong> {commentaire || <em style={{ color: "#999" }}>Aucun commentaire</em>}</p>
          <p>
            <strong>Attestation :</strong>{" "}
            <span style={{ 
              padding: "6px 12px", 
              borderRadius: "6px", 
              fontWeight: "bold",
              background: favorable ? "#d4edda" : "#f8d7da",
              color: favorable ? "#155724" : "#721c24"
            }}>
              {favorable ? "✅ Favorable" : "❌ Défavorable"}
            </span>
          </p>
        </div>

        <button style={btnFull} onClick={() => {
          alert("📄 Fonctionnalité de téléchargement PDF à venir");
        }}>
          📥 Télécharger l'attestation PDF
        </button>

        <button
          style={{ ...btnFull, background: "#eee", color: "#000", marginTop: "10px" }}
          onClick={() => setEdit(true)}
        >
          ✏️ Modifier la note
        </button>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>

      <h2 style={{ marginBottom: "20px" }}>{apprenant.nom} {apprenant.prenom}</h2>

      <div>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Note /20 *
        </label>
        <input
          placeholder="Ex: 15.5"
          type="number"
          min="0"
          max="20"
          step="0.5"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={input}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Commentaire (optionnel)
        </label>
        <textarea
          placeholder="Saisissez vos observations sur l'apprenant..."
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)}
          style={textarea}
        />
      </div>

      <button
        style={btnFull}
        onClick={() => {
          if (!note || isNaN(parseFloat(note))) {
            alert("⚠️ Veuillez entrer une note valide");
            return;
          }
          const noteValue = parseFloat(note);
          if (noteValue < 0 || noteValue > 20) {
            alert("⚠️ La note doit être entre 0 et 20");
            return;
          }
          onSave({ ...apprenant, note: noteValue, commentaire });
        }}
      >
        ✅ Enregistrer la note
      </button>
    </FormCard>
  );
}

/* ---------------- SESSIONS ---------------- */

function SessionsList({ sessions, onSelect }) {
  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>📚 Mes sessions de formation</h2>
      
      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📅</div>
          <p style={{ fontSize: "1.1rem" }}>Aucune session disponible</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {sessions.map(s => (
            <Card key={s.idSession}>
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "1.05rem" }}>
                  Session #{s.idSession}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  <span>📍 {s.lieu?.ville || "Lieu non défini"}</span>
                  <span>📅 {new Date(s.dateDebut).toLocaleDateString('fr-FR')}</span>
                  <span>👥 {s.capaciteMax - s.capaciteRestante}/{s.capaciteMax} inscrits</span>
                </div>
              </div>
              <button onClick={() => onSelect(s)} style={btn}>
                Gérer →
              </button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function SessionDetail({ session, onBack, onMarquerPresence, chargerPresences }) {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerApprenantsEtPresences();
  }, [session.idSession]);

  const chargerApprenantsEtPresences = async () => {
    try {
      setLoading(true);
      console.log("Chargement détails session...");
      
      // Charger les apprenants
      const resApp = await fetch(`${API_URL}/formateurs/sessions/${session.idSession}/apprenants`);
      const dataApp = await resApp.json();
      console.log("Apprenants:", dataApp);
      
      // Charger les présences
      const presences = await chargerPresences(session.idSession);
      console.log("Présences:", presences);
      
      // Fusionner
      const apprenantsAvecPresence = dataApp.map(app => {
        const presence = presences.find(p => p.apprenant?.idApprenant === app.idApprenant);
        return {
          ...app,
          present: presence?.present || false
        };
      });
      
      setApprenants(apprenantsAvecPresence);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (idApprenant, currentState) => {
    // Mise à jour locale immédiate
    setApprenants(apprenants.map(a =>
      a.idApprenant === idApprenant ? { ...a, present: !a.present } : a
    ));
    
    // Appel API
    await onMarquerPresence(idApprenant, session.idSession, !currentState);
  };

  if (loading) return <Loader />;

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>

      <h2 style={{ marginBottom: "20px" }}>Session #{session.idSession}</h2>
      
      <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "10px", marginBottom: "25px" }}>
        <p style={{ margin: "8px 0" }}><strong>📅 Date :</strong> {new Date(session.dateDebut).toLocaleDateString('fr-FR')}</p>
        <p style={{ margin: "8px 0" }}><strong>📍 Lieu :</strong> {session.lieu?.ville || "Non défini"}</p>
        <p style={{ margin: "8px 0" }}><strong>👥 Capacité :</strong> {session.capaciteMax - session.capaciteRestante}/{session.capaciteMax} inscrits</p>
      </div>

      <div style={{ marginTop: "30px", borderTop: "2px solid #eee", paddingTop: "20px" }}>
        <h3 style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
          ✓ Liste de présence
        </h3>
        
        {apprenants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
            <p>Aucun apprenant inscrit à cette session</p>
          </div>
        ) : (
          apprenants.map(a => (
            <label key={a.idApprenant} style={{ 
              display: "flex", 
              alignItems: "center",
              padding: "12px",
              marginTop: "8px",
              background: a.present ? "#e8f5e9" : "#f9f9f9",
              borderRadius: "8px",
              cursor: "pointer",
              border: a.present ? "2px solid #4caf50" : "2px solid transparent",
              transition: "all 0.2s"
            }}>
              <input 
                type="checkbox" 
                checked={a.present} 
                onChange={() => toggle(a.idApprenant, a.present)}
                style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
              />
              <span style={{ fontWeight: a.present ? "bold" : "normal", flex: 1 }}>
                {a.nom} {a.prenom}
              </span>
              {a.present && <span style={{ color: "#4caf50", fontWeight: "bold" }}>✓</span>}
            </label>
          ))
        )}
      </div>
    </FormCard>
  );
}

/* ---------------- PROFIL ---------------- */

function ProfilFormateur({ formateur }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: formateur?.nom || "",
    prenom: formateur?.prenom || "",
    email: formateur?.email || "",
    telephone: formateur?.telephone || "",
    motDePasse: "",
    confirmMotDePasse: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validations
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert("⚠️ Les champs Nom, Prénom et Email sont obligatoires");
      return;
    }

    if (formData.motDePasse && formData.motDePasse !== formData.confirmMotDePasse) {
      alert("⚠️ Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.motDePasse && formData.motDePasse.length < 6) {
      alert("⚠️ Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      console.log("💾 Modification du profil formateur:", formData);

      // Préparer les données à envoyer
      const dataToSend = {
        idFormateur: formateur.idFormateur || formateur.idUtilisateur,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone
      };

      // Ajouter le mot de passe seulement s'il est renseigné
      if (formData.motDePasse) {
        dataToSend.motDePasse = formData.motDePasse;
      }

      const response = await fetch(`${API_URL}/admin/formateurs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de la modification");
      }

      console.log("✅ Profil modifié avec succès");
      alert("✅ Vos informations ont été mises à jour avec succès !");

      // Mettre à jour le localStorage
      const updatedUser = { ...formateur, ...dataToSend };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Réinitialiser les mots de passe
      setFormData(prev => ({ ...prev, motDePasse: "", confirmMotDePasse: "" }));
      setEditMode(false);

      // Recharger la page pour mettre à jour toutes les données
      window.location.reload();

    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("❌ Erreur lors de la modification : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!editMode) {
    return (
      <FormCard>
        <h2 style={{ marginBottom: "25px" }}>👤 Mon profil formateur</h2>
        
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", marginBottom: "25px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", color: "#666", fontSize: "0.9rem" }}>Nom</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem" }}>{formateur?.nom || "Non renseigné"}</p>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", color: "#666", fontSize: "0.9rem" }}>Prénom</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem" }}>{formateur?.prenom || "Non renseigné"}</p>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", color: "#666", fontSize: "0.9rem" }}>Email</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem" }}>{formateur?.email || "Non renseigné"}</p>
          </div>
          <div>
            <label style={{ fontWeight: "600", color: "#666", fontSize: "0.9rem" }}>Téléphone</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem" }}>{formateur?.telephone || "Non renseigné"}</p>
          </div>
        </div>

        <button style={btnFull} onClick={() => setEditMode(true)}>
          ✏️ Modifier mes informations
        </button>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <h2 style={{ marginBottom: "25px" }}>✏️ Modifier mon profil</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Nom *
        </label>
        <input
          type="text"
          value={formData.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          style={input}
          placeholder="Votre nom"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Prénom *
        </label>
        <input
          type="text"
          value={formData.prenom}
          onChange={(e) => handleChange("prenom", e.target.value)}
          style={input}
          placeholder="Votre prénom"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          style={input}
          placeholder="votre.email@example.com"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
          Téléphone
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          style={input}
          placeholder="06 12 34 56 78"
        />
      </div>

      <div style={{ borderTop: "2px solid #eee", paddingTop: "20px", marginTop: "30px" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "15px", color: "#666" }}>🔒 Changer le mot de passe (optionnel)</h3>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={formData.motDePasse}
            onChange={(e) => handleChange("motDePasse", e.target.value)}
            style={input}
            placeholder="Minimum 6 caractères"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={formData.confirmMotDePasse}
            onChange={(e) => handleChange("confirmMotDePasse", e.target.value)}
            style={input}
            placeholder="Retapez le mot de passe"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
        <button 
          style={{ ...btnFull, background: "#eee", color: "#333", marginTop: 0, flex: 1 }}
          onClick={() => {
            setFormData({
              nom: formateur?.nom || "",
              prenom: formateur?.prenom || "",
              email: formateur?.email || "",
              telephone: formateur?.telephone || "",
              motDePasse: "",
              confirmMotDePasse: ""
            });
            setEditMode(false);
          }}
          disabled={loading}
        >
          ❌ Annuler
        </button>
        <button 
          style={{ ...btnFull, marginTop: 0, flex: 1, opacity: loading ? 0.6 : 1 }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "⏳ Enregistrement..." : "✅ Enregistrer"}
        </button>
      </div>
    </FormCard>
  );
}

/* ---------------- LOADER ---------------- */

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
      <p style={{ color: "#999", fontSize: "0.95rem" }}>Chargement en cours...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ---------------- UI ---------------- */

const page = {
  minHeight: "100vh",
  background: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const container = {
  width: "90%",
  maxWidth: "1200px",
  minHeight: "90vh",
  background: "#fff",
  borderRadius: "30px",
  display: "flex",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
};

const sidebar = {
  width: "240px",
  padding: "30px",
  backgroundColor: "rgba(130, 3, 192, 1)",
  color: "#fff"
};

const content = { flex: 1, padding: "40px", overflowY: "auto" };

const Card = ({ children }) => (
  <div style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s ease"
  }}>
    {children}
  </div>
);

const FormCard = ({ children }) => (
  <div style={{
    maxWidth: "700px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  }}>
    {children}
  </div>
);

const btn = {
  padding: "10px 20px",
  background: "#7b2ff7",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "all 0.2s ease"
};

const btnFull = {
  marginTop: "20px",
  width: "100%",
  padding: "14px",
  background: "#7b2ff7",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem"
};

const input = {
  width: "100%",
  padding: "12px 15px",
  marginTop: "8px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  fontSize: "1rem",
  transition: "border 0.2s ease"
};

const textarea = {
  ...input,
  height: "120px",
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: "1.5"
};

const backBtn = {
  marginBottom: "20px",
  background: "transparent",
  border: "none",
  color: "#7b2ff7",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};