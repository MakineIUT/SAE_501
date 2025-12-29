package sae501.tritech.tritech.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.FormateurService;
import sae501.tritech.tritech.repository.*;
import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
@CrossOrigin(origins = "*")
public class FormateurController {

    @Autowired
    private FormateurService formateurService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @PostMapping("/notes")
    public ResponseEntity<String> entrerNotes(@RequestBody Note note) {
        formateurService.entrerNotes(note);
        return ResponseEntity.ok("Note enregistrée avec succès");
    }

    @GetMapping("/sessions/{idSession}/apprenants")
    public ResponseEntity<List<Apprenant>> voirListeApprenants(@PathVariable Long idSession) {
        Session session = sessionRepository.findById(idSession).orElse(null);
        if (session != null) {
            return ResponseEntity.ok(formateurService.voirListeApprenants(session));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/presences")
    public ResponseEntity<String> marquerPresence(
            @RequestParam Long idApprenant,
            @RequestParam Long idSession,
            @RequestParam Long idFormateur,
            @RequestParam boolean present) {

        Apprenant apprenant = apprenantRepository.findById(idApprenant).orElse(null);
        Session session = sessionRepository.findById(idSession).orElse(null);
        Formateur formateur = formateurRepository.findById(idFormateur).orElse(null);

        if (apprenant != null && session != null && formateur != null) {
            formateurService.marquerPresence(apprenant, session, formateur, present);
            return ResponseEntity.ok("Présence marquée avec succès");
        }
        return ResponseEntity.badRequest().body("Données invalides");
    }

    @GetMapping("/sessions/{idSession}/presences")
    public ResponseEntity<List<Presence>> voirListePresence(@PathVariable Long idSession) {
        Session session = sessionRepository.findById(idSession).orElse(null);
        if (session != null) {
            return ResponseEntity.ok(formateurService.voirListePresence(session));
        }
        return ResponseEntity.notFound().build();
    }
}