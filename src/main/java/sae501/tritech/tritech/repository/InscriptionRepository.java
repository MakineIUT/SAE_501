package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Inscription;
import sae501.tritech.tritech.entity.Apprenant;
import sae501.tritech.tritech.entity.Session;
import sae501.tritech.tritech.entity.Formation;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByApprenant(Apprenant apprenant);
    List<Inscription> findBySession(Session session);
    List<Inscription> findByFormation(Formation formation);
    List<Inscription> findByStatut(String statut);
    Optional<Inscription> findByApprenantAndSession(Apprenant apprenant, Session session);
}