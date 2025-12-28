import { useState } from "react";

export default function DashboardApprenant() {
  const [menu, setMenu] = useState("dashboard");

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
          color: "#fff",
          backgroundColor: "rgba(130, 3, 192, 1)"
        }}
      >
        {/* <h3 style={{ marginBottom: "40px" }}>TRITECH</h3> */}

        <MenuItem
          label="Dashboard"
          active={menu === "dashboard"}
          onClick={() => setMenu("dashboard")}
        />
        <MenuItem
          label="Profil"
          active={menu === "profil"}
          onClick={() => setMenu("profil")}
        />
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: "40px" }}>
        {menu === "dashboard" && <DashboardContent />}
        {menu === "profil" && <ProfilContent />}
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
    borderRadius: "16px",
    marginBottom: "15px",
    cursor: "pointer",
    fontWeight: "bold",

    color: active ? "rgba(130, 3, 192, 1)" : "#fff",
    background: active ? "#fff" : "transparent",

    boxShadow: active ? "-6px 0 15px rgba(0,0,0,0.15)" : "none",
    marginRight: active ? "-40px" : "0",
    paddingRight: active ? "50px" : "20px",

    transition: "all 0.25s ease"
  }}
>
      {label}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function DashboardContent() {
  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* FORMATION ACTUELLE */}
        <Card>
          <h4>Formation actuelle</h4>
          <h2 style={{ color: "#7b2ff7" }}>Cybersécurité</h2>
          <p>Formateur : Jean Dupont</p>
          <p>Du 10/01/2025 au 20/03/2025</p>
        </Card>

        {/* SESSIONS */}
        <Card>
          <h4>Mes sessions</h4>

          <SessionItem label="Session 1" date="10/01/2025" />
          <SessionItem label="Session 2" date="24/01/2025" />
          <SessionItem label="Session 3" date="10/02/2025" />
        </Card>
      </div>

      {/* HISTORIQUE */}
      <div style={{ marginTop: "40px" }}>
        <h4 style={{ marginBottom: "15px" }}>
          Historique des formations
        </h4>

        <HistoryItem title="Javascript" />
        <HistoryItem title="Python" />
      </div>
    </>
  );
}

/* ---------------- PROFIL ---------------- */

function ProfilContent() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#ddd",
            borderRadius: "50%"
          }}
        />

        <div style={{ marginLeft: "20px", flex: 1 }}>
          {/* {simule nom prenom} */}
          <h2>Doe John</h2>
        </div>

        <button
          style={{
            padding: "10px 20px",
            background: "#7b2ff7",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Modifier
        </button>
      </div>

      <h4 style={{ marginTop: "40px" }}>Informations du compte</h4>

      <Input label="Email" value={user?.email} />
      <Input label="Téléphone" />
      <Input label="Adresse" />
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Card({ children }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}
    >
      {children}
    </div>
  );
}

function SessionItem({ label, date }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          background: "#7b2ff7",
          borderRadius: "4px",
          marginRight: "10px"
        }}
      />
      <span>{label} – {date}</span>
    </div>
  );
}

function HistoryItem({ title }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          background: "#eee",
          borderRadius: "6px",
          marginRight: "15px"
        }}
      />
      {title}
    </div>
  );
}

function Input({ label }) {
  return (
    <input
      placeholder={label}
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