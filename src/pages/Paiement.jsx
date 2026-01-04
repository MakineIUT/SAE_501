import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Paiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const formation = location.state?.formation;

  // Si aucune formation n'est passée
  if (!formation) {
    return <p className="p-4 text-red-600">Aucune formation sélectionnée</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden relative">
        
        {/* Bouton retour */}
        <button
          onClick={() => navigate("/formations")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-purple-700 transition-colors font-medium group z-10"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour </span>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Formulaire de paiement à gauche */}
          <div className="md:w-1/2 p-8 pt-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Paiement</h1>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Informations personnelles
            </h2>

            <form className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="votre.email@example.com"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Informations de paiement
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="MM/AA"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-3 px-4 rounded-md hover:bg-purple-800 transition duration-300 font-semibold"
              >
                Payez maintenant
              </button>
            </form>
          </div>

          {/* Récapitulatif de la formation à droite */}
          <div className="md:w-1/2 p-8 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Récapitulatif
            </h2>

            {/* Image */}
            <img
              src={formation.image}
              alt={formation.nom}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-4">
              <p className="text-xl font-medium text-gray-800">{formation.nom}</p>
              <p className="text-gray-600">{formation.description}</p>
              <p className="text-3xl font-bold text-purple-700">
                {formation.prix || "299€"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}