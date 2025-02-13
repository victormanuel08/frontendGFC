<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="code"
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
  isEfective: boolean;
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
    const response = await $fetch<any>("api/payments/cardtypes", {
        query: queryParams
    });   

    options.value = response.results.filter((option: any) => option.comision != 3); 
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
