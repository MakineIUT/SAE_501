package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.SessionService;
import sae501.tritech.tritech.repository.FormationRepository;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private FormationRepository formationRepository;

    @GetMapping("/disponibles")
    public ResponseEntity<List<Session>> getSessionsDisponibles() {
        return ResponseEntity.ok(sessionService.getSessionsDisponibles());
    }

    @GetMapping("/formation/{idFormation}")
    public ResponseEntity<List<Session>> getSessionsByFormation(@PathVariable Long idFormation) {
        Formation formation = formationRepository.findById(idFormation).orElse(null);
        if (formation != null) {
            return ResponseEntity.ok(sessionService.getSessionsByFormation(formation));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        Session session = sessionService.getSessionById(id);
        if (session != null) {
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/capacite")
    public ResponseEntity<Integer> getCapaciteRestante(@PathVariable Long id) {
        int capacite = sessionService.getCapaciteRestante(id);
        return ResponseEntity.ok(capacite);
    }

    @PostMapping
    public ResponseEntity<String> creerSession(@RequestBody Session session) {
        sessionService.creerSession(session);
        return ResponseEntity.ok("Session créée avec succès");
    }
}
