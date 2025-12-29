package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Paiement;
import sae501.tritech.tritech.entity.Inscription;
import java.util.Optional;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    Optional<Paiement> findByInscription(Inscription inscription);
    Optional<Paiement> findByReferenceTransaction(String referenceTransaction);
    List<Paiement> findByStatut(String statut);
}
