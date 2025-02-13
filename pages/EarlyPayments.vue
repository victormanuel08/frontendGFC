<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Pronto Pago</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar por Descripción" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div v-if="earlyPayments.length === 0" class="flex justify-center items-center my-5">
          <h3>No hay registros de pronto pago</h3>
        </div>
        <div v-else style="overflow: auto;">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th :class="ui.th">#</th>
                <th :class="ui.th">Descripción</th>
                <th :class="ui.th">Día Inicio</th>
                <th :class="ui.th">Día Fin</th>
                <th :class="ui.th">Descuento (%)</th>
                <th :class="ui.th">Cuenta Auxiliar</th>
             
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payment, index) in earlyPayments" :key="payment.id">
                <td :class="ui.td">{{ index + 1 }}</td>
                <td :class="ui.td">{{ payment.description }}</td>
                <td :class="ui.td">{{ payment.start_day }}</td>
                <td :class="ui.td">{{ payment.end_day }}</td>
                <td :class="ui.td">{{ payment.discount }}%</td>
                <td :class="ui.td">{{ payment.accountaux_full.account.code }}.{{ payment.accountaux_full.code }}</td>
               
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  
  // Datos de pronto pago obtenidos desde la API
  const {
    data: earlyPayments,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/trainings/earlypayments/');
  
  // Estilos uniformes
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border bg-gray-100 font-bold text-left',
  };
  
  // Obtener los datos al montar el componente
  const fetchEarlyPayments = async () => {
    const { data } = await usePaginatedFetch<any>('/api/trainings/earlypayments/');
    earlyPayments.value = data;
  };
  
  onMounted(fetchEarlyPayments);
  </script>
  