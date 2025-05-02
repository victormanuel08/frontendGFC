<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label class="block">{{ props.labelpersonal }}</label>
      <!-- Botones CRUD -->
      <button v-if="props.icons" @click="handleAdd" class="p-1 text-gray-500 hover:text-green-600 transition-colors"
        title="Agregar nuevo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      <button v-if="modelValue?.id && props.icons" @click="handleEdit"
        class="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Editar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>

      <button v-if="modelValue?.id && props.icons" @click="handleDelete"
        class="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>

    <div class="flex gap-2">
      <USelectMenu v-model="modelValue" option-attribute="concat" :options="options" :searchable="true"
        v-model:query="query" :clearSearchOnClose="true" class="min-w-[300px] w-full" />
    </div>
    {{ }}
    <!-- Modal de Edición/Creación -->
    <UModal v-model="isModalOpen">
      <div class="p-4 bg-white rounded-lg space-y-4 max-h-[80vh] overflow-y-auto">
        <!-- Encabezado con botones -->
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-semibold">
            {{ isEditMode ? 'Editar' : 'Nuevo' }}
            <span v-if="formData.razon_social">{{ formData.razon_social }}</span>
            <span v-else>{{ formData.first_name }} {{ formData.last_name }}</span>
          </h3>

          <div class="flex gap-2">
            <!-- Botón RUT -->
            <UButton variant="soft" color="red" @click="openRutModal" :disabled="!formData.id">
              {{ formData.rut ? 'RUT' : 'Crear RUT' }}
            </UButton>

            <!-- Botón Archivos -->
            <UButton variant="soft" color="red" @click="openFilesModal" :disabled="!formData.id">
              Archivos
            </UButton>
          </div>
        </div>
        <!-- Sección de información básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>

            <SelectThirdTypes v-model="formData.type_full" class="w-full" />
          </div>

          <div>

            <SelectIdentificationTypes v-model="formData.id_type_full" class="w-full" />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Número de Identificación*</label>
            <UInput v-model="formData.id_number" type="number" placeholder="Ej: 123456789" class="w-full" />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Dígito de Verificación</label>
            <UInput v-model="formData.id_verified" type="number" placeholder="Ej: 5" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Primer Nombre</label>
            <UInput v-model="formData.first_name" placeholder="Ej: Juan" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Segundo Nombre</label>
            <UInput v-model="formData.second_name" placeholder="Ej: Carlos" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Primer Apellido*</label>
            <UInput v-model="formData.last_name" placeholder="Ej: Pérez" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Segundo Apellido</label>
            <UInput v-model="formData.second_last_name" placeholder="Ej: Gómez" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Fecha de Nacimiento</label>
            <UInput v-model="formData.date_birth" type="date" class="w-full" />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Teléfono</label>
            <UInput v-model="formData.phone" placeholder="Ej: 3001234567" class="w-full" />
          </div>

          <div v-if="formData.type_full.name === 'Persona natural'">
            <label class="block text-sm text-gray-600 mb-1">Tarjeta Profesional</label>
            <UInput v-model="formData.tp" placeholder="Ej: TP12345" class="w-full" />
          </div>
        </div>

        <!-- Sección de relaciones -->
        <div class="grid grid-cols-1 gap-4 mt-4">
          <div>

            <SelectSoftware v-model="formData.software_full" class="w-full" />
          </div>

          <div>

            <SelectMultiEmail v-model="formData.emails" class="w-full" />
          </div>

          <div>

            <SelectThird v-model="formData.parent_full" class="w-full" placeholder="Contador Asignado"
              :labelpersonal="'Contador Responsable'" :icons="false" />
          </div>
        </div>

        <ModalRut v-model="isRutModalOpen" :third-id="formData.id" @saved="handleRutSaved" />

        <ModalFiles v-model="isFilesModalOpen" :third-id="formData.id" @uploaded="handleFilesUploaded" :ui="{
          width: 'w-5/3',
          container: 'max-w-[1500px]', // o cualquier valor específico en píxeles
          padding: 'p-6'
        }" />

        <div class="flex justify-end gap-2 mt-4">
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

interface Third {
  id?: number;
  type_full?: any;
  id_type_full?: any;
  software_full?: {
    id?: number;
    name?: string;
    version?: string;
    ip?: string;
    port?: number;
    route?: string;
    user?: string;
    password?: string;
    token?: string;
    vpn?: number;
    vpn_full?: any;
    displayText?: string;
  };
  parent_full?: any;
  first_name?: string;
  second_name?: string;
  last_name?: string;
  second_last_name?: string;
  id_number?: number;
  id_verified?: number;
  tp?: string;
  phone?: string;
  date_birth?: string;
  emails?: any[];
  concat?: string;
  rut?: {
    razon_social?: string;
  };
}

const props = defineProps({
  modelValue: {
    type: Object,
  },
  labelpersonal: {
    type: String,
    default: 'Tercero',
  },
  icons: {
    type: Boolean,
    default: true,
  }
});
const options = ref<Third[]>([]);
const query = ref("");
const modelValue = defineModel<any>({
  default: () => ({}),
  set(value) {
    if (!value) return {};
    if (typeof value === 'object') return { ...value };
    return { id: value };
  }
});
const isModalOpen = ref(false);
const isEditMode = ref(false);

// Agrega estos estados al setup
const isRutModalOpen = ref(false);
const isFilesModalOpen = ref(false);

const openRutModal = () => {
  if (!formData.value.id) {
    Swal.fire({
      icon: 'warning',
      title: 'Primero guarde el tercero',
      text: 'Debe crear el tercero antes de gestionar el RUT',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }
  isRutModalOpen.value = true;
};

const openFilesModal = () => {
  if (!formData.value.id) {
    Swal.fire({
      icon: 'warning',
      title: 'Primero guarde el tercero',
      text: 'Debe crear el tercero antes de subir archivos',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }
  isFilesModalOpen.value = true;
};

// Métodos para manejar eventos de los modales
const handleRutSaved = (rutData) => {
  formData.value.rut = rutData;
  formData.value.razon_social = rutData.razon_social;
  Swal.fire({
    icon: 'success',
    title: 'RUT guardado',
    confirmButtonColor: '#3b82f6'
  });
};

const handleFilesUploaded = () => {
  Swal.fire({
    icon: 'success',
    title: 'Archivos subidos',
    confirmButtonColor: '#3b82f6'
  });
};

const formData = ref<Third>({
  type_full: {},
  id_type_full: {},
  software_full: {},
  parent_full: {},
  first_name: '',
  second_name: '',
  last_name: '',
  second_last_name: '',
  razon_social: '',
  id_number: undefined,
  id_verified: undefined,
  tp: '',
  phone: '',
  date_birth: '',
  emails: []
});

// Watchers para las relaciones
watch(
  () => formData.value.type_full,
  (newVal) => {
    if (newVal?.id) {
      console.log('Tipo de tercero seleccionado:', newVal);
    }
  },
  { deep: true }
);

watch(
  () => formData.value.id_type_full,
  (newVal) => {
    if (newVal?.id) {
      console.log('Tipo de identificación seleccionado:', newVal);
    }
  },
  { deep: true }
);

watch(
  () => formData.value.software_full,
  (newVal) => {
    if (newVal?.id) {
      console.log('Software seleccionado:', newVal);
      // Actualizar el campo simple software si es necesario
      formData.value.software = newVal.id;
    }
  },
  { deep: true }
);

watch(
  () => formData.value.parent_full,
  (newVal) => {
    if (newVal?.id) {
      console.log('Tercero padre seleccionado:', newVal);
    }
  },
  { deep: true }
);

// Carga inicial de datos
onMounted(async () => {
  await retrieveFromApi();
});

const handleAdd = () => {
  isEditMode.value = false;
  formData.value = {
    type_full: {},
    id_type_full: {},
    software_full: {},
    parent_full: {},
    first_name: '',
    second_name: '',
    last_name: '',
    second_last_name: '',
    razon_social: '',
    id_number: undefined,
    id_verified: undefined,
    tp: '',
    phone: '',
    date_birth: '',
    emails: []
  };
  isModalOpen.value = true;
};

const handleEdit = async () => {
  isEditMode.value = true;

  // Función para normalizar emails
  const normalizeEmails = (emails) => {
    if (!emails) return [];
    return emails.map(email => ({
      id: email.id,
      email: email.email,
      displayText: email.email // o cualquier campo que uses para mostrar
    }));
  };

  // Función para normalizar parent
  const normalizeParent = (parent) => {
    if (!parent) return null;
    return {
      id: parent.id,
      concat: parent.full_name || `${parent.first_name || ''} ${parent.last_name || ''}`,
      // Incluye todos los campos que tu componente SelectThird pueda necesitar
      type_full: parent.type_full,
      id_type_full: parent.id_type_full,
      first_name: parent.first_name,
      last_name: parent.last_name,
      id_number: parent.id_number
    };
  };

  // Función para normalizar software
  const normalizeSoftware = (software) => {
    if (!software) return {};
    return {
      id: software.id,
      name: software.name || '',
      version: software.version || '',
      displayText: software.displayText || `${software.name || ''} v${software.version || ''}`
    };
  };

  // Precargar todos los datos del modelo
  formData.value = {
    id: modelValue.value.id,
    type_full: modelValue.value.type_full ? { ...modelValue.value.type_full } : {},
    id_type_full: modelValue.value.id_type_full ? { ...modelValue.value.id_type_full } : {},
    software_full: normalizeSoftware(modelValue.value.software_full),
    parent_full: normalizeParent(modelValue.value.parent_full),
    first_name: modelValue.value.first_name || '',
    second_name: modelValue.value.second_name || '',
    last_name: modelValue.value.last_name || '',
    second_last_name: modelValue.value.second_last_name || '',
    razon_social: modelValue.value.rut?.razon_social || '',
    id_number: modelValue.value.id_number,
    id_verified: modelValue.value.id_verified,
    tp: modelValue.value.tp || '',
    phone: modelValue.value.phone || '',
    date_birth: modelValue.value.date_birth || null,
    emails: normalizeEmails(modelValue.value.emails_full || [])
  };

  console.log('Datos precargados para edición:', JSON.parse(JSON.stringify(formData.value)));
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Verifique todos los campos obligatorios',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  try {
    const payload = {
      type: formData.value.type_full?.id,
      id_type: formData.value.id_type_full?.id,
      software: formData.value.software_full?.id,
      parent: formData.value.parent_full?.id || null,
      first_name: formData.value.first_name,
      second_name: formData.value.second_name,
      last_name: formData.value.last_name,
      second_last_name: formData.value.second_last_name,
      id_number: formData.value.id_number,
      id_verified: formData.value.id_verified,
      tp: formData.value.tp,
      phone: formData.value.phone,
      date_birth: formData.value.date_birth || null,
      email: Array.isArray(formData.value.emails)
        ? formData.value.emails.map(e => e?.id).filter(id => id !== undefined)
        : [],
    };

    console.log('Enviando payload:', payload);

    const url = formData.value.id ? `/api/third/${formData.value.id}/` : '/api/third/';
    const method = formData.value.id ? 'PUT' : 'POST';

    const { data, error } = await useFetch(url, {
      method,
      body: payload
    });

    console.log('Respuesta completa:', { data: data.value, error: error.value });


    if (error.value) {
      console.error('Error del servidor:', error.value);
      throw error.value;
    }

    if (data.value) {
      await retrieveFromApi();
      isModalOpen.value = false;
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `Tercero ${isEditMode.value ? 'actualizado' : 'creado'} correctamente`,
        confirmButtonColor: '#3b82f6'
      });
    }
  } catch (error) {
    console.error("Error guardando tercero:", error);
    showErrorAlert('guardar cambios');
  }
};

const validateForm = () => {
  const errors = [];

  if (!formData.value.type_full?.id) {
    errors.push('El tipo de tercero es requerido');
  }

  if (!formData.value.id_type_full?.id) {
    errors.push('El tipo de identificación es requerido');
  }



  if (!formData.value.id_number) {
    errors.push('El número de identificación es requerido');
  }

  if (errors.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      html: `<div class="text-left text-sm">${errors.map(e => `• ${e}`).join('<br>')}</div>`,
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    });
    return false;
  }
  return true;
};

const handleDelete = async () => {
  const result = await Swal.fire({
    title: '¿Eliminar Tercero?',
    html: `Estás por eliminar: <b>${modelValue.value.concat}</b>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar!',
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'px-4 py-2 text-sm font-medium',
      cancelButton: 'px-4 py-2 text-sm font-medium'
    }
  });

  if (result.isConfirmed) {
    try {
      await useFetch(`/api/third/${modelValue.value.id}/`, {
        method: 'DELETE'
      });

      options.value = options.value.filter(item => item.id !== modelValue.value.id);
      modelValue.value = {};

      Swal.fire({
        title: '¡Eliminado!',
        text: 'El tercero fue eliminado',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      });
    } catch (error) {
      console.error("Error eliminando tercero:", error);
      showErrorAlert('eliminar');
    }
  }
};

const retrieveFromApi = async () => {
  try {
    const response = await $fetch<{ results: Third[] }>("api/third/", {
      query: {
        search: query.value,
        expand: 'type_full,id_type_full,software_full,parent_full,emails',
        fields: 'id,type_full,id_type_full,software_full,parent_full,first_name,second_name,last_name,second_last_name,id_number,id_verified,tp,phone,date_birth,emails,concat'
      }
    });

    options.value = response.results.map(item => ({
      ...item,
      concat: item.last_name
        ? `${item.first_name || ''} ${item.last_name || ''} (${item.id_number || ''})`
        : `${item.rut?.razon_social || ''} (${item.id_number || ''})`,
      software_full: item.software_full ? {
        ...item.software_full,
        displayText: `${item.software_full.name || ''} v${item.software_full.version || ''}`
      } : undefined
    }));

    console.log('Terceros cargados:', options.value);
  } catch (error) {
    console.error("Error cargando terceros:", error);
    showErrorAlert('cargar terceros');
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