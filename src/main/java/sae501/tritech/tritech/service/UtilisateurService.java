package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.Utilisateur;
import sae501.tritech.tritech.entity.Apprenant;
import sae501.tritech.tritech.entity.Formateur;
import sae501.tritech.tritech.entity.Admin;
import sae501.tritech.tritech.repository.*;
import java.util.Optional;

@Service
@Transactional
public class UtilisateurService {

    @Autowired
    private ApprenantRepository apprenantRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Utilisateur authentifier(String email, String motDePasse) {
        // Chercher dans les apprenants
        Optional<Apprenant> apprenant = apprenantRepository.findByEmail(email);
        if (apprenant.isPresent() && apprenant.get().connexion(email, motDePasse)) {
            return apprenant.get();
        }

        // Chercher dans les formateurs
        Optional<Formateur> formateur = formateurRepository.findByEmail(email);
        if (formateur.isPresent() && formateur.get().connexion(email, motDePasse)) {
            return formateur.get();
        }

        // Chercher dans les admins
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().connexion(email, motDePasse)) {
            return admin.get();
        }

        return null;
    }

    public boolean emailExiste(String email) {
        return apprenantRepository.findByEmail(email).isPresent() ||
                formateurRepository.findByEmail(email).isPresent() ||
                adminRepository.findByEmail(email).isPresent();
    }

    public Utilisateur getUtilisateurByEmail(String email) {
        // Chercher dans apprenants
        Optional<Apprenant> apprenant = apprenantRepository.findByEmail(email);
        if (apprenant.isPresent()) {
            return apprenant.get();
        }

        // Chercher dans formateurs
        Optional<Formateur> formateur = formateurRepository.findByEmail(email);
        if (formateur.isPresent()) {
            return formateur.get();
        }

        // Chercher dans admins
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return admin.get();
        }

        return null;
    }
}