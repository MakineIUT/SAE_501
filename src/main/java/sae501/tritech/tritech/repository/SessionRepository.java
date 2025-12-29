package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Session;
import sae501.tritech.tritech.entity.Formation;
import sae501.tritech.tritech.entity.Lieu;
import sae501.tritech.tritech.entity.Formateur;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByFormation(Formation formation);
    List<Session> findByLieu(Lieu lieu);
    List<Session> findByFormateur(Formateur formateur);
    List<Session> findByStatut(String statut);
    List<Session> findByDateDebutAfter(LocalDateTime date);
    List<Session> findByDateDebutBetween(LocalDateTime debut, LocalDateTime fin);
}