import { useState, useEffect } from "react";
import { User, ShoppingCart, LayoutDashboard, Trash2 } from 'lucide-react';
import API_URL from "../api.js";

export default function DashboardApprenant() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apprenant, setApprenant] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Récupérer l'ID de l'apprenant connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  // Utiliser idApprenant s'il existe, sinon idUtilisateur (cas où idApprenant est null)
  const idApprenant = user?.idApprenant || user?.idUtilisateur;

  // 📥 Charger les données au démarrage
  useEffect(() => {
    if (idApprenant) {
      chargerApprenant();
      chargerInscriptions();
    } else {
      setError("Utilisateur non connecté");
      setLoading(false);
    }
  }, [idApprenant]);

  // ✅ Charger le profil de l'apprenant
  const chargerApprenant = async () => {
    try {
      const response = await fetch(`${API_URL}/apprenants/${idApprenant}`);
      if (!response.ok) throw new Error("Erreur chargement profil");
      const data = await response.json();
      setApprenant(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Charger les inscriptions de l'apprenant
  const chargerInscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/apprenants/${idApprenant}/inscriptions`);
      if (!response.ok) throw new Error("Erreur chargement inscriptions");
      const data = await response.json();
      setInscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ PAYER toutes les inscriptions validées
  const handlePayment = async () => {
    const inscriptionsValidees = inscriptions.filter(i => i.statut === "Validée");
    
    if (inscriptionsValidees.length === 0) {
      alert("⚠️ Aucune inscription validée à payer");
      return;
    }

    try {
      for (const insc of inscriptionsValidees) {
        const response = await fetch(`${API_URL}/inscriptions/${insc.idInscription}/paiement`, {
          method: "POST"
        });
        
        if (!response.ok) {
          throw new Error(`Échec du paiement pour inscription ${insc.idInscription}`);
        }
      }
      
      alert("✅ Paiement effectué avec succès !");
      chargerInscriptions(); // Recharger les données
      
    } catch (err) {
      alert("❌ Erreur lors du paiement : " + err.message);
    }
  };

  // ✅ ANNULER une inscription
  const handleDelete = async (idInscription) => {
    if (!confirm("⚠️ Voulez-vous vraiment annuler cette inscription ?")) return;
    
    try {
      const response = await fetch(`${API_URL}/inscriptions/${idInscription}/annuler`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Échec de l'annulation");
      
      alert("✅ Inscription annulée");
      chargerInscriptions(); // Recharger les données
      
    } catch (err) {
      alert("❌ Erreur lors de l'annulation : " + err.message);
    }
  };

  const totalPrice = inscriptions
    .filter(i => i.statut === "Validée" || i.statut === "En attente")
    .reduce((sum, insc) => sum + (insc.formation?.prix || 0), 0);

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
          <div style={{ marginBottom: "40px", paddingLeft: "10px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>TriTech</h1>
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
          {error && (
            <div style={{ padding: "15px", background: "#fee", border: "1px solid #fcc", borderRadius: "10px", marginBottom: "20px", color: "#c00" }}>
              ⚠️ {error}
            </div>
          )}

          {activeTab === "dashboard" && (
            <DashboardView 
              inscriptions={inscriptions} 
              loading={loading} 
            />
          )}
          {activeTab === "profile" && (
            <ProfileView 
              apprenant={apprenant} 
              loading={loading}
            />
          )}
          {activeTab === "panier" && (
            <PanierView 
              inscriptions={inscriptions}
              loading={loading}
              onDelete={handleDelete}
              onPayment={handlePayment}
              totalPrice={totalPrice}
            />
          )}
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
        marginRight: active ? "-30px" : "0",
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

function DashboardView({ inscriptions, loading }) {
  if (loading) return <Loader />;

  const inscriptionsActives = inscriptions.filter(i => 
    i.statut === "Validée" || i.statut === "Payée"
  );
  const formationEnCours = inscriptionsActives[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>Mon Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        {/* Card 1 */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4b5563", marginBottom: "10px" }}>
            Formation actuelle
          </h3>
          {formationEnCours ? (
            <>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#6d00bc", marginBottom: "5px" }}>
                {formationEnCours.formation?.titre || "Formation"}
              </p>
              <p style={{ color: "#6b7280" }}>
                Du {new Date(formationEnCours.session?.dateDebut).toLocaleDateString('fr-FR')} au{" "}
                {new Date(formationEnCours.session?.dateFin).toLocaleDateString('fr-FR')}
              </p>
            </>
          ) : (
            <p style={{ color: "#9ca3af" }}>Aucune formation en cours</p>
          )}
        </div>

        {/* Card 2 */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4b5563", marginBottom: "15px" }}>
            Prochaines Sessions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {inscriptionsActives.slice(0, 3).map((insc) => (
              <div key={insc.idInscription} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#6d00bc" }} />
                <span style={{ color: "#4b5563" }}>
                  {new Date(insc.session?.dateDebut).toLocaleDateString('fr-FR', { 
                    weekday: 'long', day: 'numeric', month: 'short' 
                  })} — {insc.session?.heureDebut || "09:00"}
                </span>
              </div>
            ))}
            {inscriptionsActives.length === 0 && (
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Aucune session à venir</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ apprenant, loading }) {
  if (loading) return <Loader />;
  if (!apprenant) return <div>Aucune donnée</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* HEADER CARD */}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "30px", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div style={{ 
            width: "90px", 
            height: "90px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "2rem",
            fontWeight: "bold"
          }}>
            {apprenant.nom?.charAt(0)}{apprenant.prenom?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              {apprenant.prenom} {apprenant.nom}
            </h2>
            <p style={{ color: "#9ca3af", margin: 0 }}>{apprenant.email}</p>
          </div>
        </div>
        <button style={btnDarkStyle}>
          Modifier
        </button>
      </div>

      {/* FORM SECTION */}
      <div style={{ ...cardStyle, padding: "40px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1f2937", marginBottom: "25px" }}>
          Information du compte
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
          <InputField label="Nom" value={apprenant.nom || "Non renseigné"} readOnly />
          <InputField label="Prénom" value={apprenant.prenom || "Non renseigné"} readOnly />
          <InputField label="Téléphone" value={apprenant.telephone || "Non renseigné"} readOnly />
          
        </div>

        <div style={{ marginBottom: "25px" }}>
          <InputField label="Mot de passe" type="password" value="••••••••••••" readOnly />
        </div>
      </div>
    </div>
  );
}

function PanierView({ inscriptions, loading, onDelete, onPayment, totalPrice }) {
  if (loading) return <Loader />;

  const inscriptionsPanier = inscriptions.filter(i => 
    i.statut === "En attente" || i.statut === "Validée"
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "30px" }}>
        Mon panier
      </h2>

      <div style={{ ...cardStyle, padding: "35px", position: "relative", minHeight: "400px" }}>

        {inscriptionsPanier.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <ShoppingCart size={64} style={{ opacity: 0.3, margin: "0 auto 20px" }} />
            <p style={{ fontSize: "1.2rem" }}>Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {inscriptionsPanier.map((insc) => (
                <CartItem
                  key={insc.idInscription}
                  title={insc.formation?.titre || "Formation"}
                  category={insc.statut}
                  price={insc.formation?.prix || 0}
                  dateDebut={insc.session?.dateDebut}
                  dateFin={insc.session?.dateFin}
                  onDelete={() => onDelete(insc.idInscription)}
                />
              ))}
            </div>

            {/* FOOTER TOTAL */}
            <div style={{ marginTop: "50px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "30px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "block", color: "#9ca3af", fontSize: "0.9rem" }}>Total</span>
                <span style={{ display: "block", fontSize: "1.8rem", fontWeight: "bold", color: "#1f2937" }}>
                  {totalPrice} €
                </span>
              </div>
              <button style={btnPrimaryStyle} onClick={onPayment}>
                PAYER
              </button>
            </div>
          </>
        )}

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

function InputField({ label, value, type = "text", readOnly = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#6b7280", marginLeft: "4px" }}>
        {label}*
      </label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
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

function CartItem({ title, category, price, dateDebut, dateFin, onDelete }) {
  const statutColor = category === "Validée" ? "#3b82f6" : "#f59e0b";
  
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      padding: "15px", 
      background: "#f9fafb", 
      borderRadius: "16px", 
      border: "1px solid transparent" 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ 
          width: "60px", 
          height: "60px", 
          background: "linear-gradient(135deg, #a855f7, #6366f1)", 
          borderRadius: "12px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#fff", 
          fontWeight: "bold", 
          fontSize: "1.2rem" 
        }}>
          {title.charAt(0)}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "#1f2937" }}>
            {title}
          </h4>
          <p style={{ margin: "4px 0", fontSize: "0.75rem", color: "#9ca3af" }}>
            {dateDebut && dateFin && (
              <>Du {new Date(dateDebut).toLocaleDateString('fr-FR')} au {new Date(dateFin).toLocaleDateString('fr-FR')}</>
            )}
          </p>
          <span style={{ fontSize: "0.75rem", color: statutColor, fontWeight: "600" }}>
            ● {category}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <span style={{ fontWeight: "bold", color: "#1f2937", width: "80px", textAlign: "right" }}>
          {price} €
        </span>

        <button 
          onClick={onDelete}
          style={{ 
            width: "32px", 
            height: "32px", 
            border: "none", 
            background: "transparent", 
            color: "#ef4444", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
      <div style={{ 
        width: "50px", 
        height: "50px", 
        border: "5px solid #f3f3f3", 
        borderTop: "5px solid #a020f0", 
        borderRadius: "50%", 
        animation: "spin 1s linear infinite" 
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}