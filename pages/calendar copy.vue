<template>
  <ModalThird v-if="showThirdModal" @close="showThirdModal = false" />

  <div class="calendar-app">
    <!-- Barra superior -->
    <div class="app-header">
      <div class="header-title">
        <h1>Calendario</h1>
        <p class="current-date">{{ currentDate }}</p>
      </div>

      <div class="header-actions">
        <button @click="goToToday" class="action-btn today-btn">
          <span>Hoy</span>
        </button>

        <div class="view-switcher">
          <button v-for="view in views" :key="view.value" @click="switchView(view.value)"
            :class="{ active: calendarView === view.value }">
            {{ view.label }}
          </button>
        </div>

        <button @click="toggleFilters" class="action-btn filter-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          <span>Filtros</span>
        </button>
      </div>
    </div>

    <!-- Panel de navegación y filtros -->
    <div class="navigation-panel" :class="{ 'filters-open': showFilters }">
      <div class="navigation-controls">
        <button @click="goToPrev" class="nav-btn prev-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <h2 class="current-period">{{ currentPeriod }}</h2>

        <button @click="goToNext" class="nav-btn next-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="filters-container" v-if="showFilters">
        <div class="filter-group">
          <label>Buscar</label>
          <div class="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input v-model="searchQuery" placeholder="Buscar eventos..." />
          </div>
        </div>

        <div class="filter-group">
          <label>Tipo de evento</label>
          <select v-model="selectedType">
            <option value="">Todos los tipos</option>
            <option>Reunión</option>
            <option>Entrega</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Persona</label>
          <select v-model="selectedPerson">
            <option value="">Todas las personas</option>
            <option>Juan Pérez</option>
            <option>María López</option>
          </select>
        </div>

        <div class="filter-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showWeekends" />
            <span>Mostrar fines de semana</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Contenido principal del calendario -->
    <div class="calendar-main">
      <!-- Sidebar (solo en pantallas grandes) -->
      <div class="calendar-sidebar" v-if="!isSmallScreen">
        <div class="sidebar-header">
          <h3>Acciones rápidas</h3>
        </div>

        <div class="sidebar-actions">
          <button @click="handleAddEvent" class="sidebar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <line x1="10" y1="14" x2="14" y2="14"></line>
              <line x1="12" y1="12" x2="12" y2="16"></line>
            </svg>
            <span>Nuevo evento</span>
          </button>

          <button @click="openThirdModal" class="sidebar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Agregar tercero</span>
          </button>
        </div>

        <div class="sidebar-events">
          <h3>Próximos eventos</h3>
          <div class="event-list">
            <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
              <div class="event-dot" :style="{ backgroundColor: getEventColor(event) }"></div>
              <div class="event-info">
                <div class="event-time">{{ formatEventTime(event) }}</div>
                <div class="event-title">{{ event.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendario principal -->
      <div class="calendar-view">
        <FullCalendar ref="calendar" :options="calendarOptions" class="custom-calendar" />
      </div>
    </div>

    <!-- Floating action button para móviles -->
    <button v-if="isSmallScreen" @click="toggleMobileMenu" class="fab">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- Menú móvil -->
    <div v-if="showMobileMenu && isSmallScreen" class="mobile-menu">
      <button @click="handleAddEvent" class="mobile-menu-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <line x1="10" y1="14" x2="14" y2="14"></line>
          <line x1="12" y1="12" x2="12" y2="16"></line>
        </svg>
        <span>Nuevo evento</span>
      </button>

      <button @click="openThirdModal" class="mobile-menu-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Agregar tercero</span>
      </button>

      <button @click="toggleFilters" class="mobile-menu-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        <span>Filtros</span>
      </button>
    </div>
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
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const calendar = ref(null);
const showFilters = ref(false);
const showMobileMenu = ref(false);
const events = ref([
  { id: '1', title: 'Reunión con contador', start: '2025-02-27', extendedProps: { type: 'Reunión', person: 'Juan Pérez' } },
  { id: '2', title: 'Entrega de documentos', start: '2025-02-28', extendedProps: { type: 'Entrega', person: 'María López' } }
]);

// Filtros
const searchQuery = ref('');
const selectedType = ref('');
const selectedPerson = ref('');
const showWeekends = ref(true);

// Vistas
const views = ref([
  { value: 'dayGridMonth', label: 'Mes' },
  { value: 'timeGridWeek', label: 'Semana' },
  { value: 'timeGridDay', label: 'Día' },
  { value: 'listWeek', label: 'Lista' }
]);
const calendarView = ref('dayGridMonth');

// Estado responsive
const isSmallScreen = ref(window.innerWidth < 768);

// Modal
const showThirdModal = ref(false);

// Computed
const filteredEvents = computed(() => {
  return events.value.filter(event => (
    (!selectedType.value || event.extendedProps.type === selectedType.value) &&
    (!selectedPerson.value || event.extendedProps.person === selectedPerson.value) &&
    (!searchQuery.value || event.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  ));
});

const upcomingEvents = computed(() => {
  const today = new Date();
  return [...filteredEvents.value]
    .filter(event => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
});

const currentDate = computed(() => {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: es });
});

const currentPeriod = ref('');

// Opciones del calendario
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin],
  initialView: calendarView.value,
  locale: 'es',
  weekends: showWeekends.value,
  events: filteredEvents.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  headerToolbar: false,
  eventClick: openEventModal,
  eventClassNames: (arg) => {
    const type = arg.event.extendedProps.type;
    return [`event-type-${type?.toLowerCase()}`];
  },
  //datesSet: fixTitleCapitalization
  datesSet: onDatesSet
}));

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
  if (showMobileMenu.value) showMobileMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const switchView = (view) => {
  calendarView.value = view;
  if (calendar.value) {
    calendar.value.getApi().changeView(view);
  }
};

const goToPrev = () => { calendar.value.getApi().prev(); };
const goToToday = () => { calendar.value.getApi().today(); };
const goToNext = () => { calendar.value.getApi().next(); };

const openEventModal = (info) => {
  // Implementar lógica para abrir modal de evento
  console.log('Event clicked:', info.event);
};

const handleAddEvent = () => {
  // Implementar lógica para añadir evento
  console.log('Add new event');
};

const openThirdModal = () => {
  showThirdModal.value = true;
};

const formatEventTime = (event) => {
  const date = parseISO(event.start);
  return format(date, 'HH:mm');
};

const getEventColor = (event) => {
  const type = event.extendedProps.type;
  return type === 'Reunión' ? '#4f46e5' : '#10b981';
};

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}


// Event listeners
onMounted(() => {
  window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
  const calendarApi = calendar.value.getApi();
  const view = calendarApi.view;
  onDatesSet({ start: view.currentStart, end: view.currentEnd, view });
});

function onDatesSet(info) {
  const start = new Date(info.start);
  const end = new Date(info.end);
  const view = info.view.type;

  if (view === 'dayGridMonth') {
    const monthYear = start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    currentPeriod.value = capitalize(monthYear);
  } else if (view === 'timeGridWeek') {
    const startStr = start.toLocaleDateString('es-ES');
    const endStr = end.toLocaleDateString('es-ES');
    currentPeriod.value = `Semana del ${capitalize(startStr)} al ${capitalize(endStr)}`;
  } else if (view === 'timeGridDay') {
    const dayStr = start.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    currentPeriod.value = capitalize(dayStr);
  }

}

</script>

<style scoped>
.calendar-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.current-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.today-btn {
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.today-btn:hover {
  background-color: #e5e7eb;
}

.filter-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.filter-btn:hover {
  background-color: #4338ca;
}

.view-switcher {
  display: flex;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f3f4f6;
}

.view-switcher button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.view-switcher button.active {
  background-color: white;
  color: #4f46e5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.navigation-panel {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.navigation-panel.filters-open {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
}

.current-period {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background-color: #e5e7eb;
}

.filters-container {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input svg {
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
}

.search-input input {
  padding-left: 2rem;
  width: 100%;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input {
  width: 1rem;
  height: 1rem;
}

.calendar-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.calendar-sidebar {
  width: 280px;
  border-right: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.sidebar-actions {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  color: #111827;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.sidebar-btn:hover {
  background-color: #e5e7eb;
}

.sidebar-btn svg {
  flex-shrink: 0;
}

.sidebar-events {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.sidebar-events h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.event-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
}

.event-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.event-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.calendar-view {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}

.custom-calendar {
  height: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* FAB para móviles */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  z-index: 50;
}

.mobile-menu {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 40;
  overflow: hidden;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  border: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mobile-menu-item:hover {
  background-color: #f3f4f6;
}

/* Estilos para el calendario */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.fc-col-header-cell-cushion) {
  color: #374151;
  font-weight: 500;
  text-transform: capitalize;
}

:deep(.fc-daygrid-day-number) {
  color: #111827;
}

:deep(.fc-daygrid-event) {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

:deep(.event-type-reunión) {
  background-color: #e0e7ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}

:deep(.event-type-entrega) {
  background-color: #d1fae5;
  border-color: #a7f3d0;
  color: #10b981;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .calendar-main {
    flex-direction: column;
  }

  .calendar-sidebar {
    display: none;
  }

  .calendar-view {
    padding: 0.5rem;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }
}
</style>