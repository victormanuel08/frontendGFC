<template>
  <div class="page-container">
    <div v-for="(group, index) in groupedCards" :key="index" class="field-group">
      <div class="field-lines">
        <div class="center-circle"></div>
        <div class="goal-box top"></div>
        <div class="goal-box bottom"></div>
        <div class="goal-box left"></div>
        <div class="goal-box right"></div>
      </div>

      <div class="container">
        <div class="card" v-for="card in group" :key="index">
          <img :src="'api' + card.image" class="image" v-if="card.image" />
          <div class="card-content">
            <div class="card-title">{{ card.name }}</div>
            <div class="card-description">{{ card.description }}</div>
            <div class="card-date">{{ card.date }}</div>
            <button :disabled="!loggedIn || currentDate > new Date(card.date)" @click="inscribir(index)">
              {{ (!loggedIn || currentDate > new Date(card.date)) ? 'No Disponible' : 'Inscribir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="sponsors-container left">
      <div class="sponsor-oval" v-for="sponsor in sponsors" :key="sponsor.id">
        <img :src="'api' + sponsor.image" class="round-image" v-if="sponsor.image" />
      </div>
    </div>
    <div class="sponsors-container right">
      <div class="sponsor-circle-static" v-for="sponsor in visibleSponsors" :key="sponsor.id">
        <img :src="'api' + sponsor.image" class="round-image" v-if="sponsor.image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const options = ref<any[]>([]);
const sponsors = ref<any[]>([]);
const visibleSponsors = ref<any[]>([]);
const query = ref("");

type card = {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
};

const championsShip = ref<any>({});

const retrieveFromApi = async () => {
  const response = await fetch('api/public/menu');
  const data = await response.json();

  options.value = data.championship; // Obtener los campeonatos
  cards.value = options.value.map((option: card, index: number) => ({
    id: index, // Usar el índice como ID si no hay un ID en los datos
    name: option.name,
    description: option.description,
    image: option.image || 'default_image.jpg',
    date: option.date
  }));

  sponsors.value = data.sponsors;
  ovals.value = sponsors.value.map((sponsor: any) => ({
    id: sponsor.id,
    name: sponsor.name,
    image: sponsor.image || 'default_image.jpg',
    link: sponsor.link,
  }));

  // Inicializar la lista de patrocinadores visibles
  updateVisibleSponsors();
  startSponsorRotation();
};

onMounted(() => {
  retrieveFromApi();
});

const cards = ref<card[]>([]);
const ovals = ref<any[]>([]);
const loggedIn = ref(true);
const currentDate = new Date();

const inscribir = (id: number) => {
  console.log(`Inscribirse al campeonato con id ${id}`);
};

const groupedCards = computed(() => {
  const groups = [];
  const groupSize = window.innerWidth <= 600 ? 1 : 2; // Cambia el tamaño del grupo según el ancho de la pantalla
  for (let i = 0; i < cards.value.length; i += groupSize) {
    groups.push(cards.value.slice(i, i + groupSize));
  }
  return groups;
});

const updateVisibleSponsors = () => {
  visibleSponsors.value = [];
  let selectedIndexes = new Set();
  while (selectedIndexes.size < 4) {
    let randomIndex = Math.floor(Math.random() * sponsors.value.length);
    if (!selectedIndexes.has(randomIndex)) {
      selectedIndexes.add(randomIndex);
      visibleSponsors.value.push(sponsors.value[randomIndex]);
    }
  }
};

const startSponsorRotation = () => {
  setInterval(() => {
    updateVisibleSponsors();
  }, 3000); // Cambia cada 3 segundos
};
</script>

<style scoped>
.page-container {
  font-family: Arial, sans-serif;
  background-color: #28a745;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.field-group {
  position: relative;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 40px;
  background-color: #28a745;
  overflow: hidden;
  border: 2px solid white;
  border-radius: 10px;
  animation: moveGrass 10s linear infinite;
}

@keyframes moveGrass {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 40px 40px, 40px 40px;
  }
}

.field-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;  
  z-index: 1;
}

.field-lines::before {
  content: '';
  position: absolute;
  width: 3px;
  height: 100%;
  left: 50%;
  background-color: white;
  transform: translateX(-50%);
}

.field-lines::after {
  content: '';
  position: absolute;
  height: 3px;
  width: 100%;
  top: 50%;
  background-color: white;
  transform: translateY(-50%);
  display: none; /* Oculta la línea horizontal en pantallas grandes */
}

.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 3px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.goal-box {
  position: absolute;
  border: 3px solid white;
}

.goal-box.top {
  width: 100px;
  height: 50px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: none;
}

.goal-box.bottom {
  width: 100px;
  height: 50px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: none;
}

.goal-box.left {
  width: 50px;
  height: 100px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.goal-box.right {
  width: 50px;
  height: 100px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Justificar las cartas centradas */
  gap: 175px; /* Añadir un poco de espacio de separación entre cartas */
  z-index: 2;
  padding: 20px;
}

.card {
  background-color: white;
  width: 30%; /* Ajustar el ancho para tener 3 cartas por fila */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.2s;
  z-index: 10; /* Asegurar que las cartas estén por encima */
  position: relative; /* Necesario para que z-index funcione */
}

.card:hover {
  transform: scale(1.05);
}

.card img.image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card img.round-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 1.3em;
  margin: 0 0 10px;
}

.card-description {
  font-size: 1em;
  margin: 0 0 10px;
  color: #555;
}

.card-date {
  font-size: 0.9em;
  margin: 0 0 15px;
  color: #777;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.sponsors-container {
  position: absolute;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sponsors-container.left {
  left: 0;
  top: 0;
  bottom: 0;
}

.sponsors-container.right {
  right: 4%; /* Ajustar este valor para pantallas grandes */
  top: 0;
  bottom: 0;
}

.sponsor-oval {
  width: 60px;
  height: 60px;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 50%;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.sponsor-oval img.round-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
}

.sponsor-oval:hover {
  transform: scale(1.1);
}

.sponsor-circle-static {
  width: 100px; /* Ajustar el tamaño según sea necesario */
  height: 100px; /* Ajustar el tamaño según sea necesario */
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 50%;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  animation: fadeInOut 3s infinite;
}

.sponsor-circle-static img.round-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
}

.sponsor-circle-static:hover {
  transform: scale(1.1);
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* Estilos para pantallas medianas */
@media (max-width: 900px) {
  .card {
    width: 40%; /* Ajustar el ancho para pantallas medianas */
  }
}

/* Estilos para pantallas pequeñas */
@media (max-width: 600px) {
  .card {
    width: 80%; /* Ajustar el ancho para pantallas pequeñas */
  }

  .card-description {
    display: none; /* Ocultar la descripción en pantallas pequeñas */
  }

  .goal-box.top,
  .goal-box.bottom {
    display: block; /* Mostrar porterías superior e inferior */
  }

  .goal-box.left,
  .goal-box.right {
    display: none; /* Ocultar porterías izquierda y derecha */
  }

  .field-lines::before {
    display: none; /* Ocultar línea vertical */
  }

  .field-lines::after {
    display: block; /* Mostrar línea horizontal */
  }

  .sponsors-container.right {
    right: 2.5%; /* Ajustar el valor para pantallas pequeñas */
  }

  .sponsor-circle-static {
    width: 50px; /* Ajustar el tamaño según sea necesario */
    height: 50px; /* Ajustar el tamaño según sea necesario */
  }
}
</style>