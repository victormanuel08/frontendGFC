<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="code_full"
        :options="options"
        :searchable="true"
        v-model:query="query"
        :clearSearchOnClose="true"
        @click="clickHandler"  
    >
    </USelectMenu>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, withDefaults } from 'vue';

const options = ref<any[]>([]);
const query = ref("");
const modelValue = ref<any>({}); // Aquí usas un modelo vacío por defecto

// Propiedades
type Props = {      
    
};

type concept = {
    id: number;
    name: string;
};

const props = withDefaults(defineProps<Props>(), {
   
});

// Función para manejar el click
const clickHandler = () => {
    retrieveFromApi();
};

// Función para recuperar los datos desde la API
const retrieveFromApi = async () => {
    const queryParams: any = { search: query.value };
    
    const response = await $fetch<any>("api/documents/accountauxs", {
        query: queryParams
    });   
    options.value = response.results;  
};


</script>

