package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiement")
    private Long idPaiement;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;


    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    @Column(length = 50)
    private String statut; // En attente, Validé

    @Column(name = "reference_transaction",unique = true)
    private String referenceTransaction;

    public Paiement(){}

    public Paiement(Inscription inscription, String referenceTransaction, String statut, LocalDateTime datePaiement, BigDecimal montant, Long idPaiement) {
        this.inscription = inscription;
        this.referenceTransaction = referenceTransaction;
        this.statut = statut;
        this.datePaiement = datePaiement;
        this.montant = montant;
        this.idPaiement = idPaiement;
    }

    public Long getIdPaiement() {
        return idPaiement;
    }

    public void setIdPaiement(Long idPaiement) {
        this.idPaiement = idPaiement;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getReferenceTransaction() {
        return referenceTransaction;
    }

    public void setReferenceTransaction(String referenceTransaction) {
        this.referenceTransaction = referenceTransaction;
    }

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public void validerPaiement() {
        this.statut = "Validé";
        this.datePaiement = LocalDateTime.now();
    }

    public String genererRecu() {
        return "Reçu #" + this.idPaiement + " - Montant: " + this.montant + "€";
    }

    //Relation
    @OneToOne
    @JoinColumn(name = "id_inscription", nullable = false)
    private Inscription inscription;
}
