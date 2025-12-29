package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Attestation;
import sae501.tritech.tritech.entity.Apprenant;
import sae501.tritech.tritech.entity.Session;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttestationRepository extends JpaRepository<Attestation, Long> {
    List<Attestation> findByApprenant(Apprenant apprenant);
    List<Attestation> findBySession(Session session);
    Optional<Attestation> findByApprenantAndSession(Apprenant apprenant, Session session);
}
