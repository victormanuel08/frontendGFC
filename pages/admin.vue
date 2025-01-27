<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Bienvenido a Gamero FC</h1>
        <p class="text-lg text-gray-600 mt-2">Tu plataforma de gestión simplificada</p>
      </header>
  
      <main class="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 w-4/4 lg:w-4/4">
          <div
            v-for="(tarjeta, index) in tarjetasConEstilos"
            :key="index"
            v-show="selectedCard === null || selectedCard === index"
            :class="['p-4', tarjeta.bgClass, 'rounded-lg', 'shadow', 'hover:bg-opacity-80', 'transition']"
            @click="selectCard(index)"
          >
            <h3 class="text-xl font-medium" :class="tarjeta.textColorClass">{{ tarjeta.titulo }}</h3>
            <p class="text-gray-600 mt-2">{{ tarjeta.descripcion }}</p>
          </div>
        </div>
  
        <div 
          v-if="selectedCard !== null" 
          class="lg:w-3/4 p-4 bg-gray-200 rounded-lg shadow mt-6 lg:mt-0"
        >
          <h4 class="text-2xl font-medium mb-4">Submenú para: {{ tarjetasConEstilos[selectedCard].titulo }}</h4>
          <p>Contenido dinámico para el submenú de la tarjeta seleccionada...</p>
          <button @click="selectCard(null)" class="mt-4 p-2 bg-red-500 text-white rounded-lg">Cerrar Submenú</button>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  
  const tarjetas = [
    {
      titulo: 'Gestión de Usuarios',
      descripcion: 'Administra roles, permisos y más.',
    },
    {
      titulo: 'Reportes',
      descripcion: 'Genera informes detallados en un clic.',
    },
    {
      titulo: 'Pagos',
      descripcion: 'Gestiona y procesa pagos fácilmente.',
    },
    {
      titulo: 'Entrenamientos',
      descripcion: 'Organiza y planifica entrenamientos.',
    },
  ];
  
  const estilos = [
    { bgClass: 'bg-blue-100 hover:bg-blue-200', textColorClass: 'text-blue-800' },
    { bgClass: 'bg-green-100 hover:bg-green-200', textColorClass: 'text-green-800' },
    { bgClass: 'bg-yellow-100 hover:bg-yellow-200', textColorClass: 'text-yellow-800' },
    { bgClass: 'bg-red-100 hover:bg-red-200', textColorClass: 'text-red-800' },
  ];
  
  const getMenuItems = async () => {
    try {
      const response = await fetch('api/public/menu');
      const data = await response.json();
  
      console.log(data);
      return data.menu;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };
  
  const tarjetasConEstilos = computed(() => {
    return tarjetas.map((tarjeta, index) => {
      const estilo = estilos[index % estilos.length];
      return {
        ...tarjeta,
        ...estilo,
      };
    });
  });
  
  const selectedCard = ref(null);
  
  const selectCard = (index) => {
    selectedCard.value = selectedCard.value === index ? null : index;
  };
  
  const menuItems = ref([]);
  
  onMounted(async () => {
    menuItems.value = await getMenuItems();
  });
  </script>
  
  <style scoped>
  </style>
  