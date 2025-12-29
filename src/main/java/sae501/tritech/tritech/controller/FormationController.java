package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.Formation;
import sae501.tritech.tritech.service.FormationService;
import java.util.List;

@RestController
@RequestMapping("/api/formations")
@CrossOrigin(origins = "*")
public class FormationController {

    @Autowired
    private FormationService formationService;

    @GetMapping
    public ResponseEntity<List<Formation>> getListeFormations() {
        return ResponseEntity.ok(formationService.getListeFormations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        Formation formation = formationService.getFormationById(id);
        if (formation != null) {
            return ResponseEntity.ok(formation);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<Formation>> rechercherFormations(@RequestParam String intitule) {
        return ResponseEntity.ok(formationService.rechercherFormations(intitule));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Formation>> getFormationsParCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(formationService.getFormationsParCategorie(categorie));
    }

    @PostMapping
    public ResponseEntity<String> ajouterFormation(@RequestBody Formation formation) {
        formationService.ajouterFormation(formation);
        return ResponseEntity.ok("Formation ajoutée avec succès");
    }
}
