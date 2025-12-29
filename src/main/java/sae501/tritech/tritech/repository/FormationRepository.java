package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Formation;
import sae501.tritech.tritech.entity.Formateur;
import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByCategorie(String categorie);
    List<Formation> findByNiveau(String niveau);
    List<Formation> findByFormateur(Formateur formateur);
    List<Formation> findByIntituleContainingIgnoreCase(String intitule);
}
