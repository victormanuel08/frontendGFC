<template>
  <div class="home-container">
    <main class="main-content">
      <section class="welcome-section">
        <h1 class="title">Bienvenido a Gamero FC</h1>
        <p class="subtitle">Llevando el campo de juego a tu pantalla</p>
      </section>
      <section class="promo-section">
        <h2 class="promo-title">¡Últimas Novedades!</h2>
        <p class="promo-description">Mantente al día con las competencias y entrenamientos más recientes.</p>
      </section>
      <section class="training-gear">
        <h2 class="gear-title">Indumentaria de Entrenamiento</h2>
        <img class="gear-image" src="/static/images/training-gear.jpeg" alt="Indumentaria de Entrenamiento" />
      </section>
      <section class="sponsors-section">
        <h2 class="sponsors-title">Patrocinadores</h2>
        <div class="sponsors-logos">
          <img src="/static/images/sponsor1.png" alt="Sponsor 1" />
          <img src="/static/images/sponsor2.png" alt="Sponsor 2" />
          <img src="/static/images/sponsor3.png" alt="Sponsor 3" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// Importa cualquier módulo o funcionalidad adicional aquí si es necesario.
// P.ej. en caso de manejar datos dinámicamente o agregar características.
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centro horizontalmente el contenido */
  justify-content: center; /* Centro verticalmente el contenido */
  text-align: center; /* Centro el texto */
  width: 100%;
  padding: 2rem 1rem;  /* Aumenta el padding para más espaciado */
  box-sizing: border-box;
}

.main-content {
  width: 100%;
  max-width: 1200px; /* Limita el ancho máximo del contenido */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-section, .promo-section, .training-gear, .sponsors-section {
  width: 100%; /* Asegura que las secciones ocupen todo el ancho */
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
}

.promo-title, .gear-title, .sponsors-title {
  font-size: 2rem;
  font-weight: bold;
  color: #444;
}

.promo-description {
  font-size: 1rem;
  color: #555;
}

.gear-image, .sponsors-logos img {
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.sponsors-logos {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
