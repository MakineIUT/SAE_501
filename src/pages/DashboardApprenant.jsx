import { useState, useEffect } from "react";
import { User, ShoppingCart, LayoutDashboard, Trash2, CheckCircle, Award, TrendingUp, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API_URL from "../api.js";
import Attestation from "../components/Attestation.jsx";
import StripeCheckout from "../components/StripeCheckout.jsx";

export default function DashboardApprenant() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apprenant, setApprenant] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const idApprenant = user?.idApprenant || user?.idUtilisateur;

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location]);

  useEffect(() => {
    if (idApprenant) {
      chargerTout();
    } else {
      setLoading(false);
    }
  }, [idApprenant]);

  const chargerTout = async () => {
    try {
      const resInsc = await fetch(`${API_URL}/apprenants/${idApprenant}/inscriptions`);
      const dataInsc = await resInsc.json();
      setInscriptions(dataInsc);

      const resPaie = await fetch(`${API_URL}/apprenants/${idApprenant}/paiements`);
      const dataPaie = await resPaie.json();
      setPaiements(dataPaie);

      const resApp = await fetch(`${API_URL}/apprenants/${idApprenant}`);
      const dataApp = await resApp.json();
      setApprenant(dataApp);

      const resNotes = await fetch(`${API_URL}/apprenants/${idApprenant}/notes`);
      const dataNotes = await resNotes.json();
      setNotes(dataNotes);

    } catch (err) {
      console.error("❌ Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idInscription) => {
    if (!confirm("Annuler cette inscription ?")) return;
    try {
      await fetch(`${API_URL}/inscriptions/${idInscription}/annuler`, { method: "PUT" });
      chargerTout();
    } catch (err) { 
      alert("Erreur"); 
    }
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    console.log("✅ Paiement réussi avec Stripe:", paymentMethod);
    
    // TODO: Appeler votre API backend pour :
    // 1. Valider le paiement
    // 2. Mettre à jour le statut des inscriptions en "Payée"
    // 3. Créer les enregistrements de paiement
    
    // Pour l'instant, on recharge simplement les données
    setShowStripeCheckout(false);
    alert("✅ Vos formations ont été achetées avec succès !");
    chargerTout();
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
          <MenuItem label="Mes Notes" icon={<Award size={20} />} active={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
          <MenuItem label="Attestations" icon={<FileText size={20} />} active={activeTab === "attestations"} onClick={() => setActiveTab("attestations")} />
          <MenuItem label="Profil" icon={<User size={20} />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <MenuItem label="Achats" icon={<ShoppingCart size={20} />} active={activeTab === "panier"} onClick={() => setActiveTab("panier")} />
        </div>

        <div style={{ flex: 1, padding: "40px", overflowY: "auto", background: "#FDF7FF" }}>
          {activeTab === "dashboard" && <DashboardView inscriptions={inscriptions} notes={notes} />}
          {activeTab === "notes" && <NotesView notes={notes} />}
          {activeTab === "attestations" && <Attestation />}
          {activeTab === "profile" && <ProfileView apprenant={apprenant} />}
          {activeTab === "panier" && (
            <PanierView 
              inscriptions={inscriptions}
              paiements={paiements}
              onDelete={handleDelete}
              onProceedToPayment={() => setShowStripeCheckout(true)}
            />
          )}
        </div>
      </div>

      {/* Modale Stripe */}
      {showStripeCheckout && (
        <StripeCheckout 
          totalPrice={inscriptions
            .filter(i => i.statut === "En attente")
            .reduce((sum, i) => sum + (i.formation?.prix || 0), 0)}
          inscriptions={inscriptions.filter(i => i.statut === "En attente")}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowStripeCheckout(false)}
        />
      )}
    </div>
  );
}

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

function NotesView({ notes }) {
  const moyenne = notes.length > 0 
    ? (notes.reduce((sum, n) => sum + parseFloat(n.valeur), 0) / notes.length).toFixed(2)
    : "0.00";

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Award size={32} style={{ color: "rgba(130, 3, 192, 1)" }} />
        Mes Notes
      </h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>Consultez vos résultats et votre progression</p>

      <div style={{ 
        background: "linear-gradient(135deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)", 
        padding: "30px", 
        borderRadius: "20px", 
        color: "#fff",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(130, 3, 192, 0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.9rem", opacity: 0.9, margin: 0 }}>Moyenne générale</p>
            <h3 style={{ fontSize: "3rem", fontWeight: "bold", margin: "10px 0" }}>{moyenne}<span style={{ fontSize: "1.5rem" }}>/20</span></h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: 0 }}>{notes.length} note(s) enregistrée(s)</p>
          </div>
          <TrendingUp size={80} style={{ opacity: 0.2 }} />
        </div>
      </div>

      {notes.length > 0 ? (
        <div style={{ display: "grid", gap: "15px" }}>
          {notes.map(note => (
            <div key={note.idNote} style={{ 
              background: "#fff", 
              padding: "25px", 
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: `2px solid ${parseFloat(note.valeur) >= 10 ? "#4caf50" : "#f59e0b"}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#333" }}>
                    {note.session?.formation?.intitule || "Formation"}
                  </h3>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                    📚 Session #{note.session?.idSession || "N/A"}
                  </p>
                  {note.formateur && (
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                      👨‍🏫 {note.formateur.prenom} {note.formateur.nom}
                    </p>
                  )}
                </div>
                
                <div style={{ 
                  minWidth: "100px",
                  textAlign: "center",
                  background: parseFloat(note.valeur) >= 10 ? "#e8f5e9" : "#fff3e0",
                  padding: "15px 20px",
                  borderRadius: "12px"
                }}>
                  <p style={{ 
                    fontSize: "2rem", 
                    fontWeight: "bold", 
                    margin: 0,
                    color: parseFloat(note.valeur) >= 10 ? "#4caf50" : "#f59e0b"
                  }}>
                    {note.valeur}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#666", margin: "5px 0 0 0" }}>/ 20</p>
                  <p style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: "600",
                    margin: "8px 0 0 0",
                    color: parseFloat(note.valeur) >= 10 ? "#4caf50" : "#f59e0b"
                  }}>
                    {parseFloat(note.valeur) >= 10 ? "✓ RÉUSSI" : "✗ ÉCHOUÉ"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: "#fff", 
          padding: "60px 40px", 
          borderRadius: "20px", 
          textAlign: "center",
          border: "2px dashed #ddd"
        }}>
          <Award size={64} style={{ color: "#ddd", marginBottom: "20px" }} />
          <p style={{ fontSize: "1.1rem", color: "#666", margin: 0 }}>Aucune note disponible pour le moment</p>
          <p style={{ fontSize: "0.9rem", color: "#999", marginTop: "10px" }}>Vos notes apparaîtront ici une fois que vos formateurs les auront saisies</p>
        </div>
      )}
    </div>
  );
}

function PanierView({ inscriptions, paiements, onDelete, onProceedToPayment }) {
  const inscriptionsPayees = inscriptions.filter(insc => 
    insc.statut === "Payée" || 
    insc.statut === "Payée" ||
    insc.statut === "PayÃ©e" ||
    insc.statut === "PayÃƒÂ©e"
  );

  const inscriptionsEnAttente = inscriptions.filter(insc => 
    insc.statut === "En attente" ||
    insc.statut === "en attente" ||
    insc.statut === "EN_ATTENTE"
  );

  const totalPrice = inscriptionsEnAttente.reduce((sum, insc) => sum + (insc.formation?.prix || 0), 0);

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Mon Panier & Historique</h2>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#6d00bc", marginBottom: "15px" }}>
          <CheckCircle size={20} style={{ display: "inline", marginRight: "10px" }} />
          Formations achetées ({inscriptionsPayees.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {inscriptionsPayees.length > 0 ? (
            inscriptionsPayees.map(insc => (
              <div key={insc.idInscription} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "15px 25px", 
                background: "#f0fff4", 
                border: "1px solid #c6f6d5", 
                borderRadius: "15px" 
              }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: "bold" }}>{insc.formation?.intitule || "Formation"}</h4>
                  <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "#666" }}>
                    Payé • Ville: {insc.session?.lieu?.ville || "N/A"}
                  </p>
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

      <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "15px" }}>
        🛒 En attente de paiement ({inscriptionsEnAttente.length})
      </h3>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        {inscriptionsEnAttente.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>Panier vide.</p>
        ) : (
          <>
            {inscriptionsEnAttente.map((insc) => (
              <div key={insc.idInscription} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "12px 0", 
                borderBottom: "1px solid #eee" 
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{insc.formation?.intitule || "Formation"}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                    📍 {insc.session?.lieu?.ville || "En ligne"}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "#f59e0b" }}>● {insc.statut}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{insc.formation?.prix || 0} €</span>
                  <button 
                    onClick={() => onDelete(insc.idInscription)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#ef4444", 
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px"
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "20px", textAlign: "right", borderTop: "2px solid #6d00bc", paddingTop: "15px" }}>
              <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#6d00bc" }}>Total : {totalPrice} €</p>
              <button 
                onClick={onProceedToPayment}
                style={{ 
                  marginTop: "10px", 
                  padding: "12px 30px", 
                  background: "rgba(130, 3, 192, 1)", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "10px", 
                  fontWeight: "bold", 
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(130, 3, 192, 0.3)"
                }}
              >
                💳 Procéder au paiement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardView({ inscriptions, notes }) {
  const moyenne = notes.length > 0 
    ? (notes.reduce((sum, n) => sum + parseFloat(n.valeur), 0) / notes.length).toFixed(2)
    : "0.00";

  return (
    <div>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" }}>Mon Dashboard</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          padding: "25px", 
          borderRadius: "20px", 
          color: "#fff",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
        }}>
          <LayoutDashboard size={32} style={{ marginBottom: "15px", opacity: 0.9 }} />
          <p style={{ fontSize: "0.9rem", margin: 0, opacity: 0.9 }}>Inscriptions</p>
          <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "10px 0 0 0" }}>{inscriptions.length}</h3>
        </div>

        <div style={{ 
          background: "linear-gradient(135deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)", 
          padding: "25px", 
          borderRadius: "20px", 
          color: "#fff",
          boxShadow: "0 4px 15px rgba(130, 3, 192, 0.3)"
        }}>
          <Award size={32} style={{ marginBottom: "15px", opacity: 0.9 }} />
          <p style={{ fontSize: "0.9rem", margin: 0, opacity: 0.9 }}>Moyenne générale</p>
          <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "10px 0 0 0" }}>{moyenne}<span style={{ fontSize: "1.2rem" }}>/20</span></h3>
        </div>
      </div>

      {notes.length > 0 && (
        <div style={{ background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>Dernières notes</h3>
          {notes.slice(0, 3).map(note => (
            <div key={note.idNote} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              padding: "15px", 
              borderBottom: "1px solid #f0f0f0",
              alignItems: "center"
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "1rem" }}>
                  {note.session?.formation?.intitule || "Formation"}
                </p>
                <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                  Session #{note.session?.idSession}
                </p>
              </div>
              <div style={{ 
                background: parseFloat(note.valeur) >= 10 ? "#e8f5e9" : "#fff3e0",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1.2rem",
                color: parseFloat(note.valeur) >= 10 ? "#4caf50" : "#f59e0b"
              }}>
                {note.valeur}/20
              </div>
            </div>
          ))}
        </div>
      )}
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