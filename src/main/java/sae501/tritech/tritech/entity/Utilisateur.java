package sae501.tritech.tritech.entity;
import jakarta.persistence.*;
import jakarta.servlet.http.HttpSession;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "utilisateurs")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    private String nom;
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(length = 10)
    private int telephone;

    // Constructeurs
    public Utilisateur() {}

    public Utilisateur(Long idUtilisateur, String nom, String prenom, String email, String motDePasse, int telephone) {
        this.idUtilisateur = idUtilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.telephone = telephone;
    }

    // ✅ AJOUTEZ CETTE MÉTHODE pour identifier le rôle
    @JsonProperty("role")
    public String getRole() {
        if (this instanceof Admin) {
            return "ADMIN";
        } else if (this instanceof Formateur) {
            return "FORMATEUR";
        } else if (this instanceof Apprenant) {
            return "APPRENANT";
        }
        return "UTILISATEUR";
    }

    // Getters et setters existants
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

    public int getTelephone() {
        return telephone;
    }

    public void setTelephone(int telephone) {
        this.telephone = telephone;
    }

    public String inscriptionCompte(String nom, String prenom, int telephone, String email, String motDePasse) {
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.motDePasse = motDePasse;

        if (this.email != null && !this.email.isEmpty() && this.motDePasse != null && !this.motDePasse.isEmpty()) {
            return "Inscription réussie pour " + this.prenom + " " + this.nom;
        } else {
            return "Erreur : Veuillez renseigner tous les champs obligatoires.";
        }
    }

    public boolean connexion(String email, String password) {
        return this.email.equals(email) && this.motDePasse.equals(password);
    }

    public void deconnexion(HttpSession session) {
        if (session != null) {
            session.invalidate();
            System.out.println("L'utilisateur " + this.email + " a été déconnecté.");
        }
    }
}