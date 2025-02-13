<template>
    <div class="max-w-4xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Comisiones de Pago</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="commissions.length === 0">No hay comisiones registradas</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full permission-table">
            <thead>
              <tr>
                <th :class="ui.th">ID</th>
                <th :class="ui.th">Código</th>
                <th :class="ui.th">Descripción</th>
                <th :class="ui.th">Porcentaje (%)</th>
                <th :class="ui.th">Estado</th>
                <th :class="ui.th">Cuenta Auxiliar</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(commission, index) in commissions" :key="index">
                <td :class="ui.td">{{ commission.id }}</td>
                <td :class="ui.td">{{ commission.code }}</td>
                <td :class="ui.td">
                  {{ commission.description || 'Sin descripción' }}
                </td>
                <td :class="ui.td">{{ commission.percentage }}%</td>
                <td :class="ui.td">
                  <span
                    :class="commission.active ? ui.active : ui.inactive"
                  >
                    {{ commission.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td :class="ui.td">{{ commission.accountaux_name }}</td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteCommission(commission.id)" :class="ui.span">🗑️</span>
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
  
  // Comisiones obtenidas de la API
  const {
    data: commissions,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/payments/commissions');
  
  // Función para eliminar una comisión
  const deleteCommission = (id: number) => {
    if (confirm(`¿Estás seguro de eliminar la comisión con ID ${id}?`)) {
      console.log(`Eliminar comisión con ID: ${id}`);
      // Lógica para eliminar la comisión
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
  