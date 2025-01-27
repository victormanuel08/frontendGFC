<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="doc_name"
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
    parent?: any; 
    student?: any;  
    doc_type?: string;
};

const props = withDefaults(defineProps<Props>(), {
    parent: {},
    student: {},
    doc_type: '',  
});

// Función para manejar el click
const clickHandler = () => {
    retrieveFromApi();
};

// Función para recuperar los datos desde la API
const retrieveFromApi = async () => {
    const queryParams: any = { search: query.value };
    queryParams.doc_type = props.doc_type; 
    if (props.parent) {
        queryParams.parent = props.parent.id;
    }
    if (props.student) {
        queryParams.student = props.student.id;
    }    
    const response = await $fetch<any>("api/documents/documents", {
        query: queryParams
    });   
    options.value = response.results;  
};

// Observar cambios en el query y specialities
watch(
    [query, () => props.parent],
    async ([newQuery, newParent], [oldQuery, oldParent]) => {
        if (oldParent !== newParent) {           
            modelValue.value = {};
        }       
        retrieveFromApi();
    }
);
</script>
