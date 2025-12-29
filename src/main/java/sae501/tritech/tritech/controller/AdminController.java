package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.service.AdminService;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/formateurs")
    public ResponseEntity<String> ajouterFormateur(@RequestBody Formateur formateur) {
        adminService.ajouterFormateur(formateur);
        return ResponseEntity.ok("Formateur ajouté avec succès");
    }

    @PutMapping("/formateurs")
    public ResponseEntity<String> modifierFormateur(@RequestBody Formateur formateur) {
        adminService.modifierFormateur(formateur);
        return ResponseEntity.ok("Formateur modifié avec succès");
    }

    @DeleteMapping("/formateurs/{id}")
    public ResponseEntity<String> supprimerFormateur(@PathVariable Long id) {
        adminService.supprimerFormateur(id);
        return ResponseEntity.ok("Formateur supprimé avec succès");
    }

    @PostMapping("/apprenants")
    public ResponseEntity<String> ajouterApprenant(@RequestBody Apprenant apprenant) {
        adminService.ajouterApprenant(apprenant);
        return ResponseEntity.ok("Apprenant ajouté avec succès");
    }

    @PutMapping("/apprenants")
    public ResponseEntity<String> modifierApprenant(@RequestBody Apprenant apprenant) {
        adminService.modifierApprenant(apprenant);
        return ResponseEntity.ok("Apprenant modifié avec succès");
    }

    @DeleteMapping("/apprenants/{id}")
    public ResponseEntity<String> supprimerApprenant(@PathVariable Long id) {
        adminService.supprimerApprenant(id);
        return ResponseEntity.ok("Apprenant supprimé avec succès");
    }

    @PostMapping("/formations")
    public ResponseEntity<String> ajouterFormation(@RequestBody Formation formation) {
        adminService.ajouterFormation(formation);
        return ResponseEntity.ok("Formation ajoutée avec succès");
    }

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Utilisateur>> voirListeUtilisateurs() {
        return ResponseEntity.ok(adminService.voirListeUtilisateurs());
    }
}