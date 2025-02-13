<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Planes de Entrenamiento</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar por Nombre o Descripción" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div v-if="trainingPlans.length === 0" class="flex justify-center items-center my-5">
          <h3>No hay planes de entrenamiento registrados</h3>
        </div>
        <div v-else style="overflow: auto;">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th :class="ui.th">#</th>
                <th :class="ui.th">Nombre</th>
                <th :class="ui.th">Descripción</th>
                <th :class="ui.th">Costo Mensual</th>
                <th :class="ui.th">Cuenta Auxiliar</th>
                <th :class="ui.th">Pronto Pago</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(plan, index) in trainingPlans" :key="plan.id">
                <td :class="ui.td">{{ index + 1 }}</td>
                <td :class="ui.td">{{ plan.name }}</td>
                <td :class="ui.td">{{ plan.description }}</td>
                <td :class="ui.td">{{ formatCurrency(plan.monthly_cost) }}</td>
                <td :class="ui.td">{{ plan.accountaux }}</td>
                <td :class="ui.td">
                  <ul>
                    <li v-for="early in plan.early_payment" :key="early">#{{ early }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  
  // Datos de planes de entrenamiento obtenidos desde la API
  const {
    data: trainingPlans,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/trainings/trainingplans/');
  
  // Formatear el monto como moneda
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(Number(value));
  };
  
  // Estilos uniformes
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border bg-gray-100 font-bold text-left',
  };
  
  // Obtener los datos al montar el componente
  const fetchTrainingPlans = async () => {
    const { data } = await usePaginatedFetch<any>('/api/trainings/trainingplans/');
    trainingPlans.value = data;
  };
  
  onMounted(fetchTrainingPlans);
  </script>
  