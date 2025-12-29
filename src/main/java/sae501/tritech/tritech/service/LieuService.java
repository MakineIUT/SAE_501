package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.Lieu;
import sae501.tritech.tritech.repository.LieuRepository;
import java.util.List;

@Service
@Transactional
public class LieuService {

    @Autowired
    private LieuRepository lieuRepository;

    public List<Lieu> getTousLesLieux() {
        return lieuRepository.findAll();
    }

    public Lieu getLieuById(Long id) {
        return lieuRepository.findById(id).orElse(null);
    }

    public List<Lieu> getLieuxParVille(String ville) {
        return lieuRepository.findByVille(ville);
    }

    public void ajouterLieu(Lieu lieu) {
        lieuRepository.save(lieu);
    }

    public void modifierLieu(Lieu lieu) {
        lieuRepository.save(lieu);
    }

    public void supprimerLieu(Long id) {
        lieuRepository.deleteById(id);
    }
}