<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Pagos Registrados</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar por Transacción, Estado o Fecha" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div v-if="payments.length === 0" class="flex justify-center items-center my-5">
          <h3>No hay pagos registrados</h3>
        </div>
        <div v-else style="overflow: auto;">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th :class="ui.th">#</th>
                <th :class="ui.th">Fecha</th>
                <th :class="ui.th">Transacción</th>
                <th :class="ui.th">Monto</th>
                <th :class="ui.th">Estado</th>
                <th :class="ui.th">Concepto (ID)</th>
                <th :class="ui.th">Estudiante (ID)</th>
                <th :class="ui.th">Tarjeta (ID)</th>
                <th :class="ui.th">CXC</th>
  
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payment, index) in payments" :key="payment.id">
                <td :class="ui.td">{{ index + 1 }}</td>
                <td :class="ui.td">{{ formatDate(payment.date) }}</td>
                <td :class="ui.td">{{ payment.transaction_id }}</td>
                <td :class="ui.td">{{ formatCurrency(payment.amount) }}</td>
                <td :class="`${ui.td} ${statusClass(payment.status)}`">{{ payment.status }}</td>
                <td :class="ui.td">{{ payment.concept_name }}</td>
                <td :class="ui.td">{{ payment.student_name }}</td>
                <td :class="ui.td">{{ payment.card_type_name }}</td>
                <td :class="ui.td">{{ payment.cxc_name ?? 'N/A' }}</td>

              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  
  // Datos de pagos obtenidos desde la API
  const {
    data: payments,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/payments/payments');
  
  // Formatear fecha a formato legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Formatear el monto como moneda
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(Number(value));
  };
  
  // Clase CSS según el estado del pago
  const statusClass = (status: string) => {
    return status === 'EXITOSO' ? 'text-green-500 font-bold' : 'text-red-500 font-bold';
  };
  
  // Estilos uniformes
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border bg-gray-100 font-bold text-left',
  };
  
  const fetchPayments = async () => {
    const { data } = await usePaginatedFetch<any>('/api/payments/payments');
    payments.value = data;
  };
  
  onMounted(fetchPayments);
  </script>
  