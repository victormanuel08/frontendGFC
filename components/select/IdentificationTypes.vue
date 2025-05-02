<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <label class="block">{{ $props.labelpredeterminado}}:</label>
            <!-- Icono Agregar -->
            <button @click="handleAdd" class="p-1 text-gray-500 hover:text-green-600 transition-colors"
                title="Agregar nuevo tipo" v-if ="props.icons">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            <!-- Icono Editar -->
            <button v-if="modelValue?.id && props.icons" @click="handleEdit"
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Editar tipo seleccionado">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>

            <!-- Icono Eliminar -->
            <button v-if="modelValue?.id && props.icons" @click="handleDelete"
                class="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Eliminar tipo seleccionado">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>

        <div class="flex gap-2">
            <USelectMenu v-model="modelValue" option-attribute="concat" :options="options" :searchable="true"
                v-model:query="query" :clearSearchOnClose="true" class="flex-1">
            </USelectMenu>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    },
    labelpredeterminado: {
        type: String,
        default: 'Tipo ID'
    },
    icons: {
        type: Boolean,
        default: true
    }
});

const options = ref<any[]>([]);
const query = ref("");
const modelValue = defineModel<any>({default: () => ({})});

onMounted(() => {
    retrieveFromApi();
});

const showEditorModal = async (isEdit: boolean = false) => {
    const currentItem = modelValue.value;
    
    const { value: formValues } = await Swal.fire({
        title: `<span class="text-lg font-semibold text-gray-800">${isEdit ? 'Editar' : 'Nuevo'} Tipo de Identificación</span>`,
        html: `
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Código (2-3 letras)</label>
          <input id="code" 
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        uppercase placeholder-gray-400 border-gray-300" 
                 placeholder="Ej: DNI"
                 maxlength="3"
                 value="${isEdit ? currentItem.name : ''}"
                 style="letter-spacing: 0.2em"
                 oninput="this.value = this.value.toUpperCase()">
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Descripción</label>
          <input id="description" 
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400 border-gray-300" 
                 value="${isEdit ? currentItem.description : ''}"
                 placeholder="Ej: Documento Nacional de Identidad">
        </div>
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Guardar' : 'Crear',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        focusConfirm: false,
        customClass: {
            popup: 'rounded-xl',
            actions: 'mt-4',
            confirmButton: 'px-4 py-2 text-sm font-medium',
            cancelButton: 'px-4 py-2 text-sm font-medium mr-2'
        },
        preConfirm: () => {
            const code = (document.getElementById('code') as HTMLInputElement)?.value.trim()
            const description = (document.getElementById('description') as HTMLInputElement)?.value.trim()

            let error = ''
            if (!code || code.length < 2 || code.length > 3) error += 'El código debe tener entre 2 y 3 caracteres<br>'
            if (!description || description.length < 3) error += 'La descripción debe tener al menos 3 caracteres'

            if (error) Swal.showValidationMessage(error)
            return { code, description }
        },
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton()
            const inputs = Swal.getPopup().querySelectorAll('input')
            
            // Función de validación en tiempo real
            const validateInputs = () => {
                const codeValid = inputs[0].value.trim().length >= 2 && inputs[0].value.trim().length <= 3
                const descValid = inputs[1].value.trim().length >= 3
                confirmButton.disabled = !(codeValid && descValid)
            }

            // Validar inicialmente
            validateInputs()
            
            // Event listeners para validación en tiempo real
            inputs.forEach(input => {
                input.addEventListener('input', validateInputs)
            })
        }
    })

    return formValues;
}

const handleAdd = async () => {
    const formValues = await showEditorModal();
    
    if (formValues) {
        try {
            const newItem = {
                id: Date.now(),
                name: formValues.code,
                description: formValues.description,
                concat: `${formValues.code} - ${formValues.description}`
            }

            options.value = [...options.value, newItem]
            modelValue.value = newItem

            Swal.fire({
                icon: 'success',
                title: '¡Creado!',
                text: 'El tipo se creó correctamente',
                confirmButtonColor: '#3b82f6',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'px-4 py-2 text-sm font-medium'
                }
            })
        } catch (error) {
            showErrorAlert('crear');
        }
    }
}

const handleEdit = async () => {
    const formValues = await showEditorModal(true);
    
    if (formValues) {
        try {
            const updatedItem = {
                ...modelValue.value,
                name: formValues.code,
                description: formValues.description,
                concat: `${formValues.code} - ${formValues.description}`
            }

            options.value = options.value.map(item => 
                item.id === modelValue.value.id ? updatedItem : item
            );
            
            modelValue.value = updatedItem;

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El tipo se editó correctamente',
                confirmButtonColor: '#3b82f6',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'px-4 py-2 text-sm font-medium'
                }
            })
        } catch (error) {
            showErrorAlert('editar');
        }
    }
}

const handleDelete = async () => {
    const result = await Swal.fire({
        title: '¿Eliminar tipo?',
        text: `Estás por eliminar: ${modelValue.value.concat}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
    });

    if (result.isConfirmed) {
        try {
            options.value = options.value.filter(item => item.id !== modelValue.value.id);
            modelValue.value = {};
            Swal.fire('Eliminado!', 'El tipo fue eliminado', 'success');
        } catch (error) {
            showErrorAlert('eliminar');
        }
    }
};

const showErrorAlert = (action: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${action} el tipo`,
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium'
        }
    })
}

const retrieveFromApi = async () => {
    try {
        const response = await $fetch<any>("api/identification_types/", {
            query: { search: query.value }
        });
        options.value = response.results;
    } catch (error) {
        console.error("Error al recuperar los datos", error);
    }
};

watch(query, retrieveFromApi);
</script>