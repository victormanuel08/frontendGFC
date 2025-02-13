<template>
  <div class=" bg-gray-100 flex flex-col items-center justify-center">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800">Bienvenido a Gamero FC</h1>
      <p class="text-lg text-gray-600 mt-2">Tu plataforma de gestión simplificada</p>
    </header>

    <main class="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-6">
      <!-- Menú Principal -->
      <div :class="['grid gap-6 w-full', { 'grid-cols-1': selectedCard !== null, 'sm:grid-cols-2 lg:grid-cols-4': selectedCard === null }]">
        <!-- Mapeo de los items del menú con submenús si están presentes -->
        <div
          v-for="(tarjeta, index) in tarjetasConEstilos"
          :key="index"
          :class="['p-4', tarjeta.bgClass, 'rounded-lg', 'shadow', 'hover:bg-opacity-80', 'transition', { 'w-full': selectedCard !== null }]"
          @click="selectCard(index)"
          v-show="selectedCard === null || selectedCard === index"
        >
          <h3 class="text-xl font-medium" :class="tarjeta.textColorClass">{{ tarjeta.titulo }}</h3>
          <p class="text-gray-600 mt-2">{{ tarjeta.description }}</p>

          <!-- Submenú de cada tarjeta si existe -->
          <div v-if="selectedCard === index && tarjeta.childs.length > 0" class="mt-4">
            <div
              v-for="(subMenu, subIndex) in tarjeta.childs"
              :key="subIndex"
              class="p-4 bg-gray-100 rounded-lg shadow hover:bg-opacity-80 transition mb-4"
            >
              <!-- Usamos NuxtLink en lugar de <a> para evitar la recarga completa de la página -->
              <NuxtLink :to="subMenu.path" class="text-lg font-medium text-gray-800 block">
                {{ subMenu.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const selectedCard = ref(null);

// Estado para almacenar los items del menú
const menuItems = ref([]);

// Función para cargar el menú desde el backend
const getMenuItems = async () => {
  try {
    const response = await fetch('/api/public/menu');
    const data = await response.json();
    console.log('Menu items:', data.menu_admin[0]);
    return data.menu_admin[0].childs;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// Computed para renderizar las tarjetas con sus estilos
const tarjetasConEstilos = computed(() => {
  const tarjetas = menuItems.value.map((menuItem) => ({
    titulo: menuItem.label,
    description: menuItem.description || 'Sin descripción',
    link: menuItem.path,
    childs: menuItem.childs || [],
  }));

  const estilos = [
    { bgClass: 'bg-blue-100 hover:bg-blue-200', textColorClass: 'text-blue-800' },
    { bgClass: 'bg-green-100 hover:bg-green-200', textColorClass: 'text-green-800' },
    { bgClass: 'bg-yellow-100 hover:bg-yellow-200', textColorClass: 'text-yellow-800' },
    { bgClass: 'bg-red-100 hover:bg-red-200', textColorClass: 'text-red-800' },
  ];

  return tarjetas.map((tarjeta, index) => {
    const estilo = estilos[index % estilos.length];
    return {
      ...tarjeta,
      ...estilo,
    };
  });
});

// Lógica para seleccionar las tarjetas
const selectCard = (index) => {
  selectedCard.value = selectedCard.value === index ? null : index;
};

// Cargar los items del menú cuando el componente se monta
onMounted(async () => {
  menuItems.value = await getMenuItems();
});
</script>

<style scoped>
</style>
