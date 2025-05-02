<template>
  <div>
    <TableDynamic
      :modelo="modeloTabla"
      :datos="datosMock"
      :cargando="false"
      @editar="handleEdit"
      @eliminar="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Definición del modelo de columnas con la propiedad "preselected"
const modeloTabla = {
  id: { label: 'ID', type: 'number', preselected: true },
  titulo: { label: 'Título', type: 'string', preselected: true },
  estado: { label: 'Estado', type: 'badge', preselected: true },
  acciones: { label: 'Acciones', type: 'actions', preselected: true }
}

// Datos mockeados
const datosMock = ref([
  {
    id: 20,
    titulo: 'ullam nobis libero sapiente ad optio sint',
    estado: 'Completado'
  },
  {
    id: 38,
    titulo: 'totam quia non',
    estado: 'En Progreso'
  }
  // ... otros datos
])

// Handlers para las acciones
const handleEdit = (fila) => {
  console.log('Editar fila:', fila)
}

const handleDelete = (fila) => {
  console.log('Eliminar fila:', fila)
}
</script>
