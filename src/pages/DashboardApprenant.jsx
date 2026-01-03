import { useState } from "react";
import { User, ShoppingCart, LayoutDashboard, Trash2 } from 'lucide-react';

export default function DashboardApprenant() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          {/* LOGO PLACEHOLDER if needed */}
          <div style={{ marginBottom: "40px", paddingLeft: "10px" }}>
            {/* <img src="/logo.png" alt="Logo" style={{ height: "40px" }} /> */}
          </div>

          <MenuItem
            label="Dashboard"
            icon={<LayoutDashboard size={20} />}
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <MenuItem
            label="Profil"
            icon={<User size={20} />}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <MenuItem
            label="Panier"
            icon={<ShoppingCart size={20} />}
            active={activeTab === "panier"}
            onClick={() => setActiveTab("panier")}
          />
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "profile" && <ProfileView />}
          {activeTab === "panier" && <PanierView />}
        </div>
      </div>
    </div>
  );
}

/* ------------------- COMPONENTS ------------------- */

function MenuItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "12px 20px",
        borderRadius: active ? "16px 0 0 16px" : "16px",
        marginBottom: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        color: active ? "rgba(130, 3, 192, 1)" : "#fff",
        background: active ? "#fff" : "transparent",
        marginRight: active ? "-30px" : "0", // Overlap effect
        paddingRight: active ? "50px" : "20px",
        position: "relative",
        zIndex: active ? 10 : 1,
        transition: "all 0.3s ease"
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ------------------- VIEWS ------------------- */

function DashboardView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>Mon Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        {/* Card 1 */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4b5563", marginBottom: "10px" }}>Formation actuelle</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#6d00bc", marginBottom: "5px" }}>Cybersécurité</p>
          <p style={{ color: "#6b7280" }}>Du 12/01/2025 au 15/06/2025</p>
        </div>

        {/* Card 2 */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4b5563", marginBottom: "15px" }}>Prochaines Sessions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#6d00bc" }} />
              <span style={{ color: "#4b5563" }}>Lundi 14 Janv — 09:00</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#6d00bc" }} />
              <span style={{ color: "#4b5563" }}>Mercredi 16 Janv — 14:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* HEADER CARD */}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "30px", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#e5e7eb", overflow: "hidden" }}>
            <img src="/user.png" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Prenom Nom</h2>
            <p style={{ color: "#9ca3af", margin: 0 }}>Apprenant</p>
          </div>
        </div>
        <button style={btnDarkStyle}>
          Modifier
        </button>
      </div>

      {/* FORM SECTION */}
      <div style={{ ...cardStyle, padding: "40px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1f2937", marginBottom: "25px" }}>Information du compte</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
          <InputField label="Téléphone" placeholder="+33 6 12 34 56 78" />
          <InputField label="Adresse" placeholder="12 Rue de la Paix, Paris" />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <InputField label="Mot de passe" type="password" placeholder="••••••••••••" />
        </div>
      </div>
    </div>
  );
}

function PanierView() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "30px" }}>Mon panier</h2>

      <div style={{ ...cardStyle, padding: "35px", position: "relative", minHeight: "400px" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CartItem
            title="Pack Sécurité Avancée"
            category="Formation"
            price={450}
          />
          <CartItem
            title="Module Réseau Expert"
            category="Module"
            price={150}
          />
        </div>

        {/* FOOTER TOTAL */}
        <div style={{ marginTop: "50px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "30px" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", color: "#9ca3af", fontSize: "0.9rem" }}>Total</span>
            <span style={{ display: "block", fontSize: "1.8rem", fontWeight: "bold", color: "#1f2937" }}>600 €</span>
          </div>
          <button style={btnPrimaryStyle}>
            PAYER
          </button>
        </div>

      </div>
    </div>
  );
}

/* ------------------- PROPS & STYLES ------------------- */

const cardStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  border: "1px solid #f3f4f6"
};

const btnDarkStyle = {
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "10px 25px",
  fontWeight: "500",
  cursor: "pointer"
};

const btnPrimaryStyle = {
  background: "#a020f0",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "15px 40px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(160, 32, 240, 0.3)"
};

/* ------------------- SUB-COMPONENTS ------------------- */

function InputField({ label, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#6b7280", marginLeft: "4px" }}>{label}*</label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "1rem",
          color: "#374151",
          outline: "none"
        }}
      />
    </div>
  );
}

function CartItem({ title, category, price }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "#f9fafb", borderRadius: "16px", border: "1px solid #transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #a855f7, #6366f1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>
          {title.charAt(0)}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "#1f2937" }}>{title}</h4>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>{category}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        {/* Quantity Controls */}
        <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px 8px" }}>
          <button style={{ width: "24px", height: "24px", border: "none", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
          <span style={{ width: "30px", textAlign: "center", fontWeight: "500", fontSize: "0.9rem" }}>1</span>
          <button style={{ width: "24px", height: "24px", border: "none", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>

        <span style={{ fontWeight: "bold", color: "#1f2937", width: "60px", textAlign: "right" }}>{price} €</span>

        <button style={{ width: "32px", height: "32px", border: "none", background: "transparent", color: "#d1d5db", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}