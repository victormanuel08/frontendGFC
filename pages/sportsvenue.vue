<template>
    <div class="page-container">
      <h1 class="main-title">NUESTRAS SEDES</h1>
      <div v-for="(location, index) in locations" :key="location.id" class="location-card" :class="index % 2 === 0 ? 'even' : 'odd'">
        <div class="location-content">
          <img :src="'api' + location.image || 'default_image.jpg'" alt="Imagen de la sede" class="location-image" />
          <div class="location-details">
            <h2 class="location-title">{{ location.name }}</h2>
            <p class="location-info"><strong>Título:</strong> {{ location.title }}</p>
            <p class="location-info"><strong>Dirección:</strong> {{ location.address }}</p>
            <p class="location-info"><strong>Descripción:</strong> {{ location.description }}</p>
            <p class="location-info"><strong>Horarios:</strong> {{ location.horarios }}</p>
            <p class="location-info"><strong>Teléfono:</strong> {{ location.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

type Location = {
    id: number;
    name: string;
    address: string;
    description: string;
    phone: string;
    image: string;
    title: string;
    horarios: string;
};

const locations = ref<Location[]>([]);

const retrieveLocationsFromApi = async () => {
    try {
        const response = await fetch('api/public/menu');
        const data = await response.json();
        locations.value = data.locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
};

onMounted(() => {
    retrieveLocationsFromApi();
});
</script>

<style scoped>
.page-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-image: url('/static/images/mapafondo.jpeg'); /* Imagen de fondo para toda la página */
  background-size: cover; /* Ajustar el tamaño de la imagen de fondo */
  background-position: center; /* Centrar la imagen de fondo */
  background-repeat: no-repeat; /* Evitar que la imagen se repita */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.main-title {
  font-size: 3em; /* Tamaño grande para el título */
  color: rgb(2, 14, 144); /* Color del texto */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Sombra del texto */
  margin-bottom: 20px;
}

.location-card {
  background-image: url('/static/images/mapa.jpeg'); /* Imagen de fondo para la tarjeta */
  background-size: cover; /* Ajustar el tamaño de la imagen de fondo */
  background-position: center; /* Centrar la imagen de fondo */
  background-repeat: no-repeat; /* Evitar que la imagen se repita */
  width: 80%;
  max-width: 900px;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: transform 0.3s;
}

.location-card:hover {
  transform: scale(1.02);
}

.location-card.even .location-content {
  flex-direction: row-reverse;
}

.location-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco semitransparente para el contenido */
  border-radius: 10px;
  width: 100%; /* Asegurar que el contenido ocupe todo el ancho */
}

.location-image {
  width: 50%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.location-details {
  width: 50%;
  padding: 15px;
}

.location-title {
  color: rgb(2, 14, 144); /* Color del texto */
  font-size: 1.8em;
  margin-bottom: 10px;
}

.location-info {
  font-size: 1em;
  margin: 5px 0;
  color: #333;
}

/* Estilos para pantallas pequeñas */
@media (max-width: 600px) {
  .location-card {
    flex-direction: column;
  }

  .location-card.even .location-content {
    flex-direction: column;
  }

  .location-image {
    width: 100%;
    margin: 0 0 15px 0;
  }

  .location-details {
    width: 100%;
    padding: 10px;
  }
}
</style>
