<template>
    <div class="max-w-4xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Tipos de Tarjetas</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="cardTypes.length === 0">No hay tipos de tarjetas registradas</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full permission-table">
            <thead>
              <tr>
                <th :class="ui.th">ID</th>
                <th :class="ui.th">Código</th>

                <th :class="ui.th">Estado</th>
                <th :class="ui.th">Comisión Asociada</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cardType, index) in cardTypes" :key="index">
                <td :class="ui.td">{{ cardType.id }}</td>
                <td :class="ui.td">{{ cardType.code }}</td>
    
                <td :class="ui.td">
                  <span
                    :class="cardType.active ? ui.active : ui.inactive"
                  >
                    {{ cardType.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td :class="ui.td">
                  {{ cardType.commission_name }}%
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteCardType(cardType.id)" :class="ui.span">🗑️</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  
  // Datos de los tipos de tarjetas
  const {
    data: cardTypes,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/payments/cardtypes');
  

  
  // Función para eliminar un tipo de tarjeta
  const deleteCardType = (id: number) => {
    if (confirm(`¿Estás seguro de eliminar el tipo de tarjeta con ID ${id}?`)) {
      console.log(`Eliminar tipo de tarjeta con ID: ${id}`);
      // Lógica para eliminar el tipo de tarjeta
    }
  };
  
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border',
    active: 'text-green-500 font-bold',
    inactive: 'text-red-500 font-bold',
    span: 'cursor-pointer text-red-500 hover:text-red-700',
  };
  </script>
  