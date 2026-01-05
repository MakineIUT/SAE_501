import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api.js';

const Connexion = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const determineUserRole = (userData) => {
        // Détermine le rôle
        if (userData.idAdmin !== undefined && userData.idAdmin !== null) {
            return 'ADMIN';
        } else if (userData.idFormateur !== undefined && userData.idFormateur !== null) {
            return 'FORMATEUR';
        } else if (userData.idApprenant !== undefined && userData.idApprenant !== null) {
            return 'APPRENANT';
        }
        return 'APPRENANT'; // rôle par défaut
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${API_URL}/utilisateurs/connexion`,
                null,
                {
                    params: {
                        email: credentials.email,
                        motDePasse: credentials.password
                    }
                }
            );

            console.log('Connexion réussie:', response.data);
            
            // Déterminer le rôle de l'utilisateur
            const role = determineUserRole(response.data);
            
            // Ajouter le rôle aux données utilisateur
            const userWithRole = {
                ...response.data,
                role: role
            };
            
            // Stocker dans le localStorage
            localStorage.setItem('user', JSON.stringify(userWithRole));
            
            console.log('Utilisateur avec rôle:', userWithRole);
            
            // Forcer le rechargement de la page pour mettre à jour le Header
            if (role === 'ADMIN') {
                window.location.href = '/dashboard/admin';
            } else if (role === 'FORMATEUR') {
                window.location.href = '/dashboard/formateur';
            } else if (role === 'APPRENANT') {
                window.location.href = '/dashboard/apprenant';
            }
            
        } catch (err) {
            console.error('Erreur de connexion:', err);
            
            if (err.response && err.response.status === 401) {
                setError('Email ou mot de passe incorrect');
            } else if (err.response && err.response.status === 500) {
                setError('Erreur serveur. Veuillez réessayer plus tard.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-0 flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
            <div className="container mx-auto mb-52 px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        <div 
                            className="flex flex-col md:flex-row shadow-2xl border-0 rounded-[2rem] overflow-hidden bg-white bg-center bg-cover"
                            style={{ backgroundImage: "url('/Fond_connexion_SPHERE.png')" }}
                        >
                            
                            <div className="md:w-1/2 flex flex-col p-10 lg:p-16 text-white">
                                <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-uppercase">Bienvenue</h2>
                                <h4 className="text-xl font-light mb-6 tracking-widest uppercase">
                                    Débutez votre reconversion
                                </h4>
                                <p className="text-sm leading-relaxed opacity-90">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis ac velit non porttitor. Quisque eu convallis massa. Praesent feugiat iaculis nunc.
                                </p>
                            </div>

                            <div className="md:w-1/2 p-10 lg:p-16">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-0 text-black">Connexion</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 w-80">
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Mot de passe"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center">
                                            <input 
                                                id="souvenir" 
                                                name="souvenir" 
                                                type="checkbox" 
                                                className="accent-purple-600/25 hover:accent-purple-600 h-4 w-4 border-gray-500 focus:ring-purple-600"
                                            />
                                            <label htmlFor="souvenir" className='ml-2 text-xs text-gray-500 font-bold'>
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <a href="#" className="text-xs no-underline font-bold text-[#9F00D7]">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-0">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 text-white font-bold text-base rounded-2xl bg-[#6D00BC] hover:bg-[#5a009d] transform active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Connexion...' : 'Connexion'}
                                        </button>

                                        <div className="relative flex items-center justify-center my-2">
                                            <div className="flex-grow border-t-2 border-[#A2A2A2] rounded-lg"></div>
                                            <span className="flex-shrink mx-2 text-[#A2A2A2] text-xs lowercase tracking-widest">
                                                ou
                                            </span>
                                            <div className="flex-grow border-t-2 border-[#A2A2A2] rounded-lg"></div>
                                        </div>

                                        <a 
                                            href="/Inscription" 
                                            className="no-underline block w-full py-3 text-base text-center text-[#A2A2A2] font-bold rounded-2xl border-2 border-[#A2A2A2] hover:border-[#9F00D7] hover:border-4 hover:text-[#9F00D7] transition-all transform active:scale-[0.98]"
                                        >
                                            S'inscrire
                                        </a>
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

export default Connexion;