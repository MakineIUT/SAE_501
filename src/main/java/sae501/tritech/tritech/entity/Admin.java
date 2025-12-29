package sae501.tritech.tritech.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "admin")
public class Admin extends Utilisateur{

    @Column(name = "id_admin")
    private Long idAdmin;


    public Admin() {
        super();
    }


    public Admin(Long idUtilisateur, String nom, String prenom, String email, String motDePasse, String telephone, Long idAdmin) {
        super(idUtilisateur, nom, prenom, email, motDePasse, telephone);
        this.idAdmin = idAdmin;
    }

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }
}
