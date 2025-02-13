<template>
    <div class="max-w-4xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Cuentas Bancarias</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="bankAccounts.length === 0">No hay cuentas bancarias registradas</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th :class="ui.th">ID</th>
                <th :class="ui.th">Nombre</th>
                <th :class="ui.th">Número de Cuenta</th>
                <th :class="ui.th">Saldo</th>
                <th :class="ui.th">Principal</th>
                <th :class="ui.th">Cuenta Auxiliar</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bankAccount, index) in bankAccounts" :key="index">
                <td :class="ui.td">{{ bankAccount.id }}</td>
                <td :class="ui.td">{{ bankAccount.name }}</td>
                <td :class="ui.td">{{ bankAccount.account_number }}</td>
                <td :class="ui.td">{{ formatCurrency(bankAccount.balance) }}</td>
                <td :class="ui.td">
                  <span
                    :class="bankAccount.is_primary ? ui.primary : ui.secondary"
                  >
                    {{ bankAccount.is_primary ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td :class="ui.td">{{ bankAccount.accountaux_name }}</td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteBankAccount(bankAccount.id)" :class="ui.span">🗑️</span>
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
  import { ref, computed } from 'vue';
  
  // Datos de las cuentas bancarias
  const {
    data: bankAccounts,
    pagination,
    search,
    pending,
  } = usePaginatedFetch<any>('/api/payments/bankaccounts');
   
  // Formatear saldo en formato de moneda
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(Number(value));
  };
  
  // Función para eliminar una cuenta bancaria
  const deleteBankAccount = (id: number) => {
    if (confirm(`¿Estás seguro de eliminar la cuenta bancaria con ID ${id}?`)) {
      console.log(`Eliminar cuenta bancaria con ID: ${id}`);
      // Lógica para eliminar la cuenta bancaria
    }
  };
  
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border',
    primary: 'text-green-500 font-bold',
    secondary: 'text-gray-500 font-bold',
    span: 'cursor-pointer text-red-500 hover:text-red-700',
  };
  </script>
  