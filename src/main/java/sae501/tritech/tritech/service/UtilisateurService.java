package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.Utilisateur;
import sae501.tritech.tritech.repository.*;

@Service
@Transactional
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Utilisateur authentifier(String email, String motDePasse) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email).orElse(null);

        if (utilisateur != null && utilisateur.connexion(email, motDePasse)) {
            return utilisateur;
        }
        return null;
    }

    public boolean emailExiste(String email) {
        return utilisateurRepository.existsByEmail(email);
    }

    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email).orElse(null);
    }
}