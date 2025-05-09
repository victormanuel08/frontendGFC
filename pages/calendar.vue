<template>
  <div class="rounded-3xl bg-white mb-2 mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Calendario" class="mb-2" />

    <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
      <!-- Barra superior -->
      <div class="app-header">
        <div class="header-title">
          <h1 class="text-xl font-bold text-gray-800">Calendario</h1>
          <p class="current-date text-sm text-gray-500">{{ capitalize(currentDate) }}</p>
        </div>

        <div class="header-actions">
          <UButton @click="goToToday" variant="soft" color="gray" icon="i-heroicons-calendar-days">
            Hoy
          </UButton>

          <div class="view-switcher">
            <UButton v-for="view in views" :key="view.value" @click="switchView(view.value)"
              :variant="calendarView === view.value ? 'solid' : 'ghost'"
              :color="calendarView === view.value ? 'blue' : 'gray'" size="sm">
              {{ view.label }}
            </UButton>
          </div>

          <UButton @click="toggleFilters" variant="soft" color="blue" icon="i-heroicons-funnel">
            Filtros
          </UButton>
        </div>
      </div>

      <!-- Panel de navegación y filtros -->
      <div class="navigation-panel" :class="{ 'filters-open': showFilters }">
        <div class="navigation-controls">
          <UButton @click="goToPrev" variant="ghost" color="gray" icon="i-heroicons-chevron-left" size="sm" />

          <h2 class="current-period text-lg font-semibold text-gray-800">{{ currentPeriod }}</h2>

          <UButton @click="goToNext" variant="ghost" color="gray" icon="i-heroicons-chevron-right" size="sm" />
        </div>

        <div class="filters-container" v-if="showFilters">
          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipos de eventos</label>
            <div class="checkbox-group space-y-2">
              <label class="flex items-center space-x-2">
                <UCheckbox v-model="showExpirationEvents" />
                <span class="text-sm text-gray-600">Eventos de vencimiento</span>
              </label>
              <label class="flex items-center space-x-2">
                <UCheckbox v-model="showReunionEvents" />
                <span class="text-sm text-gray-600">Eventos de reunión</span>
              </label>
            </div>
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <UInput v-model="searchQuery" placeholder="Buscar eventos..." icon="i-heroicons-magnifying-glass" />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de tercero</label>
            <USelect v-model="selectedThirdType" :options="filteredThirdTypes" option-attribute="name"
              value-attribute="id" placeholder="Todos los tipos" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de régimen</label>
            <USelect v-model="selectedRegiment" :options="filteredRegiments" option-attribute="name"
              value-attribute="id" placeholder="Todos los regímenes" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Impuesto</label>
            <USelect v-model="selectedTax" :options="filteredTaxes" option-attribute="name" value-attribute="id"
              placeholder="Todos los impuestos" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Responsabilidad</label>
            <USelect v-model="selectedResponsability" :options="filteredResponsabilities" option-attribute="name"
              value-attribute="id" placeholder="Todas las responsabilidades" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tercero</label>
            <USelect v-model="selectedThird" :options="filteredThirds" option-attribute="razon_social"
              value-attribute="id" placeholder="Todos los terceros" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de reunión</label>
            <USelect v-model="selectedReunionType" :options="scheduledEventsTypes" option-attribute="name"
              value-attribute="id" placeholder="Todos los tipos" clearable />
          </div>

          <div class="filter-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mostrar fines de semana</label>
            <UCheckbox v-model="showWeekends" />
          </div>

          <div class="filter-actions col-span-full">
            <UButton @click="resetFilters" variant="soft" color="gray" icon="i-heroicons-arrow-path" class="w-full">
              Limpiar filtros
            </UButton>
          </div>
        </div>
      </div>

      <!-- Contenido principal del calendario -->
      <div class="calendar-main">
        <!-- Sidebar (solo en pantallas grandes) -->
        <div class="calendar-sidebar" v-if="!isSmallScreen">
          <div class="sidebar-header">
            <h3 class="font-semibold text-gray-800">Acciones rápidas</h3>
          </div>

          <div class="sidebar-actions">
            <UButton @click="openNewEventModal" variant="solid" color="blue" icon="i-heroicons-plus" block>
              Nuevo evento
            </UButton>

            <UButton @click="openThirdModal" variant="outline" color="blue" icon="i-heroicons-user-plus" block>
              Agregar tercero
            </UButton>
            <!-- Cargar Archivo -->
            <UButton @click="openFileModal" variant="outline" color="blue" icon="i-heroicons-arrow-up-tray" block>
              Cargar archivo
            </UButton>
          </div>

          <div class="sidebar-events">
            <h3 class="font-semibold text-gray-800">Próximos eventos</h3>
            <div class="event-list">
              <div v-for="event in upcomingEvents" :key="event.id"
                class="event-item hover:bg-blue-50 rounded-md p-2 cursor-pointer" @click="handleEventClick(event)">
                <div class="flex items-start gap-2">
                  <div class="event-dot w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    :style="{ backgroundColor: getEventColor(event) }"></div>
                  <div class="event-info">
                    <div class="event-time text-xs text-gray-500">{{ formatEventDateTime(event) }}</div>
                    <div v-if="event.extendedProps?.tercero_razon_social" class="event-detail text-xs text-gray-500">
                      {{ event.extendedProps.tercero_razon_social }}
                    </div>
                    <div class="event-title text-sm font-medium text-gray-800">{{ event.titlelong }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendario principal -->
        <div class="calendar-view">
          <FullCalendar ref="calendar" :options="calendarOptions" v-if="isCalendarInitialized"
            class="custom-calendar" />
        </div>
      </div>
    </UCard>

    <!-- Modal para nuevo evento -->
    <ModalEvents v-if="isNewEventModalOpen" :third-types="filteredThirdTypes" :thirds="filteredThirds"
      :event-types="scheduledEventsTypes" @close="isNewEventModalOpen = false" @save="handleNewEvent" />

    <!-- Modal de terceros -->
    <ModalThird v-if="showThirdModal" @close="showThirdModal = false" @saved="fetchCalendarData" />

    
    <ModalFiles 
    v-if="showFileModal" 
    @close="showFileModal = false" 
    :thirdID="selectedThird.id"
    @third-selected="handleThirdSelection"
    @submit="handleFileSubmit"
  />

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';

// Estado del componente
const isCalendarInitialized = ref(false);
const calendar = ref(null);
const showFilters = ref(false);
const showThirdModal = ref(false);
const showFileModal = ref(false);
const isSmallScreen = ref(window.innerWidth < 768);
const isNewEventModalOpen = ref(false);

// Filtros
const searchQuery = ref('');
const showExpirationEvents = ref(true);
const showReunionEvents = ref(true);
const selectedThirdType = ref(null);
const selectedRegiment = ref(null);
const selectedTax = ref(null);
const selectedResponsability = ref(null);
const selectedThird = ref(null);
const selectedReunionType = ref(null);
const showWeekends = ref(true);

// Vistas
const views = ref([
  { value: 'dayGridMonth', label: 'Mes' },
  { value: 'timeGridWeek', label: 'Semana' },
  { value: 'timeGridDay', label: 'Día' },
  { value: 'listWeek', label: 'Lista' }
]);
const calendarView = ref('dayGridMonth');
const currentPeriod = ref('');

// Datos
const calendarData = ref({
  expiration_events: [],
  reunion_events: [],
  third_types: [],
  regiments_types: [],
  tax: [],
  responsabilities: [],
  scheduled_events_types: [],
  thirds: []
});

// Cargar datos iniciales
const fetchCalendarData = async () => {
  try {
    const response = await $fetch('/api/public/calendar/');
    calendarData.value = response;
    initializeCalendar();
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    Swal.fire('Error', 'No se pudieron cargar los datos del calendario', 'error');
  }
};

// Inicializar calendario después de cargar datos
const initializeCalendar = () => {
  isCalendarInitialized.value = true;
  nextTick(() => {
    if (calendar.value?.getApi) {
      updateCurrentPeriod();
    }
  });
};

// Actualizar el período actual mostrado
const updateCurrentPeriod = () => {
  const calendarApi = calendar.value.getApi();
  const view = calendarApi.view;
  handleDatesSet({ view });
};

// Formatear eventos para FullCalendar
const formattedEvents = computed(() => {
  const events = [];

  if (showExpirationEvents.value) {
    calendarData.value.expiration_events.forEach(event => {
      if (event.expiration_datealert) {
        events.push({
          id: `exp-${event.expiration_id}`,
          title: event.tercero_id_number,
          titlelong: event.expiration_description,
          start: event.expiration_datealert,
          allDay: true,
          extendedProps: {
            type: 'Vencimiento',
            tercero_razon_social: event.tercero_razon_social,
            expiration_date: event.expiration_date,
            third_type: event.expiration_third_types_name,
            regiment: event.expiration_regiment_name,
            tax: event.tax_name,
            responsability: event.responsabilidad_name
          }
        });
      }
    });
  }

  if (showReunionEvents.value) {
    calendarData.value.reunion_events.forEach(event => {
      if (event.start_date) {
        events.push({
          id: `reunion-${event.id}`,
          title: event.title,
          start: event.start_date,
          end: event.end_date,
          extendedProps: {
            type: 'Reunión',
            reunion_type: event.type_name,
            description: event.description,
            color: event.color
          }
        });
      }
    });
  }

  return events;
});

// Filtros dependientes
const filteredThirdTypes = computed(() => calendarData.value.third_types);
const filteredRegiments = computed(() => {
  if (!selectedThirdType.value) return calendarData.value.regiments_types;
  const type = calendarData.value.third_types.find(t => t.id == selectedThirdType.value);
  return type ? type.regiments_types : calendarData.value.regiments_types;
});
const filteredTaxes = computed(() => {
  if (!selectedResponsability.value) return calendarData.value.tax;
  const resp = calendarData.value.responsabilities.find(r => r.id == selectedResponsability.value);
  return resp?.tax_id ? calendarData.value.tax.filter(t => t.id == resp.tax_id) : calendarData.value.tax;
});
const filteredResponsabilities = computed(() => calendarData.value.responsabilities);
const filteredThirds = computed(() => calendarData.value.thirds);
const scheduledEventsTypes = computed(() => calendarData.value.scheduled_events_types);

// Próximos eventos
const upcomingEvents = computed(() => {
  const today = new Date();
  return [...formattedEvents.value]
    .filter(event => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
});

// Fecha actual formateada
const currentDate = computed(() => {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: es });
});

// Opciones del calendario
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: calendarView.value,
  locale: esLocale,
  headerToolbar: false,
  weekends: showWeekends.value,
  events: formattedEvents.value,
  nowIndicator: true,
  validRange: {
    start: new Date(new Date().getFullYear() - 1, 0, 1),
    end: new Date(new Date().getFullYear() + 1, 11, 31)
  },
  eventClassNames: (arg) => {
    const type = arg.event.extendedProps.type;
    return [`event-type-${type?.toLowerCase()}`];
  },
  eventContent: (arg) => ({
    html: `
      <div class="fc-event-content p-1">
        <div class="flex items-center">
          <div class="w-2 h-2 rounded-full mr-1" 
               style="background-color: ${getEventColor(arg.event)}"></div>
          <div class="truncate text-xs font-medium">${arg.event.title}</div>
        </div>
      </div>
    `
  }),
  datesSet: handleDatesSet,
  eventClick: handleEventClick
}));

// Manejo de fechas visibles
const handleDatesSet = (info) => {
  try {
    const viewType = info.view.type;
    const startDate = new Date(info.view.currentStart);

    if (viewType === 'dayGridMonth') {
      currentPeriod.value = capitalize(format(startDate, 'MMMM yyyy', { locale: es }));
    } else if (viewType === 'timeGridWeek') {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      currentPeriod.value = `Semana del ${format(startDate, 'd MMMM', { locale: es })} al ${format(endDate, 'd MMMM yyyy', { locale: es })}`;
    } else if (viewType === 'timeGridDay') {
      currentPeriod.value = capitalize(format(startDate, 'EEEE d MMMM yyyy', { locale: es }));
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
};

// Métodos de navegación
const goToPrev = () => {
  if (calendar.value?.getApi) {
    calendar.value.getApi().prev();
  }
};

const goToNext = () => {
  if (calendar.value?.getApi) {
    calendar.value.getApi().next();
  }
};

const goToToday = () => {
  if (calendar.value?.getApi) {
    calendar.value.getApi().today();
    updateCurrentPeriod();
  }
};

// Cambio de vista
const switchView = (view) => {
  calendarView.value = view;
  if (calendar.value?.getApi) {
    calendar.value.getApi().changeView(view);
    updateCurrentPeriod();
  }
};

// Mostrar/ocultar filtros
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// Abrir modales
const openNewEventModal = () => {
  isNewEventModalOpen.value = true;
};

const openThirdModal = () => {
  showThirdModal.value = true;
};

const openFileModal = () => {
  showFileModal.value = true;
};

// Manejo de eventos
const handleNewEvent = async (eventData) => {
  try {
    await $fetch('/api/scheduled-events/', {
      method: 'POST',
      body: eventData
    });
    await fetchCalendarData();
    Swal.fire('Éxito', 'Evento creado correctamente', 'success');
  } catch (error) {
    console.error('Error creating event:', error);
    Swal.fire('Error', 'No se pudo crear el evento', 'error');
  }
};

const handleEventClick = (info) => {
  const event = info.event || info;
  const extendedProps = event.extendedProps;

  Swal.fire({
    title: extendedProps.tercero_razon_social || event.title,
    html: `
      <div class="text-left space-y-2">
        <p><strong>Tipo:</strong> ${extendedProps.type}</p>
        <p><strong>Fecha:</strong> ${formatEventDateTime(event)}</p>
        ${extendedProps.tercero_razon_social ? `<p><strong>Tercero:</strong> ${extendedProps.tercero_razon_social}</p>` : ''}
        ${extendedProps.third_type ? `<p><strong>Tipo de tercero:</strong> ${extendedProps.third_type}</p>` : ''}
        ${extendedProps.regiment ? `<p><strong>Régimen:</strong> ${extendedProps.regiment}</p>` : ''}
        ${extendedProps.tax ? `<p><strong>Impuesto:</strong> ${extendedProps.tax}</p>` : ''}
        ${extendedProps.responsability ? `<p><strong>Responsabilidad:</strong> ${extendedProps.responsability}</p>` : ''}
        ${extendedProps.expiration_date ? `<p><strong>Fecha vencimiento:</strong> ${format(new Date(extendedProps.expiration_date), 'PPP', { locale: es })}</p>` : ''}
        ${extendedProps.description ? `<p><strong>Descripción:</strong> ${extendedProps.description}</p>` : ''}
      </div>
    `,
    confirmButtonText: 'Cerrar',
    customClass: {
      popup: 'rounded-xl'
    }
  });
};

// Formatear fecha del evento
const formatEventDateTime = (event) => {
  try {
    const start = event.start instanceof Date ? event.start : new Date(event.start);
    const end = event.end ? (event.end instanceof Date ? event.end : new Date(event.end)) : null;

    if (isNaN(start.getTime())) return 'Fecha inválida';

    if (event.allDay) {
      return format(start, "EEE d 'de' MMMM yyyy", { locale: es });
    }

    let result = format(start, "EEE d 'de' MMMM yyyy, HH:mm", { locale: es });

    if (end && !isNaN(end.getTime())) {
      if (isSameDay(start, end)) {
        result += ` - ${format(end, "HH:mm")}`;
      } else {
        result += ` - ${format(end, "EEE d 'de' MMMM yyyy, HH:mm", { locale: es })}`;
      }
    }

    return result;
  } catch {
    return 'Fecha inválida';
  }
};

// Obtener color del evento
const getEventColor = (event) => {
  if (event.extendedProps.type === 'Vencimiento') return '#dc2626';
  return event.extendedProps.color || '#2563eb';
};

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = '';
  selectedThirdType.value = null;
  selectedRegiment.value = null;
  selectedTax.value = null;
  selectedResponsability.value = null;
  selectedThird.value = null;
  selectedReunionType.value = null;
};

// Capitalizar texto
const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Inicialización del componente
onMounted(async () => {
  const handleResize = () => {
    isSmallScreen.value = window.innerWidth < 768;
  };

  window.addEventListener('resize', handleResize);
  await fetchCalendarData();

  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<style scoped>
.app-header {
  @apply flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white;
}

.header-title h1 {
  @apply text-xl font-bold text-gray-800;
}

.current-date {
  @apply text-sm text-gray-500;
}

.header-actions {
  @apply flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto;
}

.view-switcher {
  @apply flex rounded-md overflow-hidden border border-gray-200 bg-gray-50;
}

.navigation-panel {
  @apply flex flex-col bg-white border-t border-b border-gray-200;
}

.navigation-controls {
  @apply flex justify-between items-center p-3;
}

.current-period {
  @apply text-lg font-semibold text-gray-800;
}

.filters-container {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 border-t border-gray-200;
}

.calendar-main {
  @apply flex flex-col md:flex-row h-[calc(100vh-180px)];
}

.calendar-sidebar {
  @apply w-full md:w-64 p-4 border-r border-gray-200 bg-white overflow-y-auto;
}

.sidebar-header h3 {
  @apply font-semibold text-gray-800;
}

.sidebar-actions {
  @apply space-y-2 mb-4;
}

.sidebar-events h3 {
  @apply font-semibold text-gray-800 mb-2;
}

.event-list {
  @apply space-y-2;
}

.event-item {
  @apply flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer;
}

.event-dot {
  @apply w-2 h-2 rounded-full mt-2 flex-shrink-0;
}

.event-time {
  @apply text-xs text-gray-500;
}

.event-title {
  @apply text-sm font-medium text-gray-800;
}

.event-detail {
  @apply text-xs text-gray-500;
}

.calendar-view {
  @apply flex-1 p-2 md:p-4 overflow-auto;
}

/* Estilos para FullCalendar */
:deep(.fc) {
  @apply font-sans;
}

:deep(.fc-toolbar-title) {
  @apply text-lg font-semibold text-gray-800;
}

:deep(.fc-col-header-cell-cushion) {
  @apply text-gray-700 font-medium capitalize;
}

:deep(.fc-daygrid-day-number) {
  @apply text-gray-800;
}

:deep(.fc-event) {
  @apply opacity-100 border-0 font-medium shadow-sm transition-all cursor-pointer;
}

:deep(.fc-event:hover) {
  @apply transform -translate-y-px shadow-md;
}

:deep(.fc-event-main) {
  @apply p-1;
}

/* Eventos de reunión - Azul */
:deep(.event-type-reunión) {
  @apply bg-blue-600 border-blue-600 text-white;
}

/* Eventos de vencimiento - Rojo */
:deep(.event-type-vencimiento) {
  @apply bg-red-600 border-red-600 text-white;
}

:deep(.fc-event-title) {
  @apply whitespace-normal line-clamp-2 text-white text-xs;
}

:deep(.fc-event-time) {
  @apply text-white text-opacity-90 text-xs;
}

:deep(.fc-daygrid-event-dot) {
  @apply hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-main {
    @apply flex-col h-auto;
  }

  .calendar-sidebar {
    @apply hidden;
  }

  :deep(.fc-event) {
    @apply text-xs p-0;
  }
}
</style>