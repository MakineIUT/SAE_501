import DashboardAdmin from "./DashboardAdmin";
import DashboardApprenant from "./DashboardApprenant";
import DashboardFormateur from "./DashboardFormateur";

export default function Dashboard() {
  // utilisateur simulé (comme s’il venait de la BDD)
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Vous devez être connecté pour accéder au dashboard</h2>
      </div>
    );
  }

  if (user.role === "ADMIN") return <DashboardAdmin />;
  if (user.role === "FORMATEUR") return <DashboardFormateur />;
  if (user.role === "APPRENANT") return <DashboardApprenant />;

  return null;
}