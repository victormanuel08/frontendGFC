<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <label class="block">Filtro de Calendario Tributario:</label>
            <!-- Icono Agregar -->
            <button @click="handleAdd" class="p-1 text-gray-500 hover:text-green-600 transition-colors"
                title="Agregar nuevo filtro">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            <!-- Icono Editar -->
            <button v-if="modelValue?.id" @click="handleEdit"
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Editar filtro seleccionado">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>

            <!-- Icono Eliminar -->
            <button v-if="modelValue?.id" @click="handleDelete"
                class="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Eliminar filtro seleccionado">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>

        <div class="flex gap-2">
            <USelectMenu v-model="modelValue" option-attribute="name" :options="options" :searchable="true"
                v-model:query="query" :clearSearchOnClose="true" class="flex-1">
            </USelectMenu>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';

const options = ref<any[]>([]);
const query = ref("");
const modelValue = defineModel<any>({default: () => ({})});

const LENGTH_CHOICES = [
    { value: 0, label: 'Cero' },
    { value: 1, label: 'Uno' },
    { value: 2, label: 'Dos' }
];

const generateAutoName = (lengthValue: number, dv: boolean, id_number: boolean) => {
    const lengthText = LENGTH_CHOICES.find(choice => choice.value === lengthValue)?.label || '';
    const parts = [lengthText];
    
    if (dv) parts.push('DV');
    if (id_number) parts.push('ID');
    
    return parts.join(' + ');
};

onMounted(() => {
    retrieveFromApi();
});

const showEditorModal = async (isEdit: boolean = false) => {
    const currentItem = modelValue.value;
    
    const { value: formValues } = await Swal.fire({
        title: `<span class="text-lg font-semibold text-gray-800">${isEdit ? 'Editar' : 'Nuevo'} Filtro de Calendario Tributario</span>`,
        html: `
      <div class="space-y-4">
        <div class="p-3 bg-gray-50 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre generado automáticamente:</label>
          <div id="autoName" class="text-sm text-gray-900 font-semibold">
            ${isEdit ? generateAutoName(currentItem.length, currentItem.dv, currentItem.id_number) : 'Uno'}
          </div>
          <input type="hidden" id="name" value="${isEdit ? currentItem.name : generateAutoName(1, false, false)}">
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Longitud</label>
          <select id="length" 
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white border-gray-300">
            ${LENGTH_CHOICES.map(choice => `
              <option value="${choice.value}" ${(!isEdit && choice.value === 1) || (isEdit && currentItem.length === choice.value) ? 'selected' : ''}>
                ${choice.label}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center">
            <input id="dv" 
                   type="checkbox"
                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                   ${isEdit && currentItem.dv ? 'checked' : ''}>
            <label for="dv" class="ml-2 block text-sm text-gray-600">Incluir DV</label>
          </div>
          
          <div class="flex items-center">
            <input id="id_number" 
                   type="checkbox"
                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                   ${isEdit && currentItem.id_number ? 'checked' : ''}>
            <label for="id_number" class="ml-2 block text-sm text-gray-600">Incluir Número de Identificación</label>
          </div>
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
        didOpen: () => {
            const updateAutoName = () => {
                const length = parseInt((document.getElementById('length') as HTMLSelectElement).value);
                const dv = (document.getElementById('dv') as HTMLInputElement).checked;
                const id_number = (document.getElementById('id_number') as HTMLInputElement).checked;
                const autoNameElement = document.getElementById('autoName');
                const nameInput = document.getElementById('name') as HTMLInputElement;
                
                if (autoNameElement && nameInput) {
                    const generatedName = generateAutoName(length, dv, id_number);
                    autoNameElement.textContent = generatedName;
                    nameInput.value = generatedName;
                }
            };

            document.getElementById('length')?.addEventListener('change', updateAutoName);
            document.getElementById('dv')?.addEventListener('change', updateAutoName);
            document.getElementById('id_number')?.addEventListener('change', updateAutoName);

            updateAutoName();
        },
        preConfirm: () => {
            const length = parseInt((document.getElementById('length') as HTMLSelectElement)?.value || 1);
            const dv = (document.getElementById('dv') as HTMLInputElement)?.checked;
            const id_number = (document.getElementById('id_number') as HTMLInputElement)?.checked;
            const name = (document.getElementById('name') as HTMLInputElement)?.value;

            return { 
                name, 
                length, 
                dv, 
                id_number 
            };
        }
    });

    return formValues;
};

const handleAdd = async () => {
    const formValues = await showEditorModal();
    
    if (formValues) {
        try {
            const newItem = await $fetch('api/taxcalendar_filter/', {
                method: 'POST',
                body: {
                    name: formValues.name,
                    length: formValues.length,
                    dv: formValues.dv,
                    id_number: formValues.id_number
                }
            });

            options.value = await retrieveFromApi();
            modelValue.value = newItem;

            Swal.fire({
                icon: 'success',
                title: '¡Creado!',
                text: 'El filtro se creó correctamente',
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
};

const handleEdit = async () => {
    const formValues = await showEditorModal(true);
    
    if (formValues) {
        try {
            const updatedItem = await $fetch(`api/taxcalendar_filter/${modelValue.value.id}/`, {
                method: 'PUT',
                body: {
                    name: formValues.name,
                    length: formValues.length,
                    dv: formValues.dv,
                    id_number: formValues.id_number
                }
            });

            options.value = await retrieveFromApi();
            modelValue.value = updatedItem;

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El filtro se actualizó correctamente',
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
};

const handleDelete = async () => {
    const result = await Swal.fire({
        title: '¿Eliminar filtro?',
        text: `Estás por eliminar: ${modelValue.value.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
    });

    if (result.isConfirmed) {
        try {
            await $fetch(`api/taxcalendar_filter/${modelValue.value.id}/`, {
                method: 'DELETE'
            });
            
            options.value = await retrieveFromApi();
            modelValue.value = {};
            
            Swal.fire('Eliminado!', 'El filtro fue eliminado', 'success');
        } catch (error) {
            showErrorAlert('eliminar');
        }
    }
};

const showErrorAlert = (action: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${action} el filtro`,
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium'
        }
    })
};

const retrieveFromApi = async () => {
    try {
        const response = await $fetch<any>("api/taxcalendar_filter/", {
            query: { search: query.value }
        });
        options.value = response.results;
        return options.value;
    } catch (error) {
        console.error("Error al recuperar los datos", error);
        return options.value;
    }
};

watch(query, retrieveFromApi);
</script>