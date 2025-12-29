package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.PresenceService;
import sae501.tritech.tritech.repository.*;
import java.util.List;

@RestController
@RequestMapping("/api/presences")
@CrossOrigin(origins = "*")
public class PresenceController {

    @Autowired
    private PresenceService presenceService;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/apprenant/{idApprenant}/taux")
    public ResponseEntity<Double> getTauxPresence(@PathVariable Long idApprenant) {
        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        if (apprenant != null) {
            return ResponseEntity.ok(presenceService.getTauxPresence(apprenant));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/apprenant/{idApprenant}/session/{idSession}/taux")
    public ResponseEntity<Double> getTauxPresenceSession(
            @PathVariable Long idApprenant,
            @PathVariable Long idSession) {

        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        Session session = sessionRepository.findById(idSession).orElse(null);

        if (apprenant != null && session != null) {
            return ResponseEntity.ok(presenceService.getTauxPresenceSession(apprenant, session));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/apprenant/{idApprenant}")
    public ResponseEntity<List<Presence>> getPresencesByApprenant(@PathVariable Long idApprenant) {
        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        if (apprenant != null) {
            return ResponseEntity.ok(presenceService.getPresencesByApprenant(apprenant));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/session/{idSession}")
    public ResponseEntity<List<Presence>> getPresencesBySession(@PathVariable Long idSession) {
        Session session = sessionRepository.findById(idSession).orElse(null);
        if (session != null) {
            return ResponseEntity.ok(presenceService.getPresencesBySession(session));
        }
        return ResponseEntity.notFound().build();
    }
}
