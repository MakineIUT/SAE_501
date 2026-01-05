import { useState, useEffect } from "react";
import { User, ShoppingCart, LayoutDashboard, Trash2, CheckCircle } from 'lucide-react';
import API_URL from "../api.js";

export default function DashboardApprenant() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apprenant, setApprenant] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const user = JSON.parse(localStorage.getItem('user'));
  const idApprenant = user?.idApprenant || user?.idUtilisateur;

  // charger les données de l'apprenant et ses inscriptions
  useEffect(() => {
    if (idApprenant) {
      chargerApprenant();
      chargerInscriptions();
    } else {
      setLoading(false);
    }
  }, [idApprenant]);

  // charger les données de l'apprenant avec l'api 
  const chargerApprenant = async () => {
    try {
      const response = await fetch(`${API_URL}/apprenants/${idApprenant}`);
      const data = await response.json();
      setApprenant(data);
    } catch (err) { console.error(err); }
  };

  // charger les inscriptions de l'apprenant avec l'api
  const chargerInscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/apprenants/${idApprenant}/inscriptions`);
      const data = await response.json();
      setInscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // gérer la suppression (annulation) d'une inscription
  const handleDelete = async (idInscription) => {
    if (!confirm("⚠️ Annuler cette inscription ?")) return;
    try {
      await fetch(`${API_URL}/inscriptions/${idInscription}/annuler`, { method: "PUT" });
      chargerInscriptions();
    } catch (err) { alert("Erreur annulation"); }
  };

  // filtrage des inscriptions selon le statut (erreur avec les accents parfois)
  const formationsPayees = inscriptions.filter(i => 
    i.statut === "Payée" || i.statut === "PayÃ©e"
  );
  // formations en attente de paiement
  const formationsEnAttente = inscriptions.filter(i => i.statut === "En attente");

  // Calcul du prix total basé sur le champ "prix" de l'objet formation
  const totalPrice = formationsEnAttente.reduce((sum, insc) => sum + (insc.formation?.prix || 0), 0);

  // rendu principal dans le return pour le composant du dashboard de l'apprenant
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "90%", maxWidth: "1200px", minHeight: "85vh", background: "#fff", borderRadius: "30px", display: "flex", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
        
        {/* Sidebar */}
        <div style={{ width: "260px", padding: "40px 20px", backgroundColor: "rgba(130, 3, 192, 1)", color: "#fff", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "40px", textAlign: "center" }}>TriTech</h1>
          <MenuItem label="Dashboard" icon={<LayoutDashboard size={20} />} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <MenuItem label="Profil" icon={<User size={20} />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <MenuItem label="Achats" icon={<ShoppingCart size={20} />} active={activeTab === "panier"} onClick={() => setActiveTab("panier")} />
        </div>

        {/* contenu principal */}
        <div style={{ flex: 1, padding: "40px", overflowY: "auto", background: "#FDF7FF" }}>
          {activeTab === "dashboard" && <DashboardView inscriptions={inscriptions} loading={loading} />}
          {activeTab === "profile" && <ProfileView apprenant={apprenant} loading={loading} />}
          {activeTab === "panier" && (
            <PanierView 
              formationsPayees={formationsPayees}
              formationsEnAttente={formationsEnAttente}
              loading={loading} 
              onDelete={handleDelete} 
              totalPrice={totalPrice} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// vu du panier et historique des achats
function PanierView({ formationsPayees, formationsEnAttente, loading, onDelete, totalPrice }) {
  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>Mon Panier & Historique</h2>
      
      {/* SECTION : FORMATIONS ACHETÉES */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#6d00bc", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle size={20} /> Formations achetées ({formationsPayees.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {formationsPayees.length > 0 ? (
            formationsPayees.map(insc => (
              <div key={insc.idInscription} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: "15px" }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: "bold" }}>{insc.formation?.intitule}</h4>
                  <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "#666" }}>Payé • Ville: {insc.session?.lieu?.ville || "N/A"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>{insc.formation?.prix || 0} €</p>
                  <span style={{ color: "#16a34a", fontWeight: "bold", fontSize: "0.7rem" }}>CONFIRMÉ</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "0.9rem" }}>Aucun achat trouvé.</p>
          )}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "30px 0" }} />

      {/* SECTION : PANIER (EN ATTENTE) */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>🛒 En attente de paiement ({formationsEnAttente.length})</h3>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        {formationsEnAttente.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>Panier vide.</p>
        ) : (
          <>
            {formationsEnAttente.map((insc) => (
              <div key={insc.idInscription} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{insc.formation?.intitule}</p>
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
            <div style={{ marginTop: "20px", textAlign: "right", borderTop: "2px solid #6d00bc", paddingTop: "15px" }}>
              <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#6d00bc" }}>Total : {totalPrice} €</p>
              <button style={{ marginTop: "10px", padding: "10px 25px", background: "rgba(130, 3, 192, 1)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                Procéder au paiement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// composants (MenuItem, DashboardView, ProfileView) 
function MenuItem({ label, icon, active, onClick }) {
  return (
    <div onClick={onClick} style={{
        display: "flex", alignItems: "center", gap: "15px", paddingTop: "12px", paddingBottom: "12px", paddingLeft: "20px",
        borderRadius: active ? "16px 0 0 16px" : "16px", cursor: "pointer", fontWeight: "bold",
        color: active ? "rgba(130, 3, 192, 1)" : "#fff", background: active ? "#fff" : "transparent",
        marginRight: active ? "-20px" : "0", transition: "all 0.3s ease"
    }}>
      {icon} <span>{label}</span>
    </div>
  );
}

// vue du dashboard de l'apprenant avec les statistiques
function DashboardView({ inscriptions, loading }) {
  if (loading) return <p>Chargement...</p>;
  const payees = inscriptions.filter(i => i.statut === "Payée" || i.statut === "PayÃ©e").length;
  const enAttente = inscriptions.filter(i => i.statut === "En attente").length;

  return (
    <div>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" }}>Mon Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <StatCard title="Total inscriptions" value={inscriptions.length} />
        <StatCard title="Formations payées" value={payees} color="#16a34a" />
        <StatCard title="En attente" value={enAttente} color="#f59e0b" />
      </div>
    </div>
  );
}

// carte de statistique individuelle qui sert à DashboardView pour afficher les stats de l'apprenant sur son dashboard
function StatCard({ title, value, color = "#333" }) {
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>{title}</p>
      <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: color, margin: 0 }}>{value}</p>
    </div>
  );
}

// vue du profil de l'apprenant 
function ProfileView({ apprenant, loading }) {
  if (loading) return <p>Chargement...</p>;
  return (
    <div>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Mon Profil</h2>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "20px" }}>
        <p><strong>Nom :</strong> {apprenant?.nom} {apprenant?.prenom}</p>
        <p><strong>Email :</strong> {apprenant?.email}</p>
        <p><strong>Téléphone :</strong> {apprenant?.telephone || "Non renseigné"}</p>
      </div>
    </div>
  );
}