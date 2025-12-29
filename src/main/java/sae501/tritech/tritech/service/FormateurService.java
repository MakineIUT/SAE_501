package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
@Transactional
public class FormateurService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private PresenceRepository presenceRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    public void entrerNotes(Note note) {
        noteRepository.save(note);
    }

    public List<Apprenant> voirListeApprenants(Session session) {
        List<Inscription> inscriptions = inscriptionRepository.findBySession(session);
        List<Apprenant> apprenants = new ArrayList<>();
        for (Inscription inscription : inscriptions) {
            apprenants.add(inscription.getApprenant());
        }
        return apprenants;
    }

    public void marquerPresence(Apprenant apprenant, Session session, Formateur formateur, boolean present) {
        Presence presence = new Presence();
        presence.setApprenant(apprenant);
        presence.setSession(session);
        presence.setFormateur(formateur);
        presence.setPresent(present);
        presence.setDatePresence(LocalDateTime.now());
        presenceRepository.save(presence);
    }

    public List<Presence> voirListePresence(Session session) {
        return presenceRepository.findBySession(session);
    }
}