package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "attestation")
public class Attestation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_attestation")
    private Long idAttestation;

    @Column(name = "date_generer")
    private LocalDateTime dateGenerer;


    public Attestation(){}

    public Attestation(Long idAttestation, LocalDateTime dateGenerer, Apprenant apprenant, Session session) {
        this.idAttestation = idAttestation;
        this.dateGenerer = dateGenerer;
        this.apprenant = apprenant;
        this.session = session;
    }

    public Long getIdAttestation() {
        return idAttestation;
    }

    public void setIdAttestation(Long idAttestation) {
        this.idAttestation = idAttestation;
    }

    public LocalDateTime getDateGenerer() {
        return dateGenerer;
    }

    public void setDateGenerer(LocalDateTime dateGenerer) {
        this.dateGenerer = dateGenerer;
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

    public boolean genererAttestation() {
        String verif = verifierConditions();
        if (verif.equals("OK")) {
            this.dateGenerer = LocalDateTime.now();
            return true;
        }
        return false;
    }

    public String verifierConditions() {
        // Vérifier la note (> 10)
        boolean noteValide = false;
        BigDecimal note = null;

        for (Note n : apprenant.getNotes()) {
            if (n.getSession().equals(this.session)) {
                note = n.getValeur();
                noteValide = n.estReussi();
                break;
            }
        }

        if (!noteValide) {
            return "Note insuffisante (< 10) : pas d'attestation";
        }

        // Vérifier la présence
        boolean present = true;
        for (Presence p : apprenant.getPresences()) {
            if (p.getSession().equals(this.session) && !p.isPresent()) {
                present = false;
                break;
            }
        }

        if (!present) {
            return "Absent : pas d'attestation";
        }

        return "OK";
    }

    //Relations
    @ManyToOne
    @JoinColumn(name = "id_apprenant", nullable = false)
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "id_session", nullable = false)
    private Session session;
}
