package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.AttestationService;
import sae501.tritech.tritech.repository.*;
import java.util.List;

@RestController
@RequestMapping("/api/attestations")
@CrossOrigin(origins = "*")
public class AttestationController {

    @Autowired
    private AttestationService attestationService;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping("/generer")
    public ResponseEntity<String> genererAttestation(
            @RequestParam Long idApprenant,
            @RequestParam Long idSession) {

        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        Session session = sessionRepository.findById(idSession).orElse(null);

        if (apprenant != null && session != null) {
            if (attestationService.genererAttestation(apprenant, session)) {
                return ResponseEntity.ok("Attestation générée avec succès");
            }
            return ResponseEntity.badRequest().body("Conditions non remplies pour l'attestation");
        }
        return ResponseEntity.badRequest().body("Données invalides");
    }

    @GetMapping("/apprenant/{idApprenant}")
    public ResponseEntity<List<Attestation>> getAttestationsByApprenant(@PathVariable Long idApprenant) {
        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        if (apprenant != null) {
            return ResponseEntity.ok(attestationService.getAttestationsByApprenant(apprenant));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/verifier")
    public ResponseEntity<String> verifierConditions(
            @RequestParam Long idApprenant,
            @RequestParam Long idSession) {

        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        Session session = sessionRepository.findById(idSession).orElse(null);

        if (apprenant != null && session != null) {
            String resultat = attestationService.verifierConditionsAttestation(apprenant, session);
            return ResponseEntity.ok(resultat);
        }
        return ResponseEntity.badRequest().body("Données invalides");
    }
}