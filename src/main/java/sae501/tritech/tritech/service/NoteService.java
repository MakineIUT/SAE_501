package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.NoteRepository;
import java.math.BigDecimal;
import java.util.List;
import java.math.RoundingMode;

@Service
@Transactional
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public void ajouterNote(Note note) {
        noteRepository.save(note);
    }

    public List<Note> getNotesByApprenant(Apprenant apprenant) {
        return noteRepository.findByApprenant(apprenant);
    }

    public List<Note> getNotesBySession(Session session) {
        return noteRepository.findBySession(session);
    }

    public BigDecimal getMoyenneApprenant(Apprenant apprenant) {
        List<Note> notes = noteRepository.findByApprenant(apprenant);

        if (notes == null || notes.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal somme = notes.stream()
                .map(Note::getValeur)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return somme.divide(BigDecimal.valueOf(notes.size()), 2, RoundingMode.HALF_UP);
    }
}
