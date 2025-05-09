<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Gestión de Eventos Programados" class="mb-2" />
    <div class="">
      <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
        <div class="max-w-9xl mx-auto">
          <UCard class="border-0">
            <template #header>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <UButton variant="soft" @click="handleAdd" class="flex-shrink-0">
                  <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                  Nuevo Evento
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput v-model="searchQuery" placeholder="Buscar eventos..." icon="i-heroicons-magnifying-glass"
                    :ui="{ icon: { trailing: true } }" class="flex-grow" />
                  <UPagination v-model="currentPage" 
                              :page-count="pageSize" 
                              :total="totalItems"
                              :ui="{
                                wrapper: 'flex items-center gap-1',
                                rounded: '!rounded-full min-w-[32px] justify-center'
                              }" />
                </div>
              </div>
            </template>

            <div class="flex justify-center items-center py-6">
              <h3 v-if="loading" class="text-gray-500">
                Cargando eventos...
              </h3>
              <h3 v-else-if="events.length === 0" class="text-gray-500">
                No se encontraron eventos programados
              </h3>
            </div>

            <div class="overflow-auto" v-if="!loading && events.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Título</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Tercero</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Asistentes</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Inicio</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Fin</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in events" :key="event.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">{{ event.title }}</td>
                    <td class="p-4 border border-gray-200 text-left">{{ event.third_full?.name || '-' }}</td>
                    <td class="p-4 border border-gray-200 text-center">{{ event.type_full?.name || '-' }}</td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ event.assistances_full?.length || 0 }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ formatDateTime(event.date_start, event.hour_start) }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ formatDateTime(event.date_end, event.hour_end) }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <UTooltip text="Editar">
                          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil" @click="handleEdit(event)"
                            class="hover:bg-gray-50" size="sm" />
                        </UTooltip>
                        <UTooltip text="Eliminar">
                          <UButton color="red" variant="ghost" icon="i-heroicons-trash" @click="handleDelete(event)"
                            class="hover:bg-red-50" size="sm" />
                        </UTooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="mt-4 flex justify-between items-center px-4">
                <span class="text-sm text-gray-500">
                  Mostrando {{ showingStart }} - {{ showingEnd }} de {{ totalItems }}
                </span>
                <UPagination v-model="currentPage" 
                            :page-count="pageSize" 
                            :total="totalItems"
                            :ui="{
                              wrapper: 'flex items-center gap-1',
                              rounded: '!rounded-full min-w-[32px] justify-center'
                            }" />
              </div>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Modal Editor -->
    <UModal v-model="isEditorOpen" :ui="{ width: 'sm:max-w-3xl' }">
      <ModalEvents
        :event="selectedEvent"
        :event-types="eventTypes"
        :thirds="thirds"
        @close="isEditorOpen = false"
        @submit="handleEventSubmit"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Third {
  id: number;
  name: string;
}

interface EventType {
  id: number;
  name: string;
}

interface ScheduledEvent {
  id?: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  hour_start: string;
  hour_end: string;
  third?: Third;
  type?: EventType;
  assistances_full?: Third[];
}

// Estado reactivo
const events = ref<ScheduledEvent[]>([]);
const eventTypes = ref<EventType[]>([]);
const thirds = ref<Third[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const isEditorOpen = ref(false);
const selectedEvent = ref<Partial<ScheduledEvent> | null>(null);
const loading = ref(false);

// Cálculos de paginación
const showingStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const showingEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));

const formatDateTime = (date: string, time: string): string => {
  if (!date || !time) return '-';
  return `${new Date(date).toLocaleDateString()} ${time.slice(0, 5)}`;
};

const retrieveData = async () => {
  try {
    loading.value = true;
    
    const [eventsRes, typesRes, thirdsRes] = await Promise.all([
      $fetch('/api/scheduledevents/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value,
          expand: 'third,type,assistances'
        }
      }),
      $fetch('/api/scheduledevents_types/'),
      $fetch('/api/third/')
    ]);

    events.value = eventsRes.results;
    totalItems.value = eventsRes.count;
    eventTypes.value = typesRes.results;
    thirds.value = thirdsRes.results;
    
  } catch (error) {
    console.error('Error cargando datos:', error);
    useToast().add({ title: 'Error', description: 'No se pudieron cargar los eventos', color: 'red' });
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  selectedEvent.value = {
    title: '',
    description: '',
    date_start: '',
    date_end: '',
    hour_start: '',
    hour_end: '',
    third: undefined,
    type: undefined,
    assistances_full: []
  };
  isEditorOpen.value = true;
};

const handleEdit = async (event: ScheduledEvent) => {
  try {
    const fullEvent = await $fetch(`/api/scheduledevents/${event.id}/`, {
      query: { expand: 'third,type,assistances' }
    });
    
    selectedEvent.value = {
      ...fullEvent,
      third: fullEvent.third,
      type: fullEvent.type,
      assistances_full: fullEvent.assistances_full
    };
    isEditorOpen.value = true;
  } catch (error) {
    console.error('Error cargando detalles del evento:', error);
    useToast().add({ title: 'Error', description: 'Error al cargar el evento', color: 'red' });
  }
};

const handleDelete = async (event: ScheduledEvent) => {
  try {
    await $fetch(`/api/scheduledevents/${event.id}/`, {
      method: 'DELETE'
    });
    useToast().add({ title: 'Éxito', description: 'Evento eliminado correctamente', color: 'green' });
    await retrieveData();
  } catch (error) {
    console.error('Error eliminando evento:', error);
    useToast().add({ title: 'Error', description: 'No se pudo eliminar el evento', color: 'red' });
  }
};

const handleEventSubmit = async () => {
  isEditorOpen.value = false;
  await retrieveData();
};

watch([currentPage, searchQuery], () => {
  if (searchQuery.value) currentPage.value = 1;
  retrieveData();
});

onMounted(() => {
  retrieveData();
});
</script>

<style scoped>
.permission-table {
  @apply min-w-full divide-y divide-gray-200;
}

.permission-table tr:hover {
  @apply bg-blue-50;
}

.permission-table th {
  @apply bg-gray-100 text-gray-600 font-semibold;
}

.permission-table td {
  @apply text-gray-700;
} 
</style>