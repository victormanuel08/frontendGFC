<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="name"
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
    concept_type?: concept
};

type concept = {
    id: number;
    name: string;
};

const props = withDefaults(defineProps<Props>(), {
   concept_type: undefined
});

// Función para manejar el click
const clickHandler = () => {
    retrieveFromApi();
};

// Función para recuperar los datos desde la API
const retrieveFromApi = async () => {
    const queryParams: any = { search: query.value };
    
    if (props.concept_type) {
        queryParams.concept_type = props.concept_type.id;
    }
  
    const response = await $fetch<any>("api/documents/concepts", {
        query: queryParams
    });   
    options.value = response.results;  
};

// Observar cambios en el query y specialities
watch(
    [query, () => props.concept_type],
    async ([newQuery, newConcept], [oldQuery, oldConcept]) => {
        if (oldConcept !== newConcept) {           
            modelValue.value = {};
        }       
        retrieveFromApi();
    }
);
</script>
