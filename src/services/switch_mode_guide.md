Guide : Gérer le mode Test et Production
Ce document explique comment utiliser le mode simulation pour le développement et la marche à suivre pour passer en production (API SpringBoot).

1. Fonctionnement Actuel (Mode Test)
Actuellement, l'application est configurée en mode simulation pour faciliter le développement.

Fichier de configuration : 
src/config.js
Outil de debug : Un menu déroulant jaune apparaît dans le header (en haut à gauche des liens) pour changer de rôle instantanément.
Rôles disponibles : Visiteur (déconnecté), Apprenant, Formateur, Admin.
Ce que ça change dans l'interface
Les menus du profil changent selon le rôle choisi.
Exemple : Si vous choisissez "Admin", vous verrez le lien "Administration" dans le menu profil.
2. Comportement des Pages Connexion/Inscription
Page Inscription
Actuellement : Le formulaire est visuel uniquement.
Comportement : Cliquer sur le bouton "Inscription" ne fait rien (pas de création de compte pour l'instant).
Page Connexion
Le comportement dépend du mode choisi (
src/config.js
) :

Mode Test (USE_MOCK_AUTH = true) :

Le formulaire intercepte la soumission.
Il vous connecte automatiquement et vous redirige vers le dashboard.
Si votre email contient "admin", vous devenez Admin, sinon Apprenant par défaut.
Mode Production (USE_MOCK_AUTH = false) :

Le formulaire tente une connexion simulée et redirige vers le dashboard.
⚠️ IMPORTANT : Comme l'API réelle n'est pas encore connectée, le Header restera en mode "Visiteur" (menus Connexion/Inscription visibles) même après redirection. C'est le comportement attendu jusqu'à ce que le backend soit lié.
3. Comment passer en Production (Vraie API)
Lorsque votre backend SpringBoot sera prêt et que vous voudrez connecter la vraie authentification :

Ouvrez le fichier 
src/config.js
.
Changez la valeur de USE_MOCK_AUTH à false.
// src/config.js
export const USE_MOCK_AUTH = false; // Mettre à false pour la production
Sauvegardez.
L'application passera automatiquement en mode production :
L'outil de debug (menu jaune) disparaîtra.
Le service d'authentification (
src/services/authService.js
) arrêtera de lire le localStorage de test et utilisera la logique de production (qu'il faudra implémenter dans ce même fichier).
3. Implémenter la vraie connexion (TODO futur)
Pour connecter votre API, vous n'aurez qu'à modifier 
src/services/authService.js
.

Dans 
getUserRole
, remplacez le return null par la lecture de votre token JWT ou appel API.
Dans 
logout
, ajoutez l'appel à votre endpoint de déconnexion si nécessaire.
Ce système vous permet de continuer à développer le frontend sans être bloqué par le backend.