import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Connexion = () => {
    // État pour gérer les identifiants
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tentative de connexion avec :", credentials);
    };

    return (
        <div className="flex items-center justify-center py-12 min-h-[calc(100vh-80px)] bg-gradient-to-r from-[#4500ab] to-[#8700c2]">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        {/* Carte principale */}
                        <div 
                            className="flex flex-col md:flex-row shadow-2xl border-0 rounded-[2rem] overflow-hidden bg-white bg-center bg-cover"
                            style={{ backgroundImage: "url('/Fond_connexion_SPHERE.png')" }}
                        >
                            
                            {/* Côté Gauche - Message de bienvenue (Inversé ou identique selon ton choix) */}
                            <div className="md:w-1/2 flex flex-col p-10 lg:p-16 text-white">
                                <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-uppercase">Bienvenue</h2>
                                <h4 className="text-xl font-light mb-6 tracking-widest uppercase">
                                    Débutez votre reconversion
                                </h4>
                                <p className="text-sm leading-relaxed opacity-90">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis ac velit non porttitor. Quisque eu convallis massa. Praesent feugiat iaculis nunc.
                                </p>
                            </div>

                            {/* Côté Droit - Formulaire de connexion */}
                            <div className="md:w-1/2 p-10 lg:p-16 ">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-0 text-black">Connexion</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 w-80">
                                    {/* Email */}
                                    <div>
                                        <input
                                            
                                            type="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1]  focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>

                                    {/* Mot de passe */}
                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-[#F1F1F1]  focus:ring-2 focus:ring-purple-600 focus:outline focus:outline-purple-600 text-black placeholder-gray-500"
                                            placeholder="Mot de passe"
                                            required
                                        />
                                    </div>
                                    {/*Se souvenir de moi & mpd oublié*/}
                                    <div className=" flex items-center justify-between mt-4" >
                                        <div className="flex items-center">
                                            <input id="souvenir" name="souvenir" type="checkbox" className="accent-purple-600/25 hover:accent-purple-600 h-4 w-4 border-gray-500 focus:ring-purple-600  "/>
                                            <label for="remember_me" className='ml-2 text-xs text-gray-500 font-bold' >
                                                Se souvenir de moi
                                            </label>

                                        </div>
                                        <div className="flex items-center ">
                                            <a href="#" className="text-xs no-underline font-bold text-[#9F00D7]">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                    </div>

                                    {/* Bouton de connexion */}
                                    <div className="pt-4 mt-0">
                                        <button
                                            type="submit"
                                            className="w-full py-3 text-white font-bold text-base rounded-2xl bg-[#6D00BC] hover:bg-[#5a009d] transform active:scale-[0.98] transition-all shadow-sm"
                                        >
                                            Connexion
                                        </button>
                                        {/*séparation*/}
                                        <div className="relative flex items-center justify-center my-2">
                                            <div className="flex-grow border-t-2 border-[#A2A2A2] rounded-lg"></div>
                                            <span className="flex-shrink mx-2 text-[#A2A2A2] text-xs lowercase tracking-widest ">
                                                ou
                                            </span>
                                            <div className="flex-grow border-t-2 border-[#A2A2A2] rounded-lg"></div>
                                        </div>
                                        {/*bouton d'inscription*/}
                                        <a href ="/Inscription" className="no-underline block w-full py-3 text-base text-center text-[#A2A2A2] font-bold rounded-2xl border-2 border-[#A2A2A2] hover:border-[#9F00D7] hover:border-4 hover:text-[#9F00D7] transition-all transform active:scale-[0.98]">
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