package sae501.tritech.tritech.entity;
import jakarta.persistence.*;
import jakarta.servlet.http.HttpSession;

@MappedSuperclass
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;


    private String nom;


    private String prenom;

    @Column(nullable = false, unique = true) //obligatoire et unique
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(length = 10)
    private String telephone;

    //constructeur vide
    public Utilisateur(){

    }

    public Utilisateur(Long idUtilisateur, String nom, String prenom, String email, String motDePasse, String telephone) {
        this.idUtilisateur = idUtilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.telephone = telephone;
    }

    public Long getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }


    public String inscriptionCompte(String nom, String prenom, String telephone, String email, String motDePasse) {
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.motDePasse = motDePasse;

        //remplire les champs obligatoires
        if (this.email != null && !this.email.isEmpty() && this.motDePasse != null) {
            return "Inscription réussie pour " + this.prenom + " " + this.nom + ". Un mail de confirmation a été envoyé à " + this.email;
        } else {
            return "Erreur : Veuillez renseigner tous les champs obligatoires.";
        }
    }


    public boolean connexion(String email, String password) {
        return this.email.equals(email) && this.motDePasse.equals(password);
    }

    public void deconnexion(HttpSession session) {
        // Invalider la session actuelle de l'utilisateur
        if (session != null) {
            session.invalidate();
        System.out.println("L'utilisateur " + this.email + " a été déconnecté.");
        }
    }
}
