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
public class AttestationService {

    @Autowired
    private AttestationRepository attestationRepository;

    public boolean genererAttestation(Apprenant apprenant, Session session) {
        Attestation attestation = new Attestation();
        attestation.setApprenant(apprenant);
        attestation.setSession(session);

        if (attestation.genererAttestation()) {
            attestationRepository.save(attestation);
            return true;
        }
        return false;
    }

    public byte[] telechargerPDF(Long idAttestation) {
        // TODO: Implémenter la génération PDF avec iText ou autre bibliothèque
        // Pour l'instant retourne null
        return null;
    }

    public List<Attestation> getAttestationsByApprenant(Apprenant apprenant) {
        return attestationRepository.findByApprenant(apprenant);
    }

    public String verifierConditionsAttestation(Apprenant apprenant, Session session) {
        Attestation attestation = new Attestation();
        attestation.setApprenant(apprenant);
        attestation.setSession(session);
        return attestation.verifierConditions();
    }
}
