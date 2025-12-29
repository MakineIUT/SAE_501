package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "note")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_note")
    private Long idNote;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal valeur; // Note sur 20


    public Note() {
    }

    public Note(Long idNote, BigDecimal valeur, Apprenant apprenant, Session session, Formateur formateur) {
        this.idNote = idNote;
        this.valeur = valeur;
        this.apprenant = apprenant;
        this.session = session;
        this.formateur = formateur;
    }

    public Long getIdNote() {
        return idNote;
    }

    public void setIdNote(Long idNote) {
        this.idNote = idNote;
    }

    public BigDecimal getValeur() {
        return valeur;
    }

    public void setValeur(BigDecimal valeur) {
        this.valeur = valeur;
    }

    public Apprenant getApprenant() {
        return apprenant;
    }

    public void setApprenant(Apprenant apprenant) {
        this.apprenant = apprenant;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Formateur getFormateur() {
        return formateur;
    }

    public void setFormateur(Formateur formateur) {
        this.formateur = formateur;
    }

    public BigDecimal calculerMoyenne() {
        return this.valeur;
    }

    public boolean estReussi() {
        return this.valeur.compareTo(BigDecimal.valueOf(10)) >= 0;
    }

    //Relations
    @ManyToOne
    @JoinColumn(name = "id_apprenant", nullable = false)
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "id_session", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

}
