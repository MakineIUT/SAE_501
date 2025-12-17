stripe (exension payement) 

méthode 

utilisateur : 
- get set /constructeur 
- inscription_compte (sign_in)
- connexion (sign_up)
- déconnection (logout) 

admin :
  - get set / constructeur 
  - ajouteFormateur /supprimer / modifier
  - ajouteApprenant /modifier / supprimer 
  - ajouteFormation
  - voit listUser
 
  Apprenant :
  - set get
  - voir notes
  - s'incrire une formation
  - choisir une session
  - payer
  - voir attestation if message "pas attester : absent"
  - (liste de paiement) 
 
  formateur :
  - set get constructeur
  - entrer les notes
  - list apprenants
  - [liste de présence (cocher etc..)]
 
  inscription formation :
  - payer
  - 
 
  session :
  - affiche date de la session
  - lieu 
  - capacité (12 max)
 
   
   attestation :
    - voir note
    - >10 : génère attestation
    if <10 ou absent -> pas attestation -> message
  

    note :
    - voir note 

  formation :
    - liste des formation
    - nombre de session (4 par ans)
  

  

  
