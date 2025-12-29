package sae501.tritech.tritech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sae501.tritech.tritech.entity.Lieu;
import java.util.List;

@Repository
public interface LieuRepository extends JpaRepository<Lieu, Long> {
    List<Lieu> findByVille(String ville);
    List<Lieu> findByNomLieuContainingIgnoreCase(String nomLieu);
}
