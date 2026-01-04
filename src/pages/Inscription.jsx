import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Inscription = () => {
    // Ajout d'un état pour gérer les champs du formulaire (Axe d'amélioration)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-0 flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
            <div className="container mb-52 mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        {/* Carte principale */}
                        <div 
                            className="flex flex-col md:flex-row shadow-2xl border-0 rounded-[2rem] overflow-hidden bg-white bg-center bg-cover"
                            style={{ backgroundImage: "url('/Fond_connexion_SPHERE.png')" }}
                        >
                            
                            {/* Côté Gauche - Message de bienvenue */}
                            <div className="md:w-1/2 flex flex-col p-10 lg:p-16 text-white ">
                                <h2 className="text-5xl lg:text-6xl font-bold mb-6">BIENVENUE</h2>
                                <h4 className="text-xl font-light mb-6 tracking-widest uppercase">
                                    Débutez votre reconversion
                                </h4>
                                <p className="text-sm leading-relaxed opacity-90">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis ac velit non porttitor. Quisque eu convallis massa. Praesent feugiat iaculis nunc.
                                </p>
                            </div>

                            {/* Côté Droit - Formulaire */}
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

                                <form className="space-y-4 w-80">
                                    {/* Email */}
                                    <div>
           
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className=" w-full px-5 py-3 rounded-xl bg-[#F1F1F1]  focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>

                                    {/* Mot de passe */}
                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Mot de passe"
                                            required
                                        />
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Nom"
                                        />
                                    </div>

                                    {/* Prénom */}
                                    <div className="pb-4">
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1] border-none focus:ring-2 focus:ring-purple-600 outline-none text-black placeholder-gray-500"
                                            placeholder="Prénom"
                                        />
                                    </div>

                                    {/* Bouton de validation */}
                                    <div className='mt-0'>
                                        <button
                                            type="submit"
                                            className="w-full py-3 text-white font-semibold text-base rounded-2xl bg-[#6D00BC] hover:bg-[#5a009d] transform active:scale-[0.98] transition-all shadow-sm"
                                        >
                                            Inscription
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