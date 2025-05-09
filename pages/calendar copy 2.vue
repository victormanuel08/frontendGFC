<template>
  <ModalThird v-if="showThirdModal" @close="showThirdModal = false" />

  <div class="calendar-app">
    <!-- Barra superior -->
    <div class="app-header">
      <div class="header-title">
        <h1>Calendario</h1>
        <p class="current-date">{{ capitalize(currentDate) }}</p>
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
          <label>Tipos de eventos</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="showExpirationEvents" />
              <span>Eventos de vencimiento</span>
            </label>
            <label>
              <input type="checkbox" v-model="showReunionEvents" />
              <span>Eventos de reunión</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <label>Buscar</label>
          <div class="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input v-model="searchQuery" placeholder="Buscar eventos..." />
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Tipo de tercero</label>
          <div class="select-with-clear">
            <select v-model="selectedThirdType">
              <option value="">Todos los tipos</option>
              <option v-for="type in filteredThirdTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
            <button v-if="selectedThirdType" @click="selectedThirdType = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Régimen</label>
          <div class="select-with-clear">
            <select v-model="selectedRegiment">
              <option value="">Todos los regímenes</option>
              <option v-for="regiment in filteredRegiments" :key="regiment.id" :value="regiment.id">
                {{ regiment.name }}
              </option>
            </select>
            <button v-if="selectedRegiment" @click="selectedRegiment = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Impuesto</label>
          <div class="select-with-clear">
            <select v-model="selectedTax">
              <option value="">Todos los impuestos</option>
              <option v-for="tax in filteredTaxes" :key="tax.id" :value="tax.id">
                {{ tax.name }}
              </option>
            </select>
            <button v-if="selectedTax" @click="selectedTax = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Responsabilidad</label>
          <div class="select-with-clear">
            <select v-model="selectedResponsability">
              <option value="">Todas las responsabilidades</option>
              <option v-for="resp in filteredResponsabilities" :key="resp.id" :value="resp.id">
                {{ resp.name }}
              </option>
            </select>
            <button v-if="selectedResponsability" @click="selectedResponsability = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Tercero</label>
          <div class="select-with-clear">
            <select v-model="selectedThird">
              <option value="">Todos los terceros</option>
              <option v-for="third in filteredThirds" :key="third.id" :value="third.id">
                {{ third.razon_social }} ({{ third.type_name }})
              </option>
            </select>
            <button v-if="selectedThird" @click="selectedThird = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Tipo de reunión</label>
          <div class="select-with-clear">
            <select v-model="selectedReunionType">
              <option value="">Todos los tipos</option>
              <option v-for="type in scheduledEventsTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
            <button v-if="selectedReunionType" @click="selectedReunionType = ''" class="clear-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showWeekends" />
            <span>Mostrar fines de semana</span>
          </label>
        </div>

        <div class="filter-actions">
          <button @click="resetFilters" class="action-btn reset-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Limpiar filtros</span>
          </button>
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
                <div class="event-time">{{ formatEventDateTime(event) }}</div>
                <div v-if="event.extendedProps?.tercero_razon_social" class="event-detail">
                  {{ event.extendedProps.tercero_razon_social }}
                </div>
                <div class="event-title">{{ event.titlelong }}</div>       
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
import Swal from 'sweetalert2';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';


const calendar = ref(null);
const showFilters = ref(false);
const showMobileMenu = ref(false);
const showThirdModal = ref(false);
const isSmallScreen = ref(window.innerWidth < 768);

// Filtros
const searchQuery = ref('');
const showExpirationEvents = ref(true);
const showReunionEvents = ref(true);
const selectedThirdType = ref('');
const selectedRegiment = ref('');
const selectedTax = ref('');
const selectedResponsability = ref('');
const selectedThird = ref('');
const selectedReunionType = ref('');
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

// Datos del endpoint
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

// Obtener datos del endpoint
const fetchCalendarData = async () => {
  try {
    const response = await fetch('api//public/calendar/');
    if (!response.ok) throw new Error('Error al cargar datos');
    calendarData.value = await response.json();
  } catch (error) {
    console.error('Error fetching calendar data:', error);
  }
};

// Eventos formateados para FullCalendar
const formattedEvents = computed(() => {
  const events = [];

  if (showExpirationEvents.value) {
    calendarData.value.expiration_events.forEach(event => {
      if (
        (!selectedThirdType.value || event.expiration_third_types_id == selectedThirdType.value) &&
        (!selectedRegiment.value || event.expiration_regiment_id == selectedRegiment.value) &&
        (!selectedTax.value || event.tax_id == selectedTax.value) &&
        (!selectedResponsability.value || event.responsabilidad_id == selectedResponsability.value) &&
        (!selectedThird.value || event.tercero_id_number == selectedThird.value) &&
        (!searchQuery.value || 
          event.expiration_description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          event.tercero_razon_social?.toLowerCase().includes(searchQuery.value.toLowerCase()))
      ) {
        events.push({
          id: `exp-${event.expiration_id}`,
          title: event.tercero_id_number,
          titlelong: event.expiration_description + ' (' + event.tercero_id_number + ')',
          start: event.expiration_datealert, // Usamos la fecha de alerta
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
      if (
        (!selectedReunionType.value || event.type_id == selectedReunionType.value) &&
        (!selectedThird.value || event.third_id == selectedThird.value) &&
        (!searchQuery.value || 
          event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.value.toLowerCase()))
      ) {
        events.push({
          id: `reunion-${event.id}`,
          title: event.title,
          titlelong: event.title,
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

// Computed
const upcomingEvents = computed(() => {
  const today = new Date();
  return [...formattedEvents.value]
    .filter(event => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
});

const currentDate = computed(() => {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: es });
});

// Opciones del calendario
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin],
  initialView: calendarView.value,
  locale: 'es',
  weekends: showWeekends.value,
  events: formattedEvents.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  headerToolbar: false,
  moreLinkText: 'evento más',
  
  noEventsText: 'No hay eventos',

  eventClick: openEventModal,
  eventClassNames: (arg) => {
    const type = arg.event.extendedProps.type;
    return [`event-type-${type?.toLowerCase()}`];
  },
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
  const event = info.event;
  const extendedProps = event.extendedProps;
  
  let details = `
    <div class="event-modal">
      <h3>${event.title}</h3>
      <p><strong>Tipo:</strong> ${extendedProps.type}</p>
      <p><strong>Fecha:</strong> ${formatEventDateTime(event)}</p>
  `;

  if (extendedProps.type === 'Vencimiento') {
    details += `
      <p><strong>Tercero:</strong> ${extendedProps.tercero_razon_social || 'N/A'}</p>
      <p><strong>Tipo de tercero:</strong> ${extendedProps.third_type || 'N/A'}</p>
      <p><strong>Régimen:</strong> ${extendedProps.regiment || 'N/A'}</p>
      <p><strong>Impuesto:</strong> ${extendedProps.tax || 'N/A'}</p>
      <p><strong>Responsabilidad:</strong> ${extendedProps.responsability || 'N/A'}</p>
      <p><strong>Fecha de vencimiento:</strong> ${extendedProps.expiration_date ? format(new Date(extendedProps.expiration_date), 'PPP', { locale: es }) : 'N/A'}</p>
    `;
  } else if (extendedProps.type === 'Reunión') {
    details += `
      <p><strong>Tipo de reunión:</strong> ${extendedProps.reunion_type || 'N/A'}</p>
      <p><strong>Descripción:</strong> ${extendedProps.description || 'N/A'}</p>
    `;
  }

  details += `</div>`;

  // Usar un modal o alerta para mostrar los detalles
  Swal.fire({
    title: 'Detalles del evento',
    html: details,
    confirmButtonText: 'Cerrar',
    customClass: {
      popup: 'event-details-popup'
    }
  });
};

const handleAddEvent = () => {
  console.log('Add new event');
};

const openThirdModal = () => {
  showThirdModal.value = true;
};

const formatEventTime = (event) => {
  const date = parseISO(event.start);
  return format(date, 'HH:mm');
};

const formatEventDate = (event) => {
  const date = parseISO(event.start);
  return format(date, 'dd/MM/yyyy');
};



const formatEventDateTime = (event) => {
  // Helper para capitalizar
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  // Parsear fechas
  const start = event.start instanceof Date ? event.start : parseISO(event.start);
  const end = event.end ? (event.end instanceof Date ? event.end : parseISO(event.end)) : null;
  const expiration = event.extendedProps?.expiration_date 
    ? (event.extendedProps.expiration_date instanceof Date 
      ? event.extendedProps.expiration_date 
      : parseISO(event.extendedProps.expiration_date))
    : null;

  // Formatear partes de fecha con capitalización
  const formatAndCapitalize = (date, formatStr) => {
    return format(date, formatStr, { locale: es })
      .split(' ')
      .map((part, i) => {
        if (i === 0 || part === 'de' || part === 'del') return capitalize(part);
        return part;
      })
      .join(' ');
  };

  // Caso 1: Evento de todo el día
  if (event.allDay) {
    let result = formatAndCapitalize(start, "EEE d 'de' MMM");
    
    if (end && !isSameDay(start, end)) {
      result += ` al ${formatAndCapitalize(end, "EEE d 'de' MMM")}`;
    } else {
      result += " (Todo el día)";
    }
    
    return result;
  }

  // Caso 2: Evento con hora
  let result = formatAndCapitalize(start, "EEE d 'de' MMM") + ' ' + format(start, "HH:mm");
  
  if (end) {
    if (isSameDay(start, end)) {
      result += ` - ${format(end, "HH:mm")}`;
    } else {
      result += ` al ${formatAndCapitalize(end, "EEE d 'de' MMM")} ${format(end, "HH:mm")}`;
    }
  }

  // Añadir información de vencimiento si existe
  if (expiration && event.extendedProps?.type === 'Vencimiento') {
    result += ` (Vence ${formatAndCapitalize(expiration, "EEE d 'de' MMM")})`;
  }

  return result;
};

const getEventColor = (event) => {
  if (event.extendedProps.type === 'Vencimiento') return '#dc2626'; // Rojo más intenso
  return event.extendedProps.color || '#2563eb'; // Azul más intenso
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedThirdType.value = '';
  selectedRegiment.value = '';
  selectedTax.value = '';
  selectedResponsability.value = '';
  selectedThird.value = '';
  selectedReunionType.value = '';
};

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

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Lifecycle hooks
onMounted(() => {
  const handleResize = () => {
    isSmallScreen.value = window.innerWidth < 768;
    // Ajustar la toolbar del calendario según el tamaño
    if (calendar.value) {
      const calendarApi = calendar.value.getApi();
      if (isSmallScreen.value) {
        calendarApi.setOption('headerToolbar', {
          left: 'title',
          center: '',
          right: 'today prev,next'
        });
      } else {
        calendarApi.setOption('headerToolbar', false);
      }
    }
  };

  // Configurar el event listener para resize
  window.addEventListener('resize', handleResize);
  
  // Cargar datos y configurar calendario
  fetchCalendarData().then(() => {
    if (calendar.value) {
      const calendarApi = calendar.value.getApi();
      const view = calendarApi.view;
      onDatesSet({ start: view.currentStart, end: view.currentEnd, view });
      
      // Configuración inicial basada en el tamaño de pantalla
      handleResize();
    }
  });

  // Limpiar el event listener al desmontar
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
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

.select-with-clear {
  position: relative;
  display: flex;
  align-items: center;
}

.select-with-clear select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  appearance: none;
  -webkit-appearance: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.select-with-clear .clear-filter-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #6b7280;
}

.clear-filter-btn:hover {
  color: #ef4444;
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

.filter-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #e5e7eb;
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
  padding: 8px;
  border-radius: 6px;
  background-color: white;
  transition: all 0.2s;
}

.event-item:hover {
  background-color: #f3f4f6;
}

.event-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  border: 2px solid white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

.event-detail {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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

.event-modal {
  text-align: left;
}

.event-modal h3 {
  margin-top: 0;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.event-modal p {
  margin: 0.5rem 0;
  display: flex;
}

.event-modal strong {
  display: inline-block;
  min-width: 120px;
  color: #4b5563;
}

.swal2-popup.event-details-popup {
  max-width: 600px;
  width: 90%;
}

/* ------------------------- */
/* ESTILOS MEJORADOS PARA EVENTOS */
/* ------------------------- */

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

/* Estilos base para todos los eventos */
:deep(.fc-event) {
  opacity: 1 !important;
  border: none !important;
  font-weight: 500 !important;
  filter: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

:deep(.fc-event-main) {
  padding: 2px 4px !important;
}

/* Eventos de reunión - Azul intenso */
:deep(.event-type-reunión) {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
  color: white !important;
}

/* Eventos de vencimiento - Rojo intenso */
:deep(.event-type-vencimiento) {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
  color: white !important;
}

/* Texto de eventos */
:deep(.fc-event-title) {
  white-space: normal !important;
  line-height: 1.2 !important;
  color: white !important;
}

:deep(.fc-event-time) {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Ocultar puntos de eventos */
:deep(.fc-daygrid-event-dot) {
  display: none !important;
}

/* Ajustes para diferentes vistas */
:deep(.fc-dayGridMonth-view .fc-event) {
  min-height: 24px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.fc-timeGridWeek-view .fc-event),
:deep(.fc-timeGridDay-view .fc-event) {
  padding: 2px 4px !important;
  border-left: 4px solid rgba(255, 255, 255, 0.5) !important;
}

:deep(.fc-listMonth-view .fc-event) {
  padding: 8px 12px !important;
  margin-bottom: 4px !important;
  border-radius: 4px !important;
}

/* Popover de "más eventos" */
:deep(.fc-popover) {
  max-width: 300px;
  right: 10px !important;
  left: auto !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.fc-popover-header) {
  background-color: #f9fafb !important;
  font-weight: 600 !important;
}

:deep(.fc-popover.fc-more-popover) {
  max-height: 80vh;
  overflow-y: auto;
}

:deep(.fc-more-popover .fc-popover-body) {
  padding: 0.5rem !important;
}

:deep(.fc-popover.fc-more-popover .fc-event) {
  margin-bottom: 0.25rem !important;
  white-space: normal !important;
  word-break: break-word !important;
}

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
    max-height: 60vh;
    padding: 0.75rem;
  }

  .filter-group {
    width: 100%;
  }

  /* Ajustes para eventos en móviles */
  :deep(.fc-event) {
    font-size: 0.7rem !important;
    padding: 1px 2px !important;
  }
  
  :deep(.fc-daygrid-event) {
    margin-bottom: 1px !important;
  }
}
</style>