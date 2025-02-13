<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Terceros</h2>
            <div class="flex gap-3 my-3">
              <UButton @click="openModal(null), thirdType='PARENT'">Crear Responsable</UButton>
              <UButton @click="openModal(null), thirdType='STUDENT'">Crear Estudiante</UButton>
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="thirds.length === 0">No hay terceros</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full permission-table">
            <thead>
              <tr>
                <th :class="ui.th">ID</th>
                <th :class="ui.th">Nombre Completo</th>
                <th :class="ui.th">Tipo</th>
                <th :class="ui.th">Teléfono</th>
                <th :class="ui.th">Email</th>
                <th :class="ui.th">Estudiantes Asociados</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(third, index) in thirds" :key="index">
                <td :class="ui.td">{{ third.id }}</td>
                <td :class="ui.td">{{ third.first_name }} {{ third.last_name }}</td>
                <td :class="ui.td">  
                  <span>{{ { STUDENT: "Estudiante", TEACHER: "Profesor", PARENT: "Padre", BUILDER: "Cartera" }[third.type as keyof typeof thirdTypes] || "Desconocido" }}</span>
                </td>
                <td :class="ui.td">{{ third.phone }}</td>
                <td :class="ui.td">{{ third.email }}</td>
                <td :class="ui.td">
                  <div v-if="third.students.length > 0">
                    <ul>
                      <li v-for="student in third.students" :key="student.id">
                        {{ student.first_name }} {{ student.last_name }} ({{ student.id_number }})
                      </li>
                    </ul>
                  </div>
                  <div v-else>N.A</div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteThird(third.id)" :class="ui.span">🗑️</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
      <ThirdForm v-if="isModalOpen" :thirdId="selectedThirdId" :thirdType="thirdType" @close="isModalOpen = false" />
      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const thirdType = ref<string | null>(null);
  
  const {
    data: thirds,
    pagination,
    search,
    refresh,
    pending,
  } = usePaginatedFetch<any>('/api/entities/thirds/');
  
  
  const deleteThird = async (id: number) => {
      if (confirm(`¿Estás seguro de eliminar el tercero con ID ${id}?`)) {
        // Eliminar el tercero
        const response = await $fetch(`/api/entities/thirds/${id}`, {
          method: 'DELETE',
        });

          refresh()

      }
    };
  
const isModalOpen = ref(false);
const selectedThirdId = ref<number | null>(null);

const openModal = (thirdId: number | null) => {
  selectedThirdId.value = thirdId;
  isModalOpen.value = true;
};

watch(isModalOpen, () => {
  if (!isModalOpen.value) {
    refresh();
  }
});

  const thirdTypes = {
    STUDENT: "Estudiante",
    TEACHER: "Profesor",
    PARENT: "Padre",
    BUILDER: "Cartera"
  };

  const ui = {
    td: 'p-1 border',
    th: 'p-2 border',
    span: 'cursor-pointer text-red-500 hover:text-red-700',
  };
  </script>
  