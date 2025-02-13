<template>
  <div class="max-w-5xl mx-auto">
    <UCard class="my-2">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="font-bold">Documentos</h2>
          <div class="flex gap-3 my-3">
            <UButton @click="openModal(null)">Crear Documento</UButton>
            <UInput v-model="search" placeholder="Buscar" />
            <UPagination v-model="pagination.page" :page-count="pagination.pageSize" :total="pagination.resultsCount" />
          </div>
        </div>
      </template>
      <div class="flex justify-center items-center">
        <h3 v-if="documents.length === 0">No hay documentos</h3>
      </div>
      <div style="overflow: auto;">
        <table class="table-auto w-full permission-table">
          <thead>
            <tr>
              <th :class="ui.th">Documento</th>
              <th :class="ui.th">Estudiante(Padre)</th>
              <th :class="ui.th">Concepto</th>
              <th :class="ui.th">Valor</th>
              <th :class="ui.th">Cruzado</th>
              <th :class="ui.th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(document, index) in documents" :key="index">
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span>{{ document.doc_type}} - {{ document.prefix}} - {{ document.consecutive}}</span>
                </div>
              </td>
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span>{{ document.student_name }}</span><br>
                  <span>{{ document.parent_name }} </span>
                </div>
              </td>
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span>{{ document.concept_name }}</span>
                </div>
              </td>
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span>{{ document.total_amount }}</span>
                </div>
              </td>
              <td :class="ui.td">
                <div class="flex items-center justify-center">
                  <span>{{ document?.cxc_name }} {{ document?.rc_calculated }}</span>
                </div>
              </td>
              <td :class="ui.td">
                <div class="flex items-center justify-center gap-3">
                  <!-- Botón para editar documento -->
                  <span @click="downloadPDF(document)" :class="ui.span">📄</span>
                  <!-- Botón para eliminar documento -->
                  <span @click="showAlert('PENDIENTE DECIDIR SI BORRAN O NO')" :class="ui.span" v-if="!document?.cxc_name && !document?.rc_calculated">🗑️</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Modal para crear/editar documentos -->
   
    
    <DocumentForm v-if="isModalOpen" :documentId="selectedDocumentId" @close="isModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DocumentForm from '@/components/DocumentForm.vue';

const {
  data: documents,
  pagination,
  search,
} = usePaginatedFetch<any>('/api/documents/documents/');

const fetchDocuments = async () => {
  const { data } = await usePaginatedFetch<any>('/api/documents/documents/');
  documents.value = data;
};

onMounted(fetchDocuments);

// Estado de la modal
const isModalOpen = ref(false);
const selectedDocumentId = ref<number | null>(null);

const openModal = (docId: number | null) => {
  selectedDocumentId.value = docId;
  isModalOpen.value = true;
};

const ui = {
  td: 'p-1 border',
  th: 'p-2 border',
  span: 'cursor-pointer',
};
const showAlert = (message: string) => {
  window.alert(message);
};


const downloadPDF = async (document: any) => {
  try {
    const documentData = document; // Cambié 'document' por 'documentData'
    console.log('Descargando el archivo:', documentData); // Cambié 'document' por 'documentData'

    const response = await fetch(`api/printpdf/CCENTRY/${documentData.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf', // Asegúrate de aceptar el tipo de contenido correcto
      },
    });

    if (!response.ok) {
      console.error('Error al descargar el archivo:', response.statusText);
      return;
    }

    const blob = await response.blob();
    const filename = documentData.doc_type + '-' + documentData.prefix + '-' + documentData.consecutive + '.pdf';

    // Usar window.document para asegurarnos de no sobrescribir 'document'
    const link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
    }, 250);
  } catch (error) {
    console.error('Error en la descarga:', error);
  }
};

</script>
