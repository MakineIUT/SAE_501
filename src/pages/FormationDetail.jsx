import { useParams } from "react-router-dom";

export default function FormationDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>
      <h1>Programme de la formation {id}</h1>
      <p>
        Ici tu mettras le texte détaillé du programme, des objectifs,
        compétences acquises, durée, etc.
      </p>
    </div>
  );
}