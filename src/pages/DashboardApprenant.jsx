import { useState, useEffect } from "react";
import { User, ShoppingCart, LayoutDashboard, Trash2, CheckCircle } from 'lucide-react';
import API_URL from "../api.js";


export default function DashboardApprenant() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apprenant, setApprenant] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  // récupérer l'ID de l'apprenant depuis le localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const idApprenant = user?.idApprenant || user?.idUtilisateur;

  // Charger les données
  useEffect(() => {
    if (idApprenant) {
      chargerTout();
    } else {
      setLoading(false);
    }
  }, [idApprenant]);

  const chargerTout = async () => {
    try {
      // Charger inscriptions
      const resInsc = await fetch(`${API_URL}/apprenants/${idApprenant}/inscriptions`);
      const dataInsc = await resInsc.json();
      console.log("✅ Inscriptions:", dataInsc);
      setInscriptions(dataInsc);

      // Charger paiements
      const resPaie = await fetch(`${API_URL}/apprenants/${idApprenant}/paiements`);
      const dataPaie = await resPaie.json();
      console.log("✅ Paiements:", dataPaie);
      setPaiements(dataPaie);

      // Charger apprenant
      const resApp = await fetch(`${API_URL}/apprenants/${idApprenant}`);
      const dataApp = await resApp.json();
      setApprenant(dataApp);

    } catch (err) {
      console.error("❌ Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // suppression d'une inscription
  const handleDelete = async (idInscription) => {
    if (!confirm("Annuler cette inscription ?")) return;
    try {
      await fetch(`${API_URL}/inscriptions/${idInscription}/annuler`, { method: "PUT" });
      chargerTout();
    } catch (err) { 
      alert("Erreur"); 
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "90%", maxWidth: "1200px", minHeight: "85vh", background: "#fff", borderRadius: "30px", display: "flex", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
        
        <div style={{ width: "260px", padding: "40px 20px", backgroundColor: "rgba(130, 3, 192, 1)", color: "#fff", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "40px", textAlign: "center" }}>TriTech</h1>

          <MenuItem label="Dashboard" icon={<LayoutDashboard size={20} />} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <MenuItem label="Profil" icon={<User size={20} />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <MenuItem label="Achats" icon={<ShoppingCart size={20} />} active={activeTab === "panier"} onClick={() => setActiveTab("panier")} />
        
        </div>


        <div style={{ flex: 1, padding: "40px", overflowY: "auto", background: "#FDF7FF" }}>
          {activeTab === "dashboard" && <DashboardView inscriptions={inscriptions} />}
          {activeTab === "profile" && <ProfileView apprenant={apprenant} />}
          {activeTab === "panier" && (
            <PanierView 
            // passer les inscriptions et paiements en props pour éviter de refaire des fetch car on les a déjà dans le parent
              inscriptions={inscriptions}
              paiements={paiements}
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// composant MenuItem
function MenuItem({ label, icon, active, onClick }) {
  return (
    <div
    
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "20px",
        paddingRight: active ? "50px" : "20px", 
        borderRadius: active ? "16px 0 0 16px" : "16px",
        marginBottom: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        color: active ? "rgba(130, 3, 192, 1)" : "#fff",
        background: active ? "#fff" : "transparent",
        marginRight: active ? "-20px" : "0",
        position: "relative",
        zIndex: active ? 10 : 1,
        transition: "all 0.3s ease"
      }}
    >
      {icon} <span>{label}</span>
    </div>
  );
}

function PanierView({ inscriptions, paiements, onDelete }) {
  console.log("PanierView - Inscriptions:", inscriptions);
  console.log("PanierView - Paiements:", paiements);

  // pour chaque inscription, vérifier si elle a un paiement
  const inscriptionsAvecPaiement = inscriptions.map(insc => {
    // trouver les paiements associés à cette inscription
    const aPaiement = paiements.some(p => p.statut === "Validé");
    return {
      ...insc,
      estPayee: aPaiement
    }; 
  });

  // séparer les inscriptions payées et en attente
  const payees = inscriptionsAvecPaiement.filter(i => i.estPayee);
  const enAttente = inscriptionsAvecPaiement.filter(i => !i.estPayee);

  const totalPrice = enAttente.reduce((sum, i) => sum + (i.formation?.prix || 0), 0);

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Mon Panier & Historique</h2>

      {/* PAYÉES */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#6d00bc", marginBottom: "15px" }}>
          <CheckCircle size={20} style={{ display: "inline", marginRight: "10px" }} />
          Formations achetées ({payees.length})
        </h3>
        {payees.length > 0 ? (
          payees.map(insc => (
            <div key={insc.idInscription} style={{ padding: "15px", background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: "15px", marginBottom: "10px" }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{insc.formation?.intitule || "Formation"}</p>
              <p style={{ fontSize: "0.8rem", color: "#666", margin: "5px 0 0 0" }}>Prix: {insc.formation?.prix || 0} €</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#999" }}>Aucune formation payée</p>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "30px 0" }} />

      {/* EN ATTENTE */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "15px" }}>En attente ({enAttente.length})</h3>
      {enAttente.length > 0 ? (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "15px" }}>
          {enAttente.map(insc => (
            <div key={insc.idInscription} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{insc.formation?.intitule || "Formation"}</p>
                <span style={{ fontSize: "0.7rem", color: "#f59e0b" }}>● {insc.statut}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontWeight: "bold" }}>{insc.formation?.prix || 0} €</span>
                <button onClick={() => onDelete(insc.idInscription)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Total: {totalPrice} €</p>
          </div>
        </div>
      ) : (
        <p style={{ color: "#999" }}>Panier vide</p>
      )}
    </div>
  );
}


function DashboardView({ inscriptions }) {
  return (
    <div>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>Mon Dashboard</h2>
      <p>Vous avez {inscriptions.length} inscription(s)</p>
    </div>
  );
}

function ProfileView({ apprenant }) {
  return (
    <div style={{ background: "#fff", padding: "30px", borderRadius: "20px" }}>
      <h3>Profil de {apprenant?.prenom || "Utilisateur"}</h3>
      <p>Email: {apprenant?.email || "Non défini"}</p>
    </div>
  );
}