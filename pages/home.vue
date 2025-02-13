<template>
  <div class="home-page">
    <Carousel />
    <!-- Aquí puedes añadir más secciones de la página de inicio -->
    <div class="welcome-section">
      <h1>Bienvenidos a Nuestro Sitio</h1>
      <p>Explora y disfruta de nuestro contenido.</p>
    </div>
    <div class="featured-section">
      <h2>Sección Destacada</h2>
      <p>Aquí puedes destacar algo importante.</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Carousel from '@/components/Carousel.vue';

</script>
<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-section {
  margin: 20px;
  text-align: center;
}

.featured-section {
  margin: 20px;
  text-align: center;
}
</style>
