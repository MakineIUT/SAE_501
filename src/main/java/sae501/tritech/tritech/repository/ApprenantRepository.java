package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Apprenant;
import java.util.Optional;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    Optional<Apprenant> findByEmail(String email);
    Optional<Apprenant> findByIdApprenant(Long idApprenant);
}

