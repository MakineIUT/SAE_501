package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.Paiement;
import sae501.tritech.tritech.repository.PaiementRepository;
import java.util.List;

@Service
@Transactional
public class PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;

    public void validerPaiement(Long idPaiement) {
        Paiement paiement = paiementRepository.findById(idPaiement).orElse(null);
        if (paiement != null) {
            paiement.validerPaiement();
            paiementRepository.save(paiement);
        }
    }

    public String genererRecu(Long idPaiement) {
        Paiement paiement = paiementRepository.findById(idPaiement).orElse(null);
        if (paiement != null) {
            return paiement.genererRecu();
        }
        return null;
    }

    public List<Paiement> getPaiementsByStatut(String statut) {
        return paiementRepository.findByStatut(statut);
    }
}