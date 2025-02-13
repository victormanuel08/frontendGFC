<template>
    <div class="page-container">
      <h1 class="main-title">NUESTRA ORGANIZACIÓN</h1>
      <div class="card">
        <div class="card-content">
          <img :src="'api' + data.imagevision || 'default_image.jpg'" class="card-image" alt="Imagen Visión" />
          <h2 class="card-title">{{ data.visiontitle }}</h2>
          <p class="card-description">{{ data.visiondescription }}</p>
        </div>
      </div>
      <div class="card odd align-right">
        <div class="card-content">
          <img :src="'api' + data.imagemision || 'default_image.jpg'" class="card-image" alt="Imagen Misión" />
          <h2 class="card-title">{{ data.missiontitle }}</h2>
          <p class="card-description">{{ data.missiondescription }}</p>
        </div>
      </div>
      <div class="card-row">
        <div v-for="(image, index) in randomImages" :key="index" class="card small">
          <div class="image-only-card-content">
            <img :src="'api' + image" class="card-image-small" alt="Imagen Carrusel" />
            <h2 class="card-title">Imagen</h2>
          </div>
        </div>
      </div>
    </div>
  </template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const data = ref<any>({});
const imagePool = ref<string[]>([]);
const randomImages = ref<string[]>([]);

const retrieveDataFromApi = async () => {
  try {
    const response = await fetch('api/public/menu');
    const result = await response.json();
    data.value = result.page;
    imagePool.value = [result.page.imagecar1, result.page.imagecar2, result.page.imagecar3, result.page.imagecar4, result.page.imagecar5, result.page.imagecar6];
    updateRandomImages();
    startImageRotation();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const updateRandomImages = () => {
  randomImages.value = [];
  const usedIndexes = new Set();
  while (usedIndexes.size < 3) {
    const randomIndex = Math.floor(Math.random() * imagePool.value.length);
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      randomImages.value.push(imagePool.value[randomIndex]);
    }
  }
};

const startImageRotation = () => {
  setInterval(updateRandomImages, 4000);
};

onMounted(() => {
  retrieveDataFromApi();
});
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Evitar el scroll horizontal */
}

.page-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-image: url('/static/images/estadio.jpeg'); /* Imagen de fondo para toda la página */
  background-size: cover; /* Ajustar el tamaño de la imagen de fondo */
  background-position: center; /* Centrar la imagen de fondo */
  background-repeat: no-repeat; /* Evitar que la imagen se repita */
  filter: brightness(1.0); /* Atenuar la imagen de fondo */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box; /* Incluir padding y border en el ancho y alto total */
}

.main-title {
  font-size: 3em; /* Tamaño grande para el título */
  color: rgb(2, 14, 144); /* Color del texto */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Sombra del texto */
  margin-bottom: 20px;
}

.card {
  background: linear-gradient(135deg, rgb(2, 14, 144), rgb(255, 0, 0)); /* Gradiente de azul a rojo en diagonal */
  color: white; /* Letras blancas */
  width: 75%; /* Ancho fijo para las tarjetas grandes */
  max-width: 900px;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: background 0.5s ease; /* Transición suave para el fondo */
  min-height: 200px; /* Altura mínima para las tarjetas */
}

.card:first-of-type {
  align-self: flex-start; /* Alinear la primera tarjeta a la izquierda */
}

.card:nth-of-type(2) {
  align-self: flex-end; /* Alinear la segunda tarjeta a la derecha */
}

.card-row {
  display: flex;
  justify-content: space-between; /* Espacio entre las tarjetas */
  width: 100%;
  margin-top: 20px;
}

.card.small {
  width: calc(33.33% - 10px); /* Tamaño fijo para las tarjetas pequeñas */
  margin: 10px;
}

.card:hover {
  transform: scale(1.02);
}

.card-content {
  padding: 20px;
  background-color: rgba(2, 14, 144, 0.8); /* Fondo azul semitransparente para el contenido */
  border-radius: 10px;
  flex: 1; /* Hacer que el contenido ocupe el espacio disponible */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-image {
  width: 200px; /* Ancho fijo para las imágenes */
  height: auto;
  border-radius: 10px 10px 0 0;
  margin-bottom: 20px; /* Añadir margen inferior a la imagen */
}

.card-image-small {
  width: 100%;
  height: 150px; /* Tamaño fijo para las imágenes pequeñas */
  object-fit: cover; /* Asegurar que las imágenes mantengan la proporción */
  border-radius: 10px 10px 0 0;
}

.image-only-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card-title {
  font-size: 1.8em;
  margin: 10px 0;
  color: white; /* Color de las letras en blanco */
}

.card-description {
  font-size: 1em;
  margin: 5px 0;
  color: white; /* Color de las letras en blanco */
}
</style>