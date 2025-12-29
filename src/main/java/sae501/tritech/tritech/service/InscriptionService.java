package sae501.tritech.tritech.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    public boolean effectuerPaiement(Inscription inscription) {
        if (inscription.getStatut().equals("En attente")) {
            Paiement paiement = new Paiement();
            paiement.setInscription(inscription);
            paiement.setMontant(inscription.getFormation().getPrix());
            paiement.setStatut("Validé");
            paiement.setDatePaiement(LocalDateTime.now());
            paiement.setReferenceTransaction("REF-" + UUID.randomUUID().toString());

            paiementRepository.save(paiement);

            inscription.setStatut("Payée");
            inscriptionRepository.save(inscription);

            return true;
        }
        return false;
    }

    public void validerInscription(Long idInscription) {
        Inscription inscription = inscriptionRepository.findById(idInscription).orElse(null);
        if (inscription != null) {
            inscription.validerInscription();
            inscriptionRepository.save(inscription);
        }
    }

    public void annulerInscription(Long idInscription) {
        Inscription inscription = inscriptionRepository.findById(idInscription).orElse(null);
        if (inscription != null) {
            inscription.annulerInscription();
            inscriptionRepository.save(inscription);
        }
    }
}
