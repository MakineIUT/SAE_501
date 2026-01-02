package sae501.tritech.tritech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sae501.tritech.tritech.entity.Lieu;
import sae501.tritech.tritech.service.LieuService;

import java.util.List;

@RestController
@RequestMapping("/api/lieux")
@CrossOrigin(origins = "*")
public class LieuController {

    @Autowired
    private LieuService lieuService;

    @GetMapping
    public ResponseEntity<List<Lieu>> getAllLieux() {
        return ResponseEntity.ok(lieuService.getTousLesLieux());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lieu> getLieuById(@PathVariable Long id) {
        Lieu lieu = lieuService.getLieuById(id);
        if (lieu != null) {
            return ResponseEntity.ok(lieu);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}