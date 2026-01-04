import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './app.css'
import Accueil from "./pages/Accueil.jsx";
import Apropos from "./pages/Apropos.jsx";
import Connexion from "./pages/Connexion.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardApprenant from "./pages/DashboardApprenant.jsx";
import DashboardFormateur from "./pages/DashboardFormateur.jsx";
import FormationDetail from "./pages/FormationDetail.jsx";
import Formations from "./pages/Formations.jsx";
import Inscription from "./pages/Inscription.jsx";
import Paiement from "./pages/Paiement.jsx";
// import Panier from "./pages/Panier.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Header />

    <Routes>
      <Route path='/' element={<Accueil />} />
      <Route path='/accueil' element={<Accueil />} />
      <Route path='/connexion' element={<Connexion />} />
      <Route path='/inscription' element={<Inscription />} />
      <Route path='/formations' element={<Formations />} />
      <Route path='/formations/:id' element={<FormationDetail />}/>
      <Route path='/dashboard/apprenant' element={<DashboardApprenant />} />
      <Route path='/dashboard/admin' element={<DashboardAdmin />} />
      <Route path='/dashboard/formateur' element={<DashboardFormateur />} />
      <Route path='/apropos' element={<Apropos />} />
       <Route path='/paiement' element={<Paiement />} />
      {/* <Route path='/panier' element={<Panier />} />
     
      <Route path='/dashboard/admin' element={<DashboardAdmin />} /> */}
    </Routes>

    <Footer />
    </BrowserRouter>
  )
}

export default App
