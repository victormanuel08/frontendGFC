<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="label"
        :options="documentTypes"
        :searchable="true"
        v-model:query="query"
        :clearSearchOnClose="true"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Lista de tipos de documentos (estática)
const documentTypes = ref([
    { value: 'RC', label: 'Recibo de Caja' },
    { value: 'CE', label: 'Comprobante de Egreso' },
    { value: 'CC', label: 'Cuentas por Cobrar' }
]);

const query = ref("");
const modelValue = ref<any>(null); // Valor seleccionado

</script>
