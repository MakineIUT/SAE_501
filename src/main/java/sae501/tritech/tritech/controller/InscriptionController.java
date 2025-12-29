package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.Inscription;
import sae501.tritech.tritech.service.InscriptionService;
import sae501.tritech.tritech.repository.InscriptionRepository;

@RestController
@RequestMapping("/api/inscriptions")
@CrossOrigin(origins = "*")
public class InscriptionController {

    @Autowired
    private InscriptionService inscriptionService;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @PostMapping("/{id}/paiement")
    public ResponseEntity<String> effectuerPaiement(@PathVariable Long id) {
        Inscription inscription = inscriptionRepository.findById(id).orElse(null);
        if (inscription != null && inscriptionService.effectuerPaiement(inscription)) {
            return ResponseEntity.ok("Paiement effectué avec succès");
        }
        return ResponseEntity.badRequest().body("Échec du paiement");
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<String> validerInscription(@PathVariable Long id) {
        inscriptionService.validerInscription(id);
        return ResponseEntity.ok("Inscription validée");
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<String> annulerInscription(@PathVariable Long id) {
        inscriptionService.annulerInscription(id);
        return ResponseEntity.ok("Inscription annulée");
    }
}
