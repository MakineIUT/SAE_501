package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ApprenantService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private AttestationRepository attestationRepository;

    @Autowired
    private SessionRepository sessionRepository;

    public void inscrireFormation(Apprenant apprenant, Formation formation, Session session) {
        Inscription inscription = new Inscription();
        inscription.setApprenant(apprenant);
        inscription.setFormation(formation);
        inscription.setSession(session);
        inscription.setDateInscription(LocalDateTime.now());
        inscription.setStatut("En attente");
        inscriptionRepository.save(inscription);
    }

    public void choisirSession(Apprenant apprenant, Session session) {
        // Vérifier si l'apprenant peut s'inscrire
        if (session.inscrireApprenant(apprenant)) {
            Inscription inscription = new Inscription();
            inscription.setApprenant(apprenant);
            inscription.setSession(session);
            inscription.setFormation(session.getFormation());
            inscriptionRepository.save(inscription);
        }
    }

    public void effectuerPaiement(Inscription inscription, Paiement paiement) {
        paiement.setInscription(inscription);
        paiement.setDatePaiement(LocalDateTime.now());
        paiementRepository.save(paiement);

        // Mettre à jour le statut de l'inscription
        inscription.setStatut("Payée");
        inscriptionRepository.save(inscription);
    }

    public List<Attestation> voirAttestations(Apprenant apprenant) {
        return attestationRepository.findByApprenant(apprenant);
    }

    public List<Paiement> voirListePaiements(Apprenant apprenant) {
        List<Inscription> inscriptions = inscriptionRepository.findByApprenant(apprenant);
        List<Paiement> paiements = new java.util.ArrayList<>();
        for (Inscription inscription : inscriptions) {
            paiementRepository.findByInscription(inscription).ifPresent(paiements::add);
        }
        return paiements;
    }
}
