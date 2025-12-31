package sae501.tritech.tritech.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.ApprenantService;
import sae501.tritech.tritech.repository.*;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/apprenants")
@CrossOrigin(origins = "*")
public class ApprenantController {

    @Autowired
    private ApprenantService apprenantService;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @PostMapping("/inscription") // L'URL sera donc /api/apprenants/inscription
    public ResponseEntity<?> creerApprenant(@RequestBody Apprenant apprenant) {
        try {
            // Le service doit sauvegarder l'apprenant (qui est aussi un utilisateur)
            Apprenant nouveau = apprenantRepository.save(apprenant);
            return ResponseEntity.ok(nouveau);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la création : " + e.getMessage());
        }
    }

    @PostMapping("/{idApprenant}/inscriptions")
    public ResponseEntity<String> inscrireFormation(
            @PathVariable Long idApprenant,
            @RequestParam Long idFormation,
            @RequestParam Long idSession) {

        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        Formation formation = formationRepository.findById(idFormation).orElse(null);
        Session session = sessionRepository.findById(idSession).orElse(null);

        if (apprenant != null && formation != null && session != null) {
            apprenantService.inscrireFormation(apprenant, formation, session);
            return ResponseEntity.ok("Inscription réussie");
        }
        return ResponseEntity.badRequest().body("Données invalides");
    }

    @PostMapping("/{idApprenant}/paiements")
    public ResponseEntity<String> effectuerPaiement(
            @PathVariable Long idApprenant,
            @RequestParam Long idInscription,
            @RequestBody Paiement paiement) {

        Inscription inscription = inscriptionRepository.findById(idInscription).orElse(null);

        if (inscription != null) {
            apprenantService.effectuerPaiement(inscription, paiement);
            return ResponseEntity.ok("Paiement effectué avec succès");
        }
        return ResponseEntity.badRequest().body("Inscription non trouvée");
    }

    @GetMapping("/{idApprenant}/attestations")
    public ResponseEntity<List<Attestation>> voirAttestations(@PathVariable Long idApprenant) {
        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        if (apprenant != null) {
            return ResponseEntity.ok(apprenantService.voirAttestations(apprenant));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{idApprenant}/paiements")
    public ResponseEntity<List<Paiement>> voirListePaiements(@PathVariable Long idApprenant) {
        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        if (apprenant != null) {
            return ResponseEntity.ok(apprenantService.voirListePaiements(apprenant));
        }
        return ResponseEntity.notFound().build();
    }
}
