import { useState, useEffect } from "react";
import { Award, Download, CheckCircle, Calendar, FileText, Sparkles } from 'lucide-react';
import API_URL from "../api.js";

export default function Attestation() {
  const [attestations, setAttestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const idApprenant = user?.idApprenant || user?.idUtilisateur;


  useEffect(() => {
    if (idApprenant) {
      chargerAttestations();
    }
  }, [idApprenant]);

  // constante pour charger les attestations
  const chargerAttestations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/attestations/apprenant/${idApprenant}`);
      const data = await response.json();
      console.log("Attestations:", data);
      setAttestations(data);
    } catch (err) {
      console.error("Erreur chargement attestations:", err);
    } finally {
      setLoading(false);
    }
  };

  // constante pour générer les attestations automatiquement
  const genererAttestations = async () => {
    try {
      setGenerating(true);
      const response = await fetch(`${API_URL}/attestations/generer-auto/${idApprenant}`, {
        method: "POST"
      });
      // Récupérer la réponse JSON
      const data = await response.json();
      
      if (response.ok) {
        alert(`${data.message}`);
        await chargerAttestations();
      } else {
        alert("Erreur lors de la génération");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la génération des attestations");
    } finally {
      setGenerating(false);
    }
  };

  const telechargerAttestation = (attestation) => {
    // on va créer un PDF côté client
    genererPDF(attestation);
  };

  const genererPDF = (attestation) => {
    const printWindow = window.open('', '', 'height=800,width=600');
    
    // Convertir le logo en base64 pour l'inclure dans le PDF
    const logoPath = new URL('../assets/logotritech.jpg', import.meta.url).href;
    
    // style de l'attestaion (html + css) en utilisant les données de l'api
    const contenuHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attestation de Réussite - ${attestation.apprenant?.prenom} ${attestation.apprenant?.nom}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            padding: 40px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0;
          }
          .certificat {
            background: white;
            padding: 60px;
            border: 15px solid rgba(130, 3, 192, 0.8);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            max-width: 800px;
            margin: 0 auto;
            position: relative;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 3px solid rgba(130, 3, 192, 0.3);
            padding-bottom: 30px;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .logo {
            width: 150px;
            height: auto;
            object-fit: contain;
            margin-bottom: 10px;
          }
          .logo-text {
            font-size: 1.5rem;
            font-weight: bold;
            color: rgba(130, 3, 192, 1);
          }
          .titre {
            font-size: 2.8rem;
            color: rgba(130, 3, 192, 1);
            text-transform: uppercase;
            letter-spacing: 3px;
            text-align: right;
            line-height: 1.2;
          }
          .corps {
            font-size: 1.3rem;
            line-height: 2.2;
            text-align: center;
            color: #333;
            margin: 50px 0;
          }
          .nom-apprenant {
            font-size: 2.5rem;
            font-weight: bold;
            color: rgba(130, 3, 192, 1);
            margin: 25px 0;
            text-decoration: underline;
            text-decoration-thickness: 3px;
          }
          .formation {
            font-size: 1.8rem;
            font-weight: bold;
            color: #444;
            margin: 25px 0;
            font-style: italic;
            padding: 15px;
            background: rgba(130, 3, 192, 0.05);
            border-radius: 10px;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
            padding-top: 40px;
            border-top: 2px solid #eee;
          }
          .signature-bloc {
            text-align: center;
            width: 250px;
          }
          .signature-svg {
            width: 200px;
            height: 80px;
            margin-bottom: 10px;
          }
          .signature-nom {
            font-weight: bold;
            font-size: 1rem;
            color: #333;
            border-top: 2px solid #333;
            padding-top: 10px;
            display: inline-block;
          }
          .date {
            text-align: center;
            color: #666;
            margin-top: 40px;
            font-size: 1rem;
            font-style: italic;
          }
          .badge {
            position: absolute;
            top: 60px;
            right: 60px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #8b4513;
            padding: 20px 30px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 1.3rem;
            border: 5px solid #8b4513;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            text-align: center;
            line-height: 1.2;
          }
          @media print {
            body { background: white; padding: 0; }
            .certificat { border-width: 10px; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificat">
          
          <div class="header">
            <div class="logo-container">
              <img src="${logoPath}" alt="Logo TriTech" class="logo" />
              <div class="logo-text">TriTech</div>
            </div>
            <div class="titre">Attestation<br>de Réussite</div>
          </div>
          
          <div class="corps">
            <p>Nous certifions par la présente que</p>
            <div class="nom-apprenant">${attestation.apprenant?.prenom} ${attestation.apprenant?.nom}</div>
            <p>a suivi avec succès et validé la formation</p>
            <div class="formation">« ${attestation.session?.formation?.intitule || "Formation"} »</div>
            <p style="font-size: 1.1rem; color: #666;">Session #${attestation.session?.idSession || "N/A"}</p>
          </div>
          
          <div class="footer">
            <div class="signature-bloc">
              <svg class="signature-svg" viewBox="0 0 200 80">
                <path d="M 20 40 Q 40 20, 60 40 T 100 40 Q 120 50, 140 30 T 180 40" 
                      stroke="rgba(130, 3, 192, 1)" 
                      stroke-width="3" 
                      fill="none" 
                      stroke-linecap="round"/>
                <path d="M 30 50 Q 50 60, 70 50 T 110 50" 
                      stroke="rgba(130, 3, 192, 0.6)" 
                      stroke-width="2" 
                      fill="none" 
                      stroke-linecap="round"/>
              </svg>
              <div class="signature-nom">Direction TriTech</div>
            </div>
            
            <div class="signature-bloc">
              <svg class="signature-svg" viewBox="0 0 200 80">
                <path d="M 30 45 Q 50 25, 70 45 T 110 45 T 150 45 Q 170 55, 180 45" 
                      stroke="#2c3e50" 
                      stroke-width="3" 
                      fill="none" 
                      stroke-linecap="round"/>
                <path d="M 40 35 L 45 60 M 80 35 L 85 60 M 120 35 L 125 60" 
                      stroke="#2c3e50" 
                      stroke-width="2" 
                      fill="none" 
                      stroke-linecap="round"/>
              </svg>
              <div class="signature-nom">Le Formateur</div>
            </div>
          </div>
          
          <div class="date">
            Fait à Paris, le ${new Date(attestation.dateObtention).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>
      </body>
      </html>
    `;
    // écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(contenuHTML);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // affichage pendant le chargement
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <div style={{ 
          display: "inline-block", 
          width: "50px", 
          height: "50px", 
          border: "5px solid #f3f3f3", 
          borderTop: "5px solid rgba(130, 3, 192, 1)", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite" 
        }}></div>
        <p style={{ marginTop: "20px", color: "#666" }}>Chargement...</p>
      </div>
    );
  }

  // affichage principal
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          fontSize: "2rem", 
          fontWeight: "bold", 
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <Award size={36} style={{ color: "rgba(130, 3, 192, 1)" }} />
          Mes Attestations
        </h2>
        <p style={{ color: "#666", fontSize: "1rem" }}>
          Téléchargez vos certificats de réussite
        </p>
      </div>

      {/* Bouton génération automatique */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(130, 3, 192, 0.1) 0%, rgba(100, 2, 150, 0.1) 100%)",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "30px",
        border: "2px dashed rgba(130, 3, 192, 0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#333" }}>
              <Sparkles size={20} style={{ display: "inline", marginRight: "10px", color: "rgba(130, 3, 192, 1)" }} />
              Générer mes attestations automatiquement
            </h3>
            <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
              Créez automatiquement des attestations pour toutes vos formations réussies (note ≥ 10/20)
            </p>
          </div>
          <button
            onClick={genererAttestations}
            disabled={generating}
            style={{
              background: generating 
                ? "#ccc" 
                : "linear-gradient(135deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)",
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              borderRadius: "10px",
              cursor: generating ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: generating ? "none" : "0 4px 15px rgba(130, 3, 192, 0.3)"
            }}
          >
            {generating ? "Génération..." : (
              <>
                <Sparkles size={18} />
                Générer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Liste des attestations */}
      {attestations.length > 0 ? (
        <div style={{ display: "grid", gap: "20px" }}>
          {attestations.map((att) => (
            <div
              key={att.idAttestation}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "2px solid #4caf50",
                position: "relative",
                overflow: "hidden"
              }}
            >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginTop: "10px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: "1.4rem", 
                    fontWeight: "bold", 
                    color: "#333",
                    marginBottom: "10px"
                  }}>
                    {att.session?.formation?.intitule || "Formation"}
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#666" }}>
                      <FileText size={16} />
                      <span>Session #{att.session?.idSession || "N/A"}</span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#666" }}>
                      <Calendar size={16} />
                      <span>
                        Délivrée le {new Date(att.dateObtention).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bouton de téléchargement */}
                <button
                  onClick={() => telechargerAttestation(att)}
                  style={{
                    background: "linear-gradient(135deg, rgba(130, 3, 192, 1) 0%, rgba(100, 2, 150, 1) 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "transform 0.2s ease",
                    boxShadow: "0 4px 15px rgba(130, 3, 192, 0.3)"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  <Download size={18} />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : 
      // affichage si aucune attestation n'est disponible
      (
        <div style={{
          background: "#fff",
          padding: "60px 40px",
          borderRadius: "20px",
          textAlign: "center",
          border: "2px dashed #ddd"
        }}>
          <Award size={64} style={{ color: "#ddd", marginBottom: "20px" }} />
          <h3 style={{ fontSize: "1.3rem", color: "#666", margin: "0 0 10px 0" }}>
            Aucune attestation disponible
          </h3>
          <p style={{ color: "#999", margin: 0 }}>
            Obtenez une note supérieure à 10/20 pour recevoir votre attestation
          </p>
        </div>
      )}
    </div>
  );
}