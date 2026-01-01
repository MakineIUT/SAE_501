export default function Paiement() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement</h1>
                <p className="text-gray-600 mb-8">
                    Vous allez être redirigé vers une plateforme de paiement sécurisée.
                </p>
                <button
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    onClick={() => alert("Simulation de redirection Stripe...")}
                >
                    Procéder au paiement
                </button>
            </div>
        </div>
    );
}
