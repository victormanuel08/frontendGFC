<template>
  <div class="max-w-5xl mx-auto">
    <UCard class="my-2">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="font-bold">Cuentas</h2>
          <div class="flex gap-3 my-3">
            <UInput v-model="search" placeholder="Buscar cuenta" />
            <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
          </div>
        </div>
      </template>
      <div class="flex justify-center items-center">
        <h3 v-if="accounts.length === 0">No hay cuentas</h3>
      </div>
      <div style="overflow: auto;">
        <table class="table-auto w-full permission-table">
          <thead>
            <tr>
              <th :class="ui.th">Código</th>
              <th :class="ui.th">Nombre</th>
              <th :class="ui.th">Descripción</th>
              <th :class="ui.th">Tipo</th>
              <th :class="ui.th">Saldo</th>
              <th :class="ui.th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(account, index) in accounts" :key="index">
              <td :class="ui.td">{{ account.code }}</td>
              <td :class="ui.td">{{ account.name }}</td>
              <td :class="ui.td">{{ account.description || 'N/A' }}</td>
              <td :class="ui.td">{{ account.type }}</td>
              <td :class="ui.td">{{ account.balance }}</td>
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span @click="deleteAccount(account.code)" :class="ui.span">🗑️</span>
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
const {
  data: accounts,
  pagination,
  search,
  pending,
} = usePaginatedFetch<any>('/api/documents/allaccounts/');

const fetchAccounts = async () => {
  const { data } = await usePaginatedFetch<any>('/api/documents/allaccounts/');
  accounts.value = data;
};

onMounted(fetchAccounts);

const ui = {
  td: 'p-1 border',
  th: 'p-2 border',
  span: 'cursor-pointer',
};

// Método para manejar la eliminación de una cuenta
const deleteAccount = (code: string) => {
  // Aquí va la lógica para eliminar la cuenta, por ejemplo:
  // axios.delete(`/api/documents/allaccounts/${code}`).then(fetchAccounts);
  console.log(`Eliminando cuenta con código: ${code}`);
};
</script>
