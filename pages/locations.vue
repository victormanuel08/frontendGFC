<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Locations</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="locations.length === 0">No hay localidades</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full permission-table">
            <thead>
              <tr>
                <th :class="ui.th">ID</th>
                <th :class="ui.th">Nombre</th>
                <th :class="ui.th">Dirección</th>
                <th :class="ui.th">Teléfono</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in locations" :key="index">
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ location.id }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ location.name }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ location.address }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ location.phone }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteLocation(location.id)" :class="ui.span">🗑️</span>
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
  import { ref, onMounted } from 'vue';
  
  const {
    data: locations,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/entities/locations/');
  
  // Simula la eliminación de una localización
  const deleteLocation = (id: number) => {
    if (confirm(`¿Estás seguro de eliminar la localización con ID ${id}?`)) {
      console.log(`Eliminar localización con ID: ${id}`);
      // Lógica para eliminar el registro.
    }
  };
  
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border',
    span: 'cursor-pointer text-red-500 hover:text-red-700',
  };
  </script>
  