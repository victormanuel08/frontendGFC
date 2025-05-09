<template>
  <UModal v-model="isOpen" :ui="{ 
    width: 'sm:max-w-5xl',
    container: 'flex items-center justify-center min-h-screen'
  }">
    <UCard :ui="{ 
      base: 'max-h-[85vh] flex flex-col',
      header: { base: 'border-b border-gray-200 px-6 py-4' },
      body: { base: 'flex-1 overflow-y-auto p-6' },
      footer: { base: 'border-t border-gray-200 px-6 py-4' }
    }">
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingEvent ? 'Editar Evento' : 'Nuevo Evento' }}
          </h2>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            size="sm"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Cuerpo reorganizado -->
      <UForm :state="formData" @submit="saveEvent" class="h-full">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna Izquierda: Información básica -->
          <div class="space-y-4">
            <UFormGroup label="Título" name="title" required>
              <UInput 
                v-model="formData.title" 
                placeholder="Nombre del evento"
              />
            </UFormGroup>

            <UFormGroup label="Tipo de evento" name="type" required>
              <USelect
                v-model="formData.type"
                :options="eventTypes"
                option-attribute="name"
                value-attribute="id"
                placeholder="Seleccionar tipo"
              />
            </UFormGroup>

            <UFormGroup label="Descripción" name="description">
              <UTextarea
                v-model="formData.description"
                placeholder="Detalles importantes..."
                :rows="4"
              />
            </UFormGroup>
          </div>

          <!-- Columna Central: Participantes -->
          <div class="space-y-4">
            <UFormGroup label="Tercero principal" name="third">
              <USelect
                v-model="formData.third"
                :options="filteredThirds"
                option-attribute="razon_social"
                value-attribute="id"
                placeholder="Buscar tercero..."
                :searchable="true"
                @search="handleThirdSearch"
              />
            </UFormGroup>

            <UFormGroup label="Asistentes" name="assistants">
              <USelectMenu
                v-model="formData.assistants"
                :options="filteredAssistants"
                option-attribute="razon_social"
                value-attribute="id"
                placeholder="Seleccionar asistentes..."
                multiple
                :searchable="true"
                @search="handleAssistantSearch"
              >
                <template #label>
                  <span v-if="formData.assistants.length > 0">
                    {{ formData.assistants.length }} seleccionados
                  </span>
                  <span v-else>Seleccionar asistentes...</span>
                </template>
              </USelectMenu>
            </UFormGroup>

            <UFormGroup label="Compañías" name="companies">
              <USelectMenu
                v-model="formData.companies"
                :options="filteredCompanies"
                option-attribute="name"
                value-attribute="id"
                placeholder="Seleccionar compañías..."
                multiple
                :searchable="true"
                @search="handleCompanySearch"
              >
                <template #label>
                  <span v-if="formData.companies.length > 0">
                    {{ formData.companies.length }} seleccionadas
                  </span>
                  <span v-else>Seleccionar compañías...</span>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>

          <!-- Columna Derecha: Fechas y autollenado -->
          <div class="space-y-4">
            <UFormGroup label="Fecha inicio" name="date_start" required>
              <div class="flex gap-2">
                <UInput
                  v-model="formData.date_start"
                  type="date"
                  @change="calculateDefaultTimes"
                />
                <UButton
                  color="gray"
                  variant="solid"
                  label="Auto"
                  size="xs"
                  @click="autoFillTimes"
                  title="Autollenar horarios"
                />
              </div>
            </UFormGroup>

            <UFormGroup label="Hora inicio" name="hour_start">
              <UInput
                v-model="formData.hour_start"
                type="time"
              />
            </UFormGroup>

            <UFormGroup label="Fecha fin" name="date_end">
              <UInput
                v-model="formData.date_end"
                type="date"
                :min="formData.date_start"
              />
            </UFormGroup>

            <UFormGroup label="Hora fin" name="hour_end">
              <UInput
                v-model="formData.hour_end"
                type="time"
                :min="formData.date_start === formData.date_end ? formData.hour_start : null"
              />
            </UFormGroup>

            <!-- Botones de acción en versión móvil -->
            <div class="lg:hidden flex gap-3 pt-4">
              <UButton
                color="gray"
                variant="ghost"
                label="Cancelar"
                class="flex-1"
                @click="closeModal"
              />
              <UButton
                type="submit"
                color="blue"
                :label="editingEvent ? 'Actualizar' : 'Guardar'"
                class="flex-1"
                :loading="isSaving"
              />
            </div>
          </div>
        </div>

        <!-- Footer (solo en desktop) -->
        <template #footer>
          <div class="hidden lg:flex justify-end gap-3">
            <UButton
              color="gray"
              variant="ghost"
              label="Cancelar"
              @click="closeModal"
            />
            <UButton
              type="submit"
              color="blue"
              :label="editingEvent ? 'Actualizar evento' : 'Crear evento'"
              :loading="isSaving"
            />
          </div>
        </template>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { format, addHours, addDays } from 'date-fns';

const props = defineProps({
  eventTypes: {
    type: Array,
    required: true,
    default: () => []
  },
  thirds: {
    type: Array,
    required: true,
    default: () => []
  },
  companies: {
    type: Array,
    default: () => []
  },
  editingEvent: {
    type: Object,
    default: null
  },
  defaultDuration: {
    type: Number,
    default: 2 // horas por defecto
  }
});

const emit = defineEmits(['close', 'save']);

// Estado del modal
const isOpen = ref(true);
const isSaving = ref(false);
const assistantSearchQuery = ref('');
const thirdSearchQuery = ref('');
const companySearchQuery = ref('');

// Datos del formulario
const formData = ref({
  title: '',
  description: '',
  type: null,
  third: null,
  assistants: [],
  companies: [],
  date_start: format(new Date(), 'yyyy-MM-dd'),
  hour_start: '09:00',
  date_end: '',
  hour_end: '11:00'
});

// Computed
const filteredAssistants = computed(() => {
  return filterOptions(props.thirds, assistantSearchQuery.value);
});

const filteredThirds = computed(() => {
  return filterOptions(props.thirds, thirdSearchQuery.value);
});

const filteredCompanies = computed(() => {
  return filterOptions(props.companies, companySearchQuery.value);
});

// Watcher para fecha de inicio
watch(() => formData.value.date_start, (newDate) => {
  if (newDate && !formData.value.date_end) {
    formData.value.date_end = newDate;
  }
});

// Métodos
const filterOptions = (options, query) => {
  if (!query) return options;
  const q = query.toLowerCase();
  return options.filter(option => 
    (option.razon_social || option.name).toLowerCase().includes(q) ||
    (option.id_number && option.id_number.toString().includes(q))
  );
};

const handleAssistantSearch = (query) => {
  assistantSearchQuery.value = query;
};

const handleThirdSearch = (query) => {
  thirdSearchQuery.value = query;
};

const handleCompanySearch = (query) => {
  companySearchQuery.value = query;
};

// Autollenado inteligente
const calculateDefaultTimes = () => {
  if (!formData.value.date_start) return;
  
  // Si no hay fecha fin, usar misma fecha
  if (!formData.value.date_end) {
    formData.value.date_end = formData.value.date_start;
  }
  
  // Si es el mismo día, calcular hora fin
  if (formData.value.date_start === formData.value.date_end) {
    const [hours, minutes] = formData.value.hour_start.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours + props.defaultDuration, minutes);
    formData.value.hour_end = format(endTime, 'HH:mm');
  }
};

const autoFillTimes = () => {
  formData.value.hour_start = '09:00';
  const endTime = new Date();
  endTime.setHours(9 + props.defaultDuration, 0);
  formData.value.hour_end = format(endTime, 'HH:mm');
  formData.value.date_end = formData.value.date_start;
};

const closeModal = () => {
  isOpen.value = false;
  setTimeout(() => emit('close'), 300);
};

const saveEvent = async () => {
  isSaving.value = true;
  
  try {
    const payload = {
      ...formData.value,
      date_end: formData.value.date_end || formData.value.date_start,
      hour_end: formData.value.hour_end || calculateDefaultEndTime()
    };
    
    emit('save', payload);
    closeModal();
  } finally {
    isSaving.value = false;
  }
};

const calculateDefaultEndTime = () => {
  const [hours, minutes] = formData.value.hour_start.split(':').map(Number);
  const endTime = new Date();
  endTime.setHours(hours + props.defaultDuration, minutes);
  return format(endTime, 'HH:mm');
};

// Inicialización
onMounted(() => {
  if (props.editingEvent) {
    formData.value = {
      title: props.editingEvent.title,
      description: props.editingEvent.description || '',
      type: props.editingEvent.type?.id || null,
      third: props.editingEvent.third?.id || null,
      assistants: props.editingEvent.assistants?.map(a => a.id) || [],
      companies: props.editingEvent.companies?.map(c => c.id) || [],
      date_start: format(new Date(props.editingEvent.date_start), 'yyyy-MM-dd'),
      hour_start: props.editingEvent.hour_start || '09:00',
      date_end: props.editingEvent.date_end ? format(new Date(props.editingEvent.date_end), 'yyyy-MM-dd') : '',
      hour_end: props.editingEvent.hour_end || calculateDefaultEndTime()
    };
  } else {
    calculateDefaultTimes();
  }
});
</script>

<style scoped>
/* Estilos para selects */
:deep(.us-select-menu-options),
:deep(.us-select-options) {
  max-height: 200px;
  overflow-y: auto;
}

/* Ajustes para mobile */
@media (max-width: 1023px) {
  :deep(.us-card-body) {
    padding: 1rem;
  }
  
  .grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>