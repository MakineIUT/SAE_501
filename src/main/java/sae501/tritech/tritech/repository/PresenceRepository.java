package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Presence;
import sae501.tritech.tritech.entity.Apprenant;
import sae501.tritech.tritech.entity.Session;
import sae501.tritech.tritech.entity.Formateur;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {
    List<Presence> findByApprenant(Apprenant apprenant);
    List<Presence> findBySession(Session session);
    List<Presence> findByFormateur(Formateur formateur);
    List<Presence> findBySessionAndPresent(Session session, boolean present);
    Optional<Presence> findByApprenantAndSession(Apprenant apprenant, Session session);
}