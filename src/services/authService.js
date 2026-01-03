import { USE_MOCK_AUTH } from '../config';

const STORAGE_KEY = 'user_role';

export const authService = {
    /**
     * Récupère le rôle de l'utilisateur connecté.
     * Retourne: 'admin', 'apprenant', 'formateur', ou null (non connecté).
     */
    getUserRole: () => {
        if (USE_MOCK_AUTH) {
            // Mode Test : on lit simplement le localStorage
            return localStorage.getItem(STORAGE_KEY);
        } else {
            // Mode Production (API SpringBoot)
            // TODO: Remplacer par la logique de lecture du token JWT ou appel API
            // Exemple : const token = localStorage.getItem('jwt_token'); ... decoding ...
            console.warn("Mode API activé mais pas encore implémenté. Retourne null par défaut.");
            return null;
        }
    },

    /**
   * Définit le rôle (Uniquement utile pour le mode Test/Debug)
   */
    setMockRole: (role) => {
        if (role) {
            localStorage.setItem(STORAGE_KEY, role);
            // Redirection automatique selon le rôle
            switch (role) {
                case 'apprenant':
                    window.location.href = '/dashboard/apprenant';
                    break;
                case 'formateur':
                    window.location.href = '/dashboard/formateur';
                    break;
                case 'admin':
                    window.location.href = '/dashboard/admin';
                    break;
                default:
                    window.location.href = '/';
            }
        } else {
            localStorage.removeItem(STORAGE_KEY);
            window.location.href = '/connexion';
        }
    },

    /**
     * Déconnexion
     */
    logout: () => {
        if (USE_MOCK_AUTH) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.href = '/connexion';
        } else {
            // Logique de déconnexion API (clear token, etc.)
            console.log("Logout API...");
            window.location.href = '/connexion';
        }
    }
};
