package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "session")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_session")
    private Long idSession;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @Column(name = "capacite_max")
    private Integer capaciteMax = 12;

    private String statut;

    public Session() {}

    public Session(Long idSession, LocalDateTime dateDebut, LocalDateTime dateFin, Integer capaciteMax, String statut, Formation formation, Lieu lieu, Formateur formateur, List<Inscription> inscriptions, List<Note> notes, List<Attestation> attestations, List<Presence> presences) {
        this.idSession = idSession;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.capaciteMax = capaciteMax;
        this.statut = statut;
        this.formation = formation;
        this.lieu = lieu;
        this.formateur = formateur;
        this.inscriptions = inscriptions;
        this.notes = notes;
        this.attestations = attestations;
        this.presences = presences;
    }


    public Long getIdSession() {
        return idSession;
    }

    public void setIdSession(Long idSession) {
        this.idSession = idSession;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Integer getCapaciteMax() {
        return capaciteMax;
    }

    public void setCapaciteMax(Integer capaciteMax) {
        this.capaciteMax = capaciteMax;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Formation getFormation() {
        return formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public Lieu getLieu() {
        return lieu;
    }

    public void setLieu(Lieu lieu) {
        this.lieu = lieu;
    }

    public Formateur getFormateur() {
        return formateur;
    }

    public void setFormateur(Formateur formateur) {
        this.formateur = formateur;
    }

    public List<Inscription> getInscriptions() {
        return inscriptions;
    }

    public void setInscriptions(List<Inscription> inscriptions) {
        this.inscriptions = inscriptions;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public List<Attestation> getAttestations() {
        return attestations;
    }

    public void setAttestations(List<Attestation> attestations) {
        this.attestations = attestations;
    }

    public List<Presence> getPresences() {
        return presences;
    }

    public void setPresences(List<Presence> presences) {
        this.presences = presences;
    }


    public String afficherDateSession() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return "Début: " + dateDebut.format(formatter) + " - Fin: " + dateFin.format(formatter);
    }

    public Lieu getidLieu() {
        return this.getidLieu();
    }

    public int getCapaciteRestante() {
        int inscrits = this.inscriptions != null ? this.inscriptions.size() : 0;
        return this.capaciteMax - inscrits;
    }

    public boolean inscrireApprenant(Apprenant apprenant) {
        if (getCapaciteRestante() > 0) {
            return true;
        }
        return false;
    }



    //Relations
    @ManyToOne
    @JoinColumn(name = "id_formation")
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "id_lieu")
    private Lieu lieu;

    @ManyToOne
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Inscription> inscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Note> notes = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Attestation> attestations = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Presence> presences = new ArrayList<>();
}
