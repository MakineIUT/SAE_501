package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Formateur;
import java.util.Optional;
import java.util.List;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    Optional<Formateur> findByEmail(String email);
    Optional<Formateur> findByIdFormateur(Long idFormateur);
    List<Formateur> findBySpecialite(String specialite);
}
