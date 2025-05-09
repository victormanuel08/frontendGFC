<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label class="block">{{ props.labelpersonal }}</label>
      
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
        option-attribute="name"
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
        <h3 class="text-lg font-semibold">{{ isEditMode ? 'Editar' : 'Nuevo' }} Impuesto</h3>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nombre *</label>
          <UInput 
            v-model="formDataTax.name" 
            placeholder="Nombre del impuesto"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Código (2 caracteres) *</label>
          <UInput 
            v-model="formDataTax.code" 
            placeholder="Código"
            maxlength="2"
            class="w-full uppercase"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Descripción *</label>
          <UTextarea 
            v-model="formDataTax.description" 
            placeholder="Descripción del impuesto"
            class="w-full"
          />
        </div>

        <div>

          <SelectTaxCalendarFilter v-model="formDataTax.taxcalendar_filter_full" />
        </div>

        <div>

          <SelectExpirations v-model="formDataTax.expirations" multiple />
        </div>

        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="isModalOpen = false">Cancelar</UButton>
          <UButton color="primary" @click="handleSubmitTax()">
            {{ isEditMode ? 'Guardar cambios' : 'Crear impuesto' }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';

interface Tax {
  id?: number;
  name: string;
  code: string;
  description: string;
  taxcalendar_filter?: { id: number } | null;
  taxcalendar_filter_full?: { id: number; name: string } | null;
  expirations: { id: number }[];
  created_at?: string;
  updated_at?: string;
}

const props = defineProps({
  labelpersonal: {
    type: String,
    default: 'Impuesto',
  }
});

const options = ref<Tax[]>([]);
const query = ref("");
const modelValue = defineModel<Tax | null>({ default: null });
const isModalOpen = ref(false);
const isEditMode = ref(false);

const formDataTax = ref<Tax>({
  name: '',
  code: '',
  description: '',
  taxcalendar_filter: null,
  taxcalendar_filter_full: null,
  expirations: []
});

// Carga inicial de datos
onMounted(async () => {
  await retrieveFromApi();
});

const handleAdd = () => {
  isEditMode.value = false;
  formDataTax.value = {
    name: '',
    code: '',
    description: '',
    taxcalendar_filter: null,
    taxcalendar_filter_full: null,
    expirations: []
  };
  isModalOpen.value = true;
};

const handleEdit = () => {
  if (!modelValue.value?.id) return;
  
  isEditMode.value = true;
  formDataTax.value = {
    ...modelValue.value,
    taxcalendar_filter: modelValue.value.taxcalendar_filter,
    taxcalendar_filter_full: modelValue.value.taxcalendar_filter_full,
    expirations: [...modelValue.value.expirations]
  };
  isModalOpen.value = true;
};

const handleSubmitTax = async () => {
  if (!validateForm()) {
    showValidationError();
    return;
  }

  try {
    const payload = {
      ...formDataTax.value,
      taxcalendar_filter: formDataTax.value.taxcalendar_filter_full?.id || null,
      expirations: formDataTax.value.expirations.map(e => e.id)
    };

    const url = formDataTax.value.id ? `/api/taxes/${formDataTax.value.id}/` : '/api/taxes/';
    const method = formDataTax.value.id ? 'PUT' : 'POST';

    const { data, error } = await useFetch<Tax>(url, {
      method,
      body: payload
    });

    if (error.value) throw error.value;
    
    await retrieveFromApi();
    
    if (data.value) {
      modelValue.value = data.value;
    }
    
    isModalOpen.value = false;
    
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `Impuesto ${isEditMode.value ? 'actualizado' : 'creado'} correctamente`,
      confirmButtonColor: '#3b82f6',
      timer: 2000
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al procesar la solicitud',
      confirmButtonColor: '#3b82f6'
    });
  }
};

const handleDelete = async () => {
  if (!modelValue.value?.id) return;

  const result = await Swal.fire({
    title: '¿Eliminar Impuesto?',
    html: `Estás por eliminar: <b>${modelValue.value.name}</b>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await useFetch(`/api/taxes/${modelValue.value.id}/`, {
        method: 'DELETE'
      });
      
      options.value = options.value.filter(t => t.id !== modelValue.value?.id);
      modelValue.value = null;
      
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El impuesto fue eliminado correctamente',
        confirmButtonColor: '#3b82f6',
        timer: 1500
      });
    } catch (error) {
      console.error("Error eliminando:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el impuesto',
        confirmButtonColor: '#3b82f6'
      });
    }
  }
};

const validateForm = () => {
  return (
    formDataTax.value.name.trim().length >= 3 &&
    formDataTax.value.code.trim().length === 2 &&
    formDataTax.value.description.trim().length > 0
  );
};

const showValidationError = () => {
  Swal.fire({
    icon: 'error',
    title: 'Campos inválidos',
    html: `
      <div class="text-left text-sm">
        <p>• Nombre debe tener al menos 3 caracteres</p>
        <p>• Código debe tener exactamente 2 caracteres</p>
        <p>• Descripción es requerida</p>
      </div>
    `,
    confirmButtonColor: '#3b82f6'
  });
};

const retrieveFromApi = async () => {
  try {
    const { data, error } = await useFetch<{ results: Tax[] }>("/api/taxes/", {
      query: { search: query.value }
    });
    
    if (error.value) throw error.value;
    
    if (data.value) {
      options.value = data.value.results;
      // Sincronizar selección si existe
      if (modelValue.value?.id) {
        modelValue.value = data.value.results.find(t => t.id === modelValue.value?.id) || null;
      }
    }
  } catch (error) {
    console.error("Error cargando impuestos:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error cargando datos',
      confirmButtonColor: '#3b82f6'
    });
  }
};

watch(query, retrieveFromApi);
</script>