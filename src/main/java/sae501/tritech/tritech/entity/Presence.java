package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "presence")
public class Presence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presence")
    private Long idPresence;

    @Column(name = "date_presence")
    private LocalDateTime datePresence;

    @Column(nullable = false)
    private boolean present = false;


    public Presence(){}

    public Presence(Long idPresence, LocalDateTime datePresence, boolean present, Apprenant apprenant, Session session, Formateur formateur) {
        this.idPresence = idPresence;
        this.datePresence = datePresence;
        this.present = present;
        this.apprenant = apprenant;
        this.session = session;
        this.formateur = formateur;
    }

    public Long getIdPresence() {
        return idPresence;
    }

    public void setIdPresence(Long idPresence) {
        this.idPresence = idPresence;
    }

    public LocalDateTime getDatePresence() {
        return datePresence;
    }

    public void setDatePresence(LocalDateTime datePresence) {
        this.datePresence = datePresence;
    }

    public boolean isPresent() {
        return present;
    }

    public void setPresent(boolean present) {
        this.present = present;
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

    public void marquerPresent() {
        this.present = true;
        this.datePresence = LocalDateTime.now();
    }

    public void marquerAbsent() {
        this.present = false;
        this.datePresence = LocalDateTime.now();
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
