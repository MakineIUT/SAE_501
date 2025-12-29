package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.Formation;
import sae501.tritech.tritech.repository.FormationRepository;
import java.util.List;

@Service
@Transactional
public class FormationService {

    @Autowired
    private FormationRepository formationRepository;

    public List<Formation> getListeFormations() {
        return formationRepository.findAll();
    }

    public Formation getFormationById(Long id) {
        return formationRepository.findById(id).orElse(null);
    }

    public List<Formation> rechercherFormations(String intitule) {
        return formationRepository.findByIntituleContainingIgnoreCase(intitule);
    }

    public List<Formation> getFormationsParCategorie(String categorie) {
        return formationRepository.findByCategorie(categorie);
    }

    public void ajouterFormation(Formation formation) {
        formationRepository.save(formation);
    }
}