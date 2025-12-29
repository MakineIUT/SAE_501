package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.Utilisateur;
import sae501.tritech.tritech.service.UtilisateurService;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/connexion")
    public ResponseEntity<?> authentifier(
            @RequestParam String email,
            @RequestParam String motDePasse) {

        Utilisateur utilisateur = utilisateurService.authentifier(email, motDePasse);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        }
        return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Boolean> emailExiste(@PathVariable String email) {
        return ResponseEntity.ok(utilisateurService.emailExiste(email));
    }

    @GetMapping("/email")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@RequestParam String email) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(email);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        }
        return ResponseEntity.notFound().build();
    }
}