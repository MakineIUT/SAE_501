package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lieu")
public class Lieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lieu")
    private Long idLieu;

    @Column(name = "nom_lieu", nullable = false, length = 100)
    private String nomLieu;

    @Column(length = 100)
    private String ville;

    @Column
    private Integer capacite;

    public Lieu() {}

    public Lieu(Long idLieu, String nomLieu, String ville, Integer capacite, List<Session> sessions) {
        this.idLieu = idLieu;
        this.nomLieu = nomLieu;
        this.ville = ville;
        this.capacite = capacite;
        this.sessions = sessions;
    }

    public Long getIdLieu() {
        return idLieu;
    }

    public void setIdLieu(Long idLieu) {
        this.idLieu = idLieu;
    }

    public String getNomLieu() {
        return nomLieu;
    }

    public void setNomLieu(String nomLieu) {
        this.nomLieu = nomLieu;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public Integer getCapacite() {
        return capacite;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }


    //Relation
    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();
}
