<template>
    <div class="dynamic-table-container">
      <!-- Controles Superiores -->
      <div class="flex flex-wrap gap-3 mb-4 items-center">
        <!-- Búsqueda -->
        <UInput
          v-model="busqueda"
          placeholder="Buscar..."
          class="flex-grow max-w-[300px]"
        />
  
        <!-- Select simple para filtrar por estado -->
        <USelect
          v-model="estadoSeleccionado"
          :options="opcionesEstado"
          placeholder="Estado"
          class="min-w-[150px]"
        />
  
        <!-- Select Multi para definir las columnas visibles -->
        <USelectMenu
          v-model="columnasVisibles"
          :options="opcionesColumnas"
          multiple
          placeholder="Seleccionar columnas"
          class="min-w-[200px]"
        />
  
        <UButton
          label="Reiniciar"
          color="gray"
          @click="reiniciarFiltros"
          trailing-icon="i-heroicons-arrow-path-20-solid"
        />
      </div>
  
      <!-- Tabla Principal -->
      <UTable :rows="datosPaginados" :columns="columnasFormateadas" :loading="cargando" class="mb-4">
        <!-- Slot para Estado -->
        <template #estado="{ row }">
          <UBadge :color="row.estado === 'Completado' ? 'green' : 'orange'">
            {{ row.estado }}
          </UBadge>
        </template>
  
        <!-- Slot para Acciones -->
        <template #acciones="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="blue" label="Editar" @click="$emit('editar', row)" />
            <UButton size="xs" color="red" label="Eliminar" @click="$emit('eliminar', row)" />
          </div>
        </template>
      </UTable>
  
      <!-- Controles Inferiores (Paginación) -->
      <div class="flex flex-wrap justify-between items-center">
        <div class="text-sm text-gray-500">
          Mostrando {{ inicioRango }} a {{ finRango }} de {{ total }} resultados
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700">Filas por página:</span>
          <USelect v-model="filasPorPagina" :options="[10, 20, 50, 100]" class="w-[100px]" />
          <UPagination
            v-model="paginaActual"
            :page-count="filasPorPagina"
            :total="total"
            :show-last="false"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    modelo: { type: Object, required: true },
    datos: { type: Array, required: true },
    cargando: { type: Boolean, default: false }
  })
  const emit = defineEmits(['editar', 'eliminar'])
  
  const busqueda = ref('')
  const estadoSeleccionado = ref('Todos')
  const columnasVisibles = ref([])  // Aquí se guardan las claves seleccionadas
  const paginaActual = ref(1)
  const filasPorPagina = ref(10)
  
  const opcionesEstado = ['Todos', 'Completado', 'En Progreso']
  
  // Función para establecer la selección inicial según el flag "preselected"
  const setInitialColumns = () => {
    const preselected = Object.keys(props.modelo).filter(key => props.modelo[key].preselected)
    columnasVisibles.value = preselected.length > 0 ? preselected : Object.keys(props.modelo)
  }
  
  // Si el modelo llega tarde o cambia, actualizamos la selección
  watch(() => props.modelo, () => {
    setInitialColumns()
  }, { immediate: true })
  
  onMounted(() => {
    // Usamos nextTick para asegurarnos de que el componente y el USelectMenu ya estén montados
    nextTick(() => {
      setInitialColumns()
    })
  })
  
  // Opciones para el USelectMenu (el valor de cada opción es la clave de la columna)
  const opcionesColumnas = computed(() => {
    return Object.keys(props.modelo).map(key => ({
      label: props.modelo[key].label,
      value: key
    }))
  })
  
  // Se generan las columnas para la tabla a partir del array "columnasVisibles"
  const columnasFormateadas = computed(() => {
    return columnasVisibles.value.map(key => ({
      key,
      label: props.modelo[key].label
    }))
  })
  
  // Filtrado de datos por búsqueda y por estado
  const datosFiltrados = computed(() => {
    return props.datos.filter(item => {
      const matchBusqueda = Object.keys(props.modelo).some(key =>
        String(item[key]).toLowerCase().includes(busqueda.value.toLowerCase())
      )
      const matchEstado = estadoSeleccionado.value === 'Todos' || item.estado === estadoSeleccionado.value
      return matchBusqueda && matchEstado
    })
  })
  
  // Paginación
  const datosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * filasPorPagina.value
    return datosFiltrados.value.slice(inicio, inicio + filasPorPagina.value)
  })
  const total = computed(() => datosFiltrados.value.length)
  const inicioRango = computed(() => (paginaActual.value - 1) * filasPorPagina.value + 1)
  const finRango = computed(() => Math.min(paginaActual.value * filasPorPagina.value, total.value))
  
  // Función para reiniciar filtros y restablecer la selección inicial
  const reiniciarFiltros = () => {
    busqueda.value = ''
    estadoSeleccionado.value = 'Todos'
    setInitialColumns()
    paginaActual.value = 1
  }
  </script>
  
  <style scoped>
  .dynamic-table-container {
    @apply p-6 bg-white rounded-lg shadow-md border border-gray-200;
  }
  :deep([data-headlessui-state="open"]) {
    @apply block z-50;
  }
  </style>
  