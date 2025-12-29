package sae501.tritech.tritech.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "apprenant")
public class Apprenant extends Utilisateur {

    @Column(name = "id_apprenant")
    private Long idApprenant;

    @Column(name = "date_inscription")
    private LocalDate dateInscription;

    public Apprenant() {
        super();
    }

    public Apprenant(Long idUtilisateur, String nom, String prenom, String email, String motDePasse, String telephone, Long idApprenant, LocalDate dateInscription, List<Inscription> inscriptions, List<Note> notes, List<Attestation> attestations, List<Presence> presences) {
        super(idUtilisateur, nom, prenom, email, motDePasse, telephone);
        this.idApprenant = idApprenant;
        this.dateInscription = dateInscription;
        this.inscriptions = inscriptions;
        this.notes = notes;
        this.attestations = attestations;
        this.presences = presences;
    }

    public Long getIdApprenant() {
        return idApprenant;
    }

    public void setIdApprenant(Long idApprenant) {
        this.idApprenant = idApprenant;
    }

    public LocalDate getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDate dateInscription) {
        this.dateInscription = dateInscription;
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


    public List<Note> voirNotes() {
        return this.notes;
    }


    //Relations
    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    private List<Inscription> inscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    private List<Note> notes = new ArrayList<>();

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    private List<Attestation> attestations = new ArrayList<>();

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    private List<Presence> presences = new ArrayList<>();
}
