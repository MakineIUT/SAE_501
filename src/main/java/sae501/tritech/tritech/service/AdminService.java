package sae501.tritech.tritech.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.*;
import java.util.List;
import java.util.ArrayList;

@Service
@Transactional //protège les données
public class AdminService {

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public void ajouterFormateur(Formateur formateur) {
        formateurRepository.save(formateur);
    }

    public void supprimerFormateur(Long idFormateur) {
        formateurRepository.deleteById(idFormateur);
    }

    public void modifierFormateur(Formateur formateur) {
        formateurRepository.save(formateur);
    }

    public void ajouterApprenant(Apprenant apprenant) {
        apprenantRepository.save(apprenant);
    }

    public void modifierApprenant(Apprenant apprenant) {
        apprenantRepository.save(apprenant);
    }

    public void supprimerApprenant(Long idApprenant) {
        apprenantRepository.deleteById(idApprenant);
    }

    public void ajouterFormation(Formation formation) {
        formationRepository.save(formation);
    }

    public List<Utilisateur> voirListeUtilisateurs() {
        return utilisateurRepository.findAll();
    }
}