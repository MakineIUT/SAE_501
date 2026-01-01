import { X } from "lucide-react";

export default function FormationDetailsModal({ formation, close }) {
  if (!formation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-sans">
          {formation.nom}
        </h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          {formation.descriptionDetaillee || "Développez de sites et applications interactives"}
        </p>

        {/* Details List */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Niveau</h3>
            <p className="text-gray-600 text-lg">{formation.niveau}</p>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nombre de places</h3>
            <p className="text-gray-600 text-lg">{formation.capacite}</p>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Durée</h3>
            <p className="text-gray-600 text-lg">{formation.duree}</p>
          </div>

          <div className="pb-2">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Prix</h3>
            <p className="text-gray-600 text-lg">{formation.prix}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
