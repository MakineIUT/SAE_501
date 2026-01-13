# SAE 501
# TRITECH

## Membres
- Sheinez Ben Boubaker
- Zeinabou Bal
- Markhus Hounsou
- Makine Mhoumadi

## Lien vers le projet hébergé
Notre plateforme TRITECH fonctionne en local, car  l'ensemble des fonctionnalités sont en cours de modifications. L'API back-end est actuellement déployée sur Railway à l'adresse suivante : https://grateful-reverence-production.up.railway.app/api

Le dossier contenant tout le front se trouve sur la branche **front-tritech**

Le dossier du projet Spring Boot se trouve sur la branche principale c'est-à-dire le **main**

---

## Présentation de TRITECH

TRITECH est une plateforme permettant aux organismes de formation de gérer l'ensemble de leurs activités pédagogiques, elle propose aussi une expérience immersive avec une visite virtuelle en 3D d'une salle de classe informatique. La plateforme offre aux apprenants la possibilité de consulter leurs résultats, de suivre leur progression et de télécharger leurs attestations. Elle permet également aux formateurs de gérer leurs sessions de formation, de saisir les notes et les présences. Enfin, les administrateurs peuvent superviser l'ensemble des utilisateurs, des formations et de la comptabilité.

## TRITECH est une plateforme avec plusieurs fonctionnalités

**PAGE FORMÉ (APPRENANT)** : Elle permet aux apprenants de visualiser leurs résultats d'examens et de suivre leur progression, le tout dans les meilleures conditions avec des statistiques. De plus, l'apprenant peut observer l'ensemble de ses résultats avec un historique intégré au sein de son tableau de bord. Il a également la possibilité de télécharger automatiquement ses attestations de réussite ou de présence. 

**PAGE FORMATEUR (INTERVENANT)** : La page formateur offre la possibilité de gérer les sessions de formation de manière autonome. Les formateurs peuvent saisir les notes de leurs apprenants, enregistrer les présences pour chaque session et suivre la progression de leurs groupes.

**PAGE ADMIN (ADMINISTRATEUR)** : La page admin offre la possibilité d'ajouter des utilisateurs au sein de la plateforme TRITECH. Ajouter de nouveaux apprenants pour qu'ils puissent observer l'intégralité de leurs résultats en détail, créer des comptes formateurs et leur affecter des formations. De plus, l'admin a accès à la modification d'un profil utilisateur et il a la possibilité d'en supprimer. 

**PAIEMENT SÉCURISÉ AVEC STRIPE** : La plateforme intègre Stripe pour la gestion des paiements. Les apprenants peuvent régler leurs formations en ligne de manière sécurisée grâce à l'intégration de Stripe Checkout. Cette fonctionnalité permet une gestion automatisée des transactions financières.

**GÉNÉRATION AUTOMATIQUE D'ATTESTATIONS** : Le système génère automatiquement des attestations selon les résultats obtenus par l'apprenant. Lorsque la note est supérieure ou égale à 10, l'apprenant reçoit une attestation de réussite. Dans le cas contraire, une attestation de présence lui est délivrée.

**IMMERSION 3D - SALLE DE CLASSE VIRTUELLE** : La plateforme propose une expérience immersive unique avec une salle de classe informatique modélisée en 3D. Cette fonctionnalité permet aux visiteurs de découvrir virtuellement l'environnement de formation.

## DIAGRAMME DE CLASSE

<img width="1760" height="1360" alt="Classe UML" src="https://github.com/user-attachments/assets/f0d50c4e-7134-41f5-9730-66168b42e2d7" />

## DIAGRAMME DE CAS D'UTILISATION 

<img width="441" height="364" alt="image" src="https://github.com/user-attachments/assets/024478ea-a7fb-4402-a3e9-1698ee9fea0b" />



## Comment s'est déroulée l'organisation de ce projet ?

Le projet se déroule sur plusieurs semaines. L'organisation s'est faite via Trello et GitHub. La communication, la cohésion et l'esprit d'équipe ont été présents au sein de l'équipe afin de réussir ce projet. Des réunions et des retours ont été faits à chaque fois que nous devions nous y mettre. Lorsque l'un des membres rencontrait des difficultés, il était de notre mission à tous les autres membres de l'aider.

## Répartition des tâches

**Sheinez Ben Boubaker** : Chef de projet, Développeur Back-End, Développeur Front

Organisation et meneur du projet. Développement de l'API REST avec Spring Boot. Liaison entre l'API et le front.

**Zeinabou Bal** : Développeut Back, Développeur Front, Designer Graphique

Conception de la base de données. Développement des composants React. Modélisatrice du modèle 3D et Intégration des éléments 3D dans l'application React.

**Markhus Hounsou** : Modeleur 3D, Développeur Front

Conception du modèle MCD, Création de la salle de classe virtuelle en 3D sur Blender. Développement des composants React. Optimisation des performances 3D.

**Makine Mhoumadi** : Designer Graphique, Développeur Front, Développeur Back-End

Conception du diagramme de classe. Conception du Design System. Gestion du projet React : Développement des composants React. Tests et validation du code. 
## Langages utilisés

**Front-End** : HTML, CSS, JavaScript, React.

**Back-End** : Java, Spring Boot, Spring Security, Spring Data JPA.

**Base de données** : MySQL.

**Création des maquettes et leur charte graphique** : Figma.

**Développement** : Visual Studio Code, IntelliJ IDEA.

**Hébergement** : Railway.

**Containerisation** : Docker.

**Gestion de version** : GitHub.

**Collaboration** : Google Drive, Instagram, Trello.

## Résultats obtenus

### Nos réussites

Notre équipe est actuellement sur le point de finaliser le projet. Les éléments et les attentes que nous avons eus entre membres ont été répondus et sont en cours de finalisation pour les fonctionnalités des acteurs du site.

L'API REST développée avec Spring Boot est fonctionnelle et déployée sur Railway. Les composants React développés en front ressemblent de très près à la maquette du site.L'intégration de la salle de classe en 3D a été réalisée avec succès et offre une expérience immersive aux utilisateurs, En revanche, Le fichier 3D n'est pas disponible sur GitHub en raison de sa taille importante.

L'intégration de Stripe pour les paiements fonctionne correctement. La génération automatique d'attestations fonctionne parfaitement.

### Difficultés rencontrées

Nous avons rencontré des difficultés concernant le déploiement de l'API Spring Boot sur Railway, ce qui était un imprévu. Cela nous a empêchés de finaliser le site dans les temps demandés.

La liaison entre l'API et le front a été difficile, notamment pour la gestion des requêtes. Nous sommes actuellement en train de régler les derniers problèmes.


## Conclusion

Le projet TRITECH nous a permis de gagner en expérience dans le métier de développement web, mais aussi dans l'organisation d'un projet intéressant. Ce projet nous a fait comprendre l'utilisation de React tout en acquérant de nouvelles compétences en Spring Boot, et en développant encore mieux notre expertise en design, en développement front et back. Mais aussi sur la modélisation 3D, l'intégration de paiements avec Stripe et le travail en groupe.








