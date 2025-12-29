package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Note;
import sae501.tritech.tritech.entity.Apprenant;
import sae501.tritech.tritech.entity.Session;
import sae501.tritech.tritech.entity.Formateur;
import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByApprenant(Apprenant apprenant);
    List<Note> findBySession(Session session);
    List<Note> findByFormateur(Formateur formateur);
    Optional<Note> findByApprenantAndSession(Apprenant apprenant, Session session);
}