<template>
    <ModalThird 
      v-if="showThirdModal"
      @close="showThirdModal = false"
    />
  <div class="calendar-container relative">
  
    <!-- 🔹 Contenedor de Acciones -->
    <div v-if="showActions || isSmallScreen" class="filter-panel">
      <button @click="toggleActions" class="close-btn mb-2">✖</button>
      <button @click="openThirdModal" class="px-3 py-1 border rounded">➕ Agregar Tercero</button>
      
      <button @click="handleAddEvent" class="px-3 py-1 border rounded">📅 Agregar evento</button>
      <!--
      <button @click="handleEditEvent" class="px-3 py-1 border rounded">✏️ Editar evento</button>
      <button @click="handleDeleteEvent" class="px-3 py-1 border rounded">🗑️ Eliminar evento</button>
      -->
    </div>

    <!-- 🔹 Contenedor de filtros -->
    <div v-if="showFilters || isSmallScreen" class="filter-panel">
  
  <button @click="toggleFilters" class="close-btn">✖</button>
  <!-- Fila de búsqueda -->
  <div class="flex items-center gap-2 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input v-model="searchQuery" placeholder="Buscar evento..." class="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300" />
  </div>

  <!-- Fila de tipo -->
  <div class="flex items-center gap-2 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
    <select v-model="selectedType" class="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300">
      <option value="">Todos los tipos</option>
      <option>Reunión</option>
      <option>Entrega</option>
    </select>
  </div>

  <!-- Fila de persona -->
  <div class="flex items-center gap-2 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    <select v-model="selectedPerson" class="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300">
      <option value="">Todas las personas</option>
      <option>Juan Pérez</option>
      <option>María López</option>
    </select>
  </div>

  <!-- Fila de checkbox -->
  <label class="flex items-center gap-2 w-full">
    <input type="checkbox" v-model="showWeekends" class="w-4 h-4 text-gray-500 rounded focus:ring-gray-300 shrink-0" />
    <span class="text-gray-700">Mostrar fines de semana</span>
  </label>

  <!-- Fila de vista -->
  <div class="flex items-center gap-2 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
    <select v-model="calendarView" @change="updateView" class="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300">
      <option value="dayGridMonth">Mes</option>
      <option value="timeGridWeek">Semana</option>
      <option value="timeGridDay">Día</option>
      <option value="listWeek">Lista</option>
    </select>
  </div>

  <!-- Botones de navegación -->
  <div class="flex gap-2 mt-2 justify-center w-full">
    <button @click="goToPrev" class="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1 flex-1 justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>
    
    <button @click="goToToday" class="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1 flex-1 justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Hoy
    </button>
    
    <button @click="goToNext" class="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1 flex-1 justify-center">
      Siguiente
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

    <!-- 🔹 FullCalendar con íconos en los botones -->
    <FullCalendar
      ref="calendar"
      :options="{
     
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin],
          initialView: calendarView,
          titleFormat: { year: 'numeric', month: 'long' },
          locale: 'es',
          weekends: showWeekends,
          events: filteredEvents,
          editable: true,
          selectable: true,
          eventClick: openEventModal,
        customButtons: {
          filterButton: {
            text: '☰ Filtros',
            click: toggleFilters
          },
          menuActions: {
            text: '⚙ Acciones', 
            click: toggleActions
          }
        },
        headerToolbar: isSmallScreen
          ? { left: 'filterButton menuActions', center:'title', right: '' }
          : { left: 'filterButton menuActions', center: 'title', right: 'today prev,next' }
      }"
      class="shadow-lg rounded-lg border p-4"
    />
  </div>
</template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import listPlugin from '@fullcalendar/list';
  import multiMonthPlugin from '@fullcalendar/multimonth';
  
  const calendar = ref(null);
  const showFilters = ref(false);
  const showActions = ref(false);
  const toggleFilters = () => { showFilters.value = !showFilters.value; };
  const toggleActions = () => { showActions.value = !showActions.value; };
  const events = ref([
    { id: '1', title: 'Reunión con contador', start: '2025-02-27', extendedProps: { type: 'Reunión', person: 'Juan Pérez' }},
    { id: '2', title: 'Entrega de documentos', start: '2025-02-28', extendedProps: { type: 'Entrega', person: 'María López' }}
  ]);
  
  const searchQuery = ref('');
  const selectedType = ref('');
  const selectedPerson = ref('');
  const showWeekends = ref(true);
  const calendarView = ref('dayGridMonth');
  const filteredEvents = computed(() => {
    return events.value.filter(event => (
      (!selectedType.value || event.extendedProps.type === selectedType.value) &&
      (!selectedPerson.value || event.extendedProps.person === selectedPerson.value) &&
      (!searchQuery.value || event.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    ));
  });
  
  const updateView = () => {
    if (calendar.value) {
      calendar.value.getApi().changeView(calendarView.value);
    }
  };
  
  const goToPrev = () => { calendar.value.getApi().prev(); };
  const goToToday = () => { calendar.value.getApi().today(); };
  const goToNext = () => { calendar.value.getApi().next(); };
  
  const isSmallScreen = ref(window.innerWidth < 768);
  onMounted(() => {
    window.addEventListener('resize', () => {
      isSmallScreen.value = window.innerWidth < 768;
    });
  });
  
  const showModal = ref(false);
  const selectedEvent = ref(null);
  const openEventModal = (info) => {
    selectedEvent.value = info.event;
    showModal.value = true;
  };

  const fixTitleCapitalization = () => {
  setTimeout(() => {
    const titleElement = document.querySelector('.fc-toolbar-title');
    if (titleElement) {
      titleElement.textContent = titleElement.textContent.replace(/\b\w/, c => c.toUpperCase());
    }
  }, 10);
};

  const showThirdModal = ref(false);
  const openThirdModal = () => {
    showThirdModal.value = true;
  };
  </script>
  
  <style scoped>
  .calendar-container {
    position: relative;
    max-width: 1200px;
    margin: auto;
  }
  
  .filter-panel {
    position: absolute;
    top: 50px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  }
  
  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .flex.gap-2 {
    display: flex;
    justify-content: center;
  }
  </style>
  