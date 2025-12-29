package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formation")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formation")
    private Long idFormation;

    @Column(nullable = false)
    private String intitule;

    private String categorie;

    private String niveau;

    private Integer duree;

    @Column(name = "prix")
    private BigDecimal prix;


    public Formation() {}

    public Formation(Long idFormation, String intitule, String categorie, String niveau, Integer duree, BigDecimal prix, Formateur formateur, List<Session> sessions, List<Inscription> inscriptions) {
        this.idFormation = idFormation;
        this.intitule = intitule;
        this.categorie = categorie;
        this.niveau = niveau;
        this.duree = duree;
        this.prix = prix;
        this.formateur = formateur;
        this.sessions = sessions;
        this.inscriptions = inscriptions;
    }

    public Long getIdFormation() {
        return idFormation;
    }

    public void setIdFormation(Long idFormation) {
        this.idFormation = idFormation;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Integer getDuree() {
        return duree;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Formateur getFormateur() {
        return formateur;
    }

    public void setFormateur(Formateur formateur) {
        this.formateur = formateur;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public List<Inscription> getInscriptions() {
        return inscriptions;
    }

    public void setInscriptions(List<Inscription> inscriptions) {
        this.inscriptions = inscriptions;
    }

    public int getNombreSessions() {
        return this.sessions != null ? this.sessions.size() : 0;
    }

    public void creerSession(Session session) {
        if (this.sessions == null) {
            this.sessions = new ArrayList<>();
        }
        this.sessions.add(session);
        session.setFormation(this);
    }


    //Relations
    @ManyToOne
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    private List<Inscription> inscriptions = new ArrayList<>();
}
