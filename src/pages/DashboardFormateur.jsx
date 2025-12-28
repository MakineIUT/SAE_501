import { useState } from "react";

export default function DashboardFormateur() {
  const [menu, setMenu] = useState("apprenants");
  const [selected, setSelected] = useState(null);

  const [apprenants, setApprenants] = useState([
    { id: 1, nom: "Martin", prenom: "Sarah", note: null, commentaire: "" },
    { id: 2, nom: "Durand", prenom: "Lucas", note: null, commentaire: "" }
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      lieu: "Paris",
      date: "10/02/2025",
      apprenants: [
        { id: 1, nom: "Martin", present: false },
        { id: 2, nom: "Durand", present: false }
      ]
    }
  ]);

  return (
    <div style={page}>
      <div style={container}>
        <div style={sidebar}>
                    <MenuItem label="Profil" active={menu === "profil"} onClick={() => { setMenu("profil"); setSelected(null); }} />
          <MenuItem label="Apprenants" active={menu === "apprenants"} onClick={() => { setMenu("apprenants"); setSelected(null); }} />
          <MenuItem label="Sessions" active={menu === "sessions"} onClick={() => { setMenu("sessions"); setSelected(null); }} />
        </div>

        <div style={content}>
          {menu === "apprenants" && !selected && (
            <ApprenantsList apprenants={apprenants} onSelect={setSelected} />
          )}

          {menu === "apprenants" && selected && (
            <Notation
              apprenant={selected}
              onBack={() => setSelected(null)}
              onSave={(updated) =>
                setApprenants(apprenants.map(a => a.id === updated.id ? updated : a))
              }
            />
          )}

          {menu === "profil" && <ProfilFormateur />}

          {menu === "sessions" && !selected && (
            <SessionsList sessions={sessions} onSelect={setSelected} />
          )}

          {menu === "sessions" && selected && (
            <SessionDetail
              session={selected}
              onBack={() => setSelected(null)}
              onSave={(updated) =>
                setSessions(sessions.map(s => s.id === updated.id ? updated : s))
              }
            />
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
        paddingRight: active ? "50px" : "20px"
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
      <h2>Apprenants inscrits</h2>

      {apprenants.map(a => (
        <Card key={a.id}>
          <span><strong>{a.nom}</strong> {a.prenom}</span>
          <button onClick={() => onSelect(a)} style={btn}>
            {a.note !== null ? "Voir / Modifier" : "Noter"}
          </button>
        </Card>
      ))}
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

        <h2>{apprenant.nom} {apprenant.prenom}</h2>

        <p><strong>Note :</strong> {note} /20</p>
        <p><strong>Commentaire :</strong> {commentaire}</p>

        <p>
          <strong>Attestation :</strong>{" "}
          {favorable ? "Favorable ✅" : "Défavorable ❌"}
        </p>

        <button style={btnFull}>Télécharger l’attestation PDF</button>

        <button
          style={{ ...btnFull, background: "#eee", color: "#000" }}
          onClick={() => setEdit(true)}
        >
          Modifier la note
        </button>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>

      <h2>{apprenant.nom} {apprenant.prenom}</h2>

      <input
        placeholder="Note /20"
        value={note}
        onChange={e => setNote(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="Commentaire"
        value={commentaire}
        onChange={e => setCommentaire(e.target.value)}
        style={textarea}
      />

      <button
        style={btnFull}
        onClick={() => {
          onSave({ ...apprenant, note: noteNumber, commentaire });
          setEdit(false);
        }}
      >
        Valider
      </button>
    </FormCard>
  );
}

/* ---------------- SESSIONS ---------------- */

function SessionsList({ sessions, onSelect }) {
  return (
    <>
      <h2>Mes sessions</h2>
      {sessions.map(s => (
        <Card key={s.id}>
          <span>{s.date} – {s.lieu}</span>
          <button onClick={() => onSelect(s)} style={btn}>Voir</button>
        </Card>
      ))}
    </>
  );
}

function SessionDetail({ session, onBack, onSave }) {
  const [data, setData] = useState(session);

  const toggle = (id) => {
    setData({
      ...data,
      apprenants: data.apprenants.map(a =>
        a.id === id ? { ...a, present: !a.present } : a
      )
    });
  };

  return (
    <FormCard>
      <button onClick={onBack} style={backBtn}>← Retour</button>

      <h2>Session {data.date}</h2>
      <p>Lieu : {data.lieu}</p>

      {data.apprenants.map(a => (
        <label key={a.id} style={{ display: "block", marginTop: "10px" }}>
          <input type="checkbox" checked={a.present} onChange={() => toggle(a.id)} /> {a.nom}
        </label>
      ))}

      <button onClick={() => onSave(data)} style={btnFull}>
        Valider l’appel
      </button>
    </FormCard>
  );
}

/* ---------------- PROFIL ---------------- */

function ProfilFormateur() {
  return (
    <FormCard>
      <h2>Mon profil</h2>
      <input type="text" placeholder="Nom" style={input} />
      <input type="text" placeholder="Prénom" style={input} />
      <input type="mail" placeholder="Email" style={input} />
      <input type="password" placeholder="Mot de passe" style={input} />
      <button style={btnFull}>Modifier</button>
    </FormCard>
  );
}

/* ---------------- UI ---------------- */

const page = {
  minHeight: "100vh",
  background: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const container = {
  width: "70%",
  minHeight: "90vh",
  background: "#fff",
  borderRadius: "30px",
  display: "flex",
  overflow: "hidden"
};

const sidebar = {
  width: "240px",
  padding: "30px",
  backgroundColor: "rgba(130, 3, 192, 1)",
  color: "#fff"
};

const content = { flex: 1, padding: "40px" };

const Card = ({ children }) => (
  <div style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  }}>
    {children}
  </div>
);

const FormCard = ({ children }) => (
  <div style={{
    maxWidth: "600px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  }}>
    {children}
  </div>
);

const btn = {
  padding: "8px 16px",
  background: "#7b2ff7",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
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
  cursor: "pointer"
};

const input = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

const textarea = {
  ...input,
  height: "100px"
};

const backBtn = {
  marginBottom: "15px",
  background: "transparent",
  border: "none",
  color: "#7b2ff7",
  fontWeight: "bold",
  cursor: "pointer"
};