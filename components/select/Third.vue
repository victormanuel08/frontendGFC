<template>
    <USelectMenu
        v-model="modelValue"
        option-attribute="id_number"
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
    third?: any;
    type: string;  
    parent?: any;  
};

const props = withDefaults(defineProps<Props>(), {
    third: {},
    type: '',  
    parent: {},  
});

// Función para manejar el click
const clickHandler = () => {
    retrieveFromApi();
};

// Función para recuperar los datos desde la API
const retrieveFromApi = async () => {
    const queryParams: any = { search: query.value };
    queryParams.type = props.type; // Si no, asignar el valor individual
    if (props.parent) {
        queryParams.parent = props.parent.id;
    }
    // Hacer la solicitud a la API
    const response = await $fetch<any>("api/entities/thirds", {
        query: queryParams
    });
    // Asignamos los resultados a las opciones
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
