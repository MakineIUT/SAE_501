export default function Apropos() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "80px 10%"
      }}
    >
      {/* SECTION VISITE VIRTUELLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: "30px",
          overflow: "hidden",
          minHeight: "400px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
        }}
      >
        {/* ZONE 3D / IMAGE */}
        <div
          style={{
            width: "50%",
            height: "100%",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/*
            ICI PLUS TARD :
            <Canvas>
              Salle immersive 3D (Three.js / Babylon.js)
            </Canvas>
          */}

          <img
            src="https://via.placeholder.com/800x600"
            alt="Salle immersive"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        {/* TEXTE */}
        <div
          style={{
            width: "50%",
            padding: "50px"
          }}
        >
          <h1 style={{ fontWeight: "800", marginBottom: "20px" }}>
            Visite virtuelle
          </h1>

          <p style={{ color: "#555", marginBottom: "30px", lineHeight: "1.6" }}>
            La salle immersive en 3D permet de plonger virtuellement dans un environnement de formation réaliste, reproduisant une salle de classe. Cette immersion a pour objectif de renforcer l’engagement des apprenants et de leur offrir une meilleure projection dans leur futur cadre d’apprentissage.
          </p>

          <button
            style={{
              padding: "14px 30px",
              background: "#7b2ff7",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Visiter la salle
          </button>
        </div>
      </div>

      {/* PARAGRAPHE DE PRÉSENTATION (À COMPLÉTER PLUS TARD) */}
      <div
        style={{
          marginTop: "60px",
          background: "#fff",
          borderRadius: "20px",
          padding: "60px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <p style={{ color: "#555", lineHeight: "1.8" }}>
            <h3 style={{ marginBottom: "30px", color: "black" }}>Présentation Entreprise</h3>
Notre entreprise est spécialisée dans la formation professionnelle et l’accompagnement des apprenants dans le développement de compétences techniques et numériques. Nous proposons des formations adaptées aux besoins actuels du marché, en combinant pédagogie moderne, outils innovants et encadrement par des formateurs qualifiés. Notre objectif est d’offrir un environnement d’apprentissage accessible, structuré et orienté vers la réussite professionnelle de chaque apprenant.

Nous plaçons l’expérience utilisateur et la qualité de l’apprentissage au cœur de notre démarche. Grâce à des contenus clairs, des parcours progressifs et un suivi personnalisé, nous permettons à chacun d’évoluer à son rythme, tout en acquérant des compétences concrètes et directement applicables dans le monde professionnel.     
                  <h3 style={{ marginTop: "30px", color: "black" }}>Notre rôle et notre vision</h3>
Notre rôle est d’accompagner les apprenants tout au long de leur parcours de formation, depuis l’inscription jusqu’à la validation des compétences acquises. Nous assurons un suivi pédagogique rigoureux, une gestion claire des formations et des sessions, ainsi qu’un cadre structuré favorisant l’engagement et la progression. Nous nous engageons également à fournir aux formateurs et aux équipes pédagogiques des outils efficaces pour assurer la qualité et la cohérence des formations proposées.

À travers notre plateforme, nous souhaitons créer un lien fort entre les apprenants, les formateurs et l’environnement de formation, en proposant une solution moderne, intuitive et évolutive.
</p>
      
      </div>
    </div>
  );
}