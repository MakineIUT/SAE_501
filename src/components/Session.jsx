import { useEffect, useState } from "react";
import axios from "axios";

export default function Session({ close }) {
  const sessions = [
    { id: 1, adresse: "Paris", debut: "01/06", fin: "30/06", inscrits: 10 },
    { id: 2, adresse: "Lyon", debut: "05/07", fin: "02/08", inscrits: 12 },
    { id: 3, adresse: "Marseille", debut: "10/09", fin: "10/10", inscrits: 7 }
  ];

  const payer = (s) => {
    if (s.inscrits >= 12) {
      alert("Session complète ❌");
    } else {
      alert("Paiement simulé 💳\nInscription validée ✅");
      close();
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        width: "420px"
      }}>
        <h2>Choisir une session</h2>

        {sessions.map(s => (
          <div key={s.id} style={{ marginBottom: "15px" }}>
            <p><strong>{s.adresse}</strong></p>
            <p>{s.debut} → {s.fin}</p>
            <p>{s.inscrits}/12 inscrits</p>
            <button onClick={() => payer(s)}>Choisir</button>
          </div>
        ))}

        <button onClick={close}>Fermer</button>
      </div>
    </div>
  );
}