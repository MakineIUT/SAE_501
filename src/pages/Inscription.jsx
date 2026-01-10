import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api.js';

// Composant de page d'inscription
const Inscription = () => {
    // Hook de navigation
    const navigate = useNavigate();
    // État pour les données du formulaire
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: ''
    });
    // État pour les erreurs
    const [error, setError] = useState('');
    // État pour le chargement
    const [loading, setLoading] = useState(false);

    // Fonction pour gérer les changements dans les champs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation des champs
        if (!formData.email || !formData.password || !formData.nom || !formData.prenom) {
            setError('Tous les champs sont obligatoires');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            // Créer l'apprenant via l'API
            const response = await axios.post(
                `${API_URL}/admin/apprenants`,
                {
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    motDePasse: formData.password
                }
            );

            console.log('Inscription réussie:', response.data);
            
            // Connexion automatique après inscription
            try {
                const loginResponse = await axios.post(
                    `${API_URL}/utilisateurs/connexion`,
                    null,
                    {
                        params: {
                            email: formData.email,
                            motDePasse: formData.password
                        }
                    }
                );

                const userWithRole = {
                    ...loginResponse.data,
                    role: 'APPRENANT'
                };

                localStorage.setItem('user', JSON.stringify(userWithRole));
                
                // Redirection vers le dashboard apprenant
                navigate('/dashboard/apprenant');
                
            } catch (loginErr) {
                console.error('Erreur connexion auto:', loginErr);
                // Si la connexion auto échoue, rediriger vers la page de connexion
                alert('Inscription réussie ! Veuillez vous connecter.');
                navigate('/connexion');
            }

        } catch (err) {
            console.error('Erreur inscription:', err);
            
            if (err.response && err.response.status === 409) {
                setError('Cet email est déjà utilisé');
            } else if (err.response && err.response.status === 400) {
                setError('Données invalides. Veuillez vérifier les informations.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Rendu du composant
    return (
        <div className="mt-0 flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
            <div className="container mb-52 mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        {/* Section de présentation */}
                        <div
                            className="flex flex-col md:flex-row shadow-2xl border-0 rounded-[2rem] overflow-hidden bg-white bg-center bg-cover"
                            style={{ backgroundImage: "url('/Fond_connexion_SPHERE.png')" }}
                        >
                            <div className="md:w-1/2 flex flex-col p-10 lg:p-16 text-white ">
                                <h2 className="text-5xl lg:text-6xl font-bold mb-6">BIENVENUE</h2>
                                <h4 className="text-xl font-light mb-6 tracking-widest uppercase">
                                    Débutez votre reconversion
                                </h4>
                                <p className="text-sm leading-relaxed opacity-90">
                                    Accédez à des formations variées et développez des compétences concrètes pour réussir votre avenir professionnel.
                                </p>
                            </div>

                            {/* Section du formulaire */}
                            <div className="md:w-1/2 p-10 lg:p-16 ">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-2 text-black">Inscription</h2>
                                    <p className="text-sm text-gray-600">
                                        Déjà inscrit ?{' '}
                                        <Link
                                            to="/Connexion"
                                            className="no-underline font-bold text-gray-950 hover:text-purple-600 transition-colors "
                                        >
                                            Connectez-vous.
                                        </Link>
                                    </p>
                                </div>

                                {/* Formulaire d'inscription */}
                                <form onSubmit={handleSubmit} className="space-y-4 w-80">
                                    {/* Affichage des erreurs */}
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    {/* Champ email */}
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Champ mot de passe */}
                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Mot de passe"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Champ nom */}
                                    <div>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Nom"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Champ prénom */}
                                    <div className="pb-4">
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Prénom"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Bouton de soumission */}
                                    <div className='mt-0'>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 text-white font-semibold text-base rounded-2xl bg-[#6D00BC] hover:bg-[#5a009d] transform active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Inscription...' : 'Inscription'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inscription;