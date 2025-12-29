package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscription")
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscription")
    private Long idInscription;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription;

    private String statut; // En attente, Validée, Annulée, Payée


    public Inscription() {
    }

    public Inscription(Long idInscription, LocalDateTime dateInscription, String statut, Apprenant apprenant, Formation formation, Session session, Paiement paiement) {
        this.idInscription = idInscription;
        this.dateInscription = dateInscription;
        this.statut = statut;
        this.apprenant = apprenant;
        this.formation = formation;
        this.session = session;
        this.paiement = paiement;
    }

    public Long getIdInscription() {
        return idInscription;
    }

    public void setIdInscription(Long idInscription) {
        this.idInscription = idInscription;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Apprenant getApprenant() {
        return apprenant;
    }

    public void setApprenant(Apprenant apprenant) {
        this.apprenant = apprenant;
    }

    public Formation getFormation() {
        return formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Paiement getPaiement() {
        return paiement;
    }

    public void setPaiement(Paiement paiement) {
        this.paiement = paiement;
    }

    public void validerInscription() {
        this.statut = "Validée";
    }

    public void annulerInscription() {
        this.statut = "Annulée";
    }

    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = "En attente";
        }
    }

//Relation
    @ManyToOne
    @JoinColumn(name = "id_apprenant", nullable = false)
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "id_formation", nullable = false)
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "id_session", nullable = false)
    private Session session;

    @OneToOne(mappedBy = "inscription", cascade = CascadeType.ALL)
    private Paiement paiement;
}

