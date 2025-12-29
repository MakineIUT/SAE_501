package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formateur")
public class Formateur extends Utilisateur {

    @Column(name = "id_formateur")
    private Long idFormateur;

    private String specialite;

    public Formateur() {
        super();
    }

    public Formateur(Long idUtilisateur, String nom, String prenom, String email, String motDePasse, int telephone, Long idFormateur, String specialite, List<Session> sessions, List<Formation> formations, List<Note> notesSaisies, List<Presence> presencesGerees) {
        super(idUtilisateur, nom, prenom, email, motDePasse, telephone);
        this.idFormateur = idFormateur;
        this.specialite = specialite;
        this.sessions = sessions;
        this.formations = formations;
        this.notesSaisies = notesSaisies;
        this.presencesGerees = presencesGerees;
    }

    public Long getIdFormateur() {
        return idFormateur;
    }

    public void setIdFormateur(Long idFormateur) {
        this.idFormateur = idFormateur;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public List<Formation> getFormations() {
        return formations;
    }

    public void setFormations(List<Formation> formations) {
        this.formations = formations;
    }

    public List<Note> getNotesSaisies() {
        return notesSaisies;
    }

    public void setNotesSaisies(List<Note> notesSaisies) {
        this.notesSaisies = notesSaisies;
    }

    public List<Presence> getPresencesGerees() {
        return presencesGerees;
    }

    public void setPresencesGerees(List<Presence> presencesGerees) {
        this.presencesGerees = presencesGerees;
    }


    public List<Presence> voirListePresence() {
        return this.presencesGerees;
    }


    //Relations
    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    private List<Formation> formations = new ArrayList<>();

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    private List<Note> notesSaisies = new ArrayList<>();

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    private List<Presence> presencesGerees = new ArrayList<>();
}
