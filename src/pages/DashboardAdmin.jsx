import { useState } from "react";

export default function DashboardAdmin() {
  const [menu, setMenu] = useState("formateurs");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "edit"

  const [formateurs, setFormateurs] = useState([
  { id: 1, nom: "Dupont", prenom: "Jean", email: "", tel: "" }
]);

const [apprenants, setApprenants] = useState([
  { id: 2, nom: "Martin", prenom: "Sarah", email: "", tel: "" }
]);

const users = menu === "formateurs" ? formateurs : apprenants;
const setUsers = menu === "formateurs" ? setFormateurs : setApprenants;

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleSave = (user) => {
    if (mode === "add") {
      setUsers([...users, { ...user, id: Date.now() }]);
    } else {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    }
    setSelectedUser(null);
    setMode(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "70%",
          minHeight: "90vh",
          background: "#fff",
          borderRadius: "30px",
          display: "flex",
          overflow: "hidden"
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: "240px",
            padding: "30px",
            backgroundColor: "rgba(130, 3, 192, 1)",
            color: "#fff"
          }}
        >
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

        {/* CONTENU */}
        <div style={{ flex: 1, padding: "40px" }}>
          {!selectedUser && (
            <AdminList
              title={menu}
              users={users}
              onAdd={() => {
                setMode("add");
                setSelectedUser({
                  nom: "",
                  prenom: "",
                  email: "",
                  tel: ""
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
              onBack={() => {
                setSelectedUser(null);
                setMode(null);
              }}
              onSave={handleSave}
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

/* ---------------- LISTE ---------------- */

function AdminList({ title, users, onAdd, onEdit, onDelete }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <h2 style={{ textTransform: "capitalize" }}>{title}</h2>

        <button
          onClick={onAdd}
          style={{
            padding: "12px 24px",
            background: "#7b2ff7",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Ajouter
        </button>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}
        >
          <span>
            <strong>{user.nom}</strong> {user.prenom}
          </span>

          <div style={{ display: "flex", gap: "15px" }}>
            <button onClick={() => onEdit(user)} style={iconBtn}>✏️</button>
            <button onClick={() => onDelete(user.id)} style={iconBtn}>🗑️</button>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------------- FORM AJOUT / MODIF ---------------- */

function UserForm({ mode, user, onBack, onSave }) {
  const [form, setForm] = useState(user);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: "20px",
          background: "transparent",
          border: "none",
          color: "#7b2ff7",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ← Retour
      </button>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#ddd",
            borderRadius: "50%"
          }}
        />
        <h2 style={{ marginLeft: "20px" }}>
          {mode === "add" ? "Ajouter" : "Modifier"}
        </h2>
      </div>

      <Input label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} />
      <Input label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} />
      <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      <Input label="Téléphone" value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} />

      <button
        onClick={() => onSave(form)}
        style={{
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
        }}
      >
        {mode === "add" ? "Ajouter" : "Modifier"}
      </button>
    </div>
  );
}

/* ---------------- UI ---------------- */

const iconBtn = {
  background: "#f3f3f3",
  border: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "18px"
};

function Input({ label, value, onChange }) {
  return (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginTop: "15px",
        borderRadius: "8px",
        border: "1px solid #ddd"
      }}
    />
  );
}