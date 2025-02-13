<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold">Conceptos</h2>
            <div class="flex gap-3 my-3">
              <UInput v-model="search" placeholder="Buscar" />
              <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
            </div>
          </div>
        </template>
        <div class="flex justify-center items-center">
          <h3 v-if="concepts.length === 0">No hay conceptos</h3>
        </div>
        <div style="overflow: auto;">
          <table class="table-auto w-full permission-table">
            <thead>
              <tr>
                <th :class="ui.th">Codigo</th>
                <th :class="ui.th">Tipo de Concepto</th>
                <th :class="ui.th">Nombre</th>
                <th :class="ui.th">Valor</th>
                <th :class="ui.th">Descripción</th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(concept, index) in concepts" :key="index">
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ concept.code }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ concept.concept_type_name }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ concept.name }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ concept.price }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span>{{ concept.description }}</span>
                  </div>
                </td>
                <td :class="ui.td">
                  <div class="flex items-center justify-center">
                    <span @click="deleteConcept(concept.id)" :class="ui.span">🗑️</span>
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
  import { usePaginatedFetch } from '@/composables/paginatedFetch';
  
  type concept = {
    id: number;
    code: string;
    name: string;
    price: number;
    description: string;
    concept_type_name: string;
  };

  const concepts = ref([] );
  const pagination = ref({ page: 1, pageSize: 10, resultsCount: 0 });
  const search = ref('');
  
  const fetchConcepts = async () => {
    const  data  = await usePaginatedFetch('/api/documents/concepts/');
    concepts.value = data.data;
  };
  
  onMounted(fetchConcepts);
  
  const deleteConcept = async (id: number) => {
    try {
      await $fetch(`/api/concepts/${id}/`, { method: 'DELETE' });
      concepts.value = concepts.value.filter((concept: any) => concept.id !== id);
    } catch (error) {
      console.error('Error al eliminar el concepto:', error);
    }
  };
  
  const ui = {
    td: 'p-1 border',
    th: 'p-2 border',
    span: 'cursor-pointer',
  };
  </script>
  
  <style scoped>
  .permission-table {
    width: 100%;
  }
  </style>
  