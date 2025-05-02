<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <label class="block">Departamento:</label>
            <!-- Botones CRUD -->
            <button @click="handleAdd" class="p-1 text-gray-500 hover:text-green-600 transition-colors" title="Agregar nuevo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            <button v-if="modelValue?.id" @click="handleEdit" class="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>

            <button v-if="modelValue?.id" @click="handleDelete" class="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>

        <div class="flex gap-2">
            <USelectMenu 
                v-model="modelValue" 
                option-attribute="concat" 
                :options="options" 
                :searchable="true"
                v-model:query="query" 
                :clearSearchOnClose="true" 
                class="min-w-[300px] w-full"
            />
        </div>

        <!-- Modal de Edición/Creación -->
        <UModal v-model="isModalOpen">
            <div class="p-4 bg-white rounded-lg space-y-4">
                <h3 class="text-lg font-semibold">{{ isEditMode ? 'Editar' : 'Nuevo' }} Departamento</h3>
                
                <div>
                    <label class="block text-sm text-gray-600 mb-1">Código (hasta 10 caracteres)</label>
                    <UInput 
                        v-model="formData.code" 
                        placeholder="Ej: DPT-01"
                        maxlength="10"
                        class="w-full"
                    />
                </div>

                <div>
                    <label class="block text-sm text-gray-600 mb-1">Nombre</label>
                    <UInput 
                        v-model="formData.name" 
                        placeholder="Ej: Departamento Norte"
                        class="w-full"
                    />
                </div>

                <div>           
                    <SelectCountry 
                        v-model="formData.country_full"
                        class="w-full"
                    />
                </div>

                <div class="flex justify-end gap-2">
                    <UButton color="gray" @click="isModalOpen = false">Cancelar</UButton>
                    <UButton color="primary" @click="handleSubmit">{{ isEditMode ? 'Guardar' : 'Crear' }}</UButton>
                </div>
            </div>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';

interface Country {
    id: number;
    code: string;
    name: string;
}

interface Department {
    id?: number;
    code: string;
    name: string;
    country_id: number;
    country_full?: Country;
    concat?: string;
}

const options = ref<Department[]>([]);
const query = ref("");
const modelValue = defineModel<any>({default: () => ({})})
const isModalOpen = ref(false);
const isEditMode = ref(false);
const countries = ref<Country[]>([]);

const formData = ref({
    id: undefined as number | undefined,
    code: '',
    name: '',
    country_id: 0,
    country_full: {} as Country
});

// Carga inicial de datos
onMounted(async () => {
    await Promise.all([retrieveFromApi()]);
});



const handleAdd = () => {
    isEditMode.value = false;
    formData.value = { id: undefined, code: '', name: '', country_id: 0 };
    isModalOpen.value = true;
};

const handleEdit = () => {
  isEditMode.value = true;
  formData.value = {
    id: modelValue.value.id,
    code: modelValue.value.code,
    name: modelValue.value.name,
    country_id: modelValue.value.country_id,
    country_full: modelValue.value.country_full 
  };
  isModalOpen.value = true;
};

// Añadir en el script setup
watch(
  () => formData.value.country_full,
  (newCountry) => {
    if (newCountry?.id) {
      formData.value.country_id = newCountry.id;
    }
  }
);

const handleSubmit = async () => {
    if (formData.value.country_full?.id) {
    formData.value.country_id = formData.value.country_full.id;
  }
    if (!validateForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Verifique todos los campos',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }

    try {
        const url = formData.value.id ? `/api/departments/${formData.value.id}` : '/api/departments/';
        const method = formData.value.id ? 'PUT' : 'POST';

        const { data } = await useFetch(url, {
            method,
            body: formData.value
        });

        if (data.value) {
            await retrieveFromApi();
            isModalOpen.value = false;
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `Departamento ${isEditMode.value ? 'actualizado' : 'creado'} correctamente`,
                confirmButtonColor: '#3b82f6'
            });
        }
    } catch (error) {
        console.error("Error guardando departamento:", error);
        showErrorAlert('guardar cambios');
    }
};

const validateForm = () => {
    return (
        formData.value.code.length >= 2 &&
        formData.value.code.length <= 10 &&
        formData.value.name.length >= 3 &&
        formData.value.country_id > 0
    );
};

const handleDelete = async () => {
    const result = await Swal.fire({
        title: '¿Eliminar departamento?',
        html: `Estás por eliminar: <b>${modelValue.value.concat}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
    });

    if (result.isConfirmed) {
        try {
            await useFetch(`/api/departments/${modelValue.value.id}`, {
                method: 'DELETE'
            });
            
            options.value = options.value.filter(item => item.id !== modelValue.value.id);
            modelValue.value = {} as Department;
            
            Swal.fire('¡Eliminado!', 'El departamento fue eliminado', 'success');
        } catch (error) {
            console.error("Error eliminando departamento:", error);
            showErrorAlert('eliminar');
        }
    }
};

const retrieveFromApi = async () => {
    try {
        const response = await $fetch<{ results: Department[] }>("api/departments/", {
            query: { 
                search: query.value,
                expand: 'country_full'
            }
        });
        
        options.value = response.results.map(d => ({
            ...d,
     
        }));
    } catch (error) {
        console.error("Error cargando departamentos:", error);
        showErrorAlert('cargar departamentos');
    }
};

const showErrorAlert = (action: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `<div class="text-sm">No se pudo ${action}</div>`,
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium'
        }
    });
};

watch(query, retrieveFromApi);
</script>