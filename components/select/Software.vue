<template>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <label class="block">Software:</label>
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
          option-attribute="displayText"
          :options="options"
          :searchable="true"
          v-model:query="query"
          :clearSearchOnClose="true"
          class="min-w-[300px] w-full"
        />
      </div>
  
      <!-- Modal de Edición/Creación -->
      <UModal v-model="isModalOpen">
        <div class="p-4 bg-white rounded-lg space-y-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold">{{ isEditMode ? 'Editar' : 'Nuevo' }} Software</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nombre</label>
              <UInput 
                v-model="formData.name" 
                placeholder="Ej: Sistema ERP"
                class="w-full"
              />
            </div>
  
            <div>
              <label class="block text-sm text-gray-600 mb-1">Versión</label>
              <UInput 
                v-model="formData.version" 
                placeholder="Ej: 2.5.1"
                class="w-full"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm text-gray-600 mb-1">Ruta</label>
            <UInput 
              v-model="formData.route" 
              placeholder="Ej: /api/erp"
              class="w-full"
            />
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Dirección IP</label>
              <UInput 
                v-model="formData.ip" 
                placeholder="Ej: 192.168.1.100"
                class="w-full"
              />
            </div>
  
            <div>
              <label class="block text-sm text-gray-600 mb-1">Puerto</label>
              <UInput 
                v-model="formData.port" 
                type="number"
                placeholder="Ej: 8080"
                class="w-full"
              />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Usuario</label>
              <UInput 
                v-model="formData.user" 
                placeholder="Ej: admin"
                class="w-full"
              />
            </div>
  
            <div>
              <label class="block text-sm text-gray-600 mb-1">Contraseña</label>
              <UInput 
                v-model="formData.password" 
                type="password"
                placeholder="••••••••"
                class="w-full"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm text-gray-600 mb-1">Token</label>
            <UInput 
              v-model="formData.token" 
              placeholder="Token de autenticación"
              class="w-full"
            />
          </div>
  
          <div>
            <SelectVpn 
              v-model="formData.vpn_full"
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
  
  interface VPN {
    id: number;
    name: string;
    ip: string;
    port: number;
    displayText?: string;
  }
  
  interface Software {
    id?: number;
    name: string;
    version: string;
    route: string;
    ip: string;
    port: number;
    user: string;
    password: string;
    token: string;
    vpn: number;
    vpn_full?: VPN;
    displayText?: string;
  }
  
  const options = ref<Software[]>([]);
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
  
  const formData = ref<Software>({
    name: '',
    version: '',
    route: '',
    ip: '',
    port: 0,
    user: '',
    password: '',
    token: '',
    vpn: 0,
    vpn_full: undefined
  });
  
  // Sincronizar vpn_full con vpn
  watch(() => formData.value.vpn_full, (newVal) => {
    if (newVal?.id) {
      formData.value.vpn = newVal.id;
    }
  }, { deep: true });
  
  // Cargar opciones al montar
  onMounted(async () => {
    await retrieveFromApi();
  });
  
  const handleAdd = () => {
    isEditMode.value = false;
    formData.value = {
      name: '',
      version: '',
      route: '',
      ip: '',
      port: 0,
      user: '',
      password: '',
      token: '',
      vpn: 0,
      vpn_full: undefined
    };
    isModalOpen.value = true;
  };
  
  const handleEdit = () => {
    isEditMode.value = true;
    formData.value = {
      ...JSON.parse(JSON.stringify(modelValue.value)),
      vpn_full: modelValue.value.vpn_full 
        ? { ...modelValue.value.vpn_full } 
        : undefined
    };
    
    if (formData.value.vpn_full) {
      formData.value.vpn = formData.value.vpn_full.id;
    }
    
    isModalOpen.value = true;
  };
  
  const validateForm = () => {
    const errors = [];
    
    if (!formData.value.name || formData.value.name.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }
    
    if (!formData.value.version || formData.value.version.trim().length < 1) {
      errors.push('La versión es requerida');
    }
    
    if (!formData.value.route || formData.value.route.trim().length < 1) {
      errors.push('La ruta es requerida');
    }
    
    if (!formData.value.ip || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(formData.value.ip)) {
      errors.push('La dirección IP no es válida');
    }
    
    if (!formData.value.port || formData.value.port < 1 || formData.value.port > 65535) {
      errors.push('El puerto debe estar entre 1 y 65535');
    }
    
    if (!formData.value.user || formData.value.user.trim().length < 1) {
      errors.push('El usuario es requerido');
    }
    
    if (!formData.value.password || formData.value.password.trim().length < 1) {
      errors.push('La contraseña es requerida');
    }
    
    if (!formData.value.token || formData.value.token.trim().length < 1) {
      errors.push('El token es requerido');
    }
    
    if (!formData.value.vpn_full?.id && !formData.value.vpn) {
      errors.push('Debe seleccionar una VPN');
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
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      if (formData.value.vpn_full) {
        formData.value.vpn = formData.value.vpn_full.id;
      }
  
      const payload = {
        name: formData.value.name,
        version: formData.value.version,
        route: formData.value.route,
        ip: formData.value.ip,
        port: formData.value.port,
        user: formData.value.user,
        password: formData.value.password,
        token: formData.value.token,
        vpn: formData.value.vpn_full?.id || formData.value.vpn
      };
  
      const url = formData.value.id ? `/api/software/${formData.value.id}/` : '/api/software/';
      const method = formData.value.id ? 'PUT' : 'POST';
  
      const { data } = await useFetch(url, {
        method,
        body: payload
      });
  
      if (data.value) {
        await retrieveFromApi();
        isModalOpen.value = false;
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Software ${isEditMode.value ? 'actualizado' : 'creado'} correctamente`,
          confirmButtonColor: '#3b82f6'
        });
      }
    } catch (error) {
      console.error("Error guardando software:", error);
      showErrorAlert('guardar cambios');
    }
  };
  
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar Software?',
      html: `Estás por eliminar: <b>${modelValue.value.displayText || modelValue.value.name}</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    });
  
    if (result.isConfirmed) {
      try {
        await useFetch(`/api/software/${modelValue.value.id}/`, {
          method: 'DELETE'
        });
        
        options.value = options.value.filter(item => item.id !== modelValue.value.id);
        modelValue.value = {};
        
        Swal.fire('¡Eliminado!', 'El software fue eliminado', 'success');
      } catch (error) {
        console.error("Error eliminando software:", error);
        showErrorAlert('eliminar');
      }
    }
  };
  
  const retrieveFromApi = async () => {
    try {
      const response = await $fetch<{ results: Software[] }>("api/software/", {
        query: { 
          search: query.value,
          expand: 'vpn_full'
        }
      });
      
      options.value = response.results.map(item => ({
        ...item,
        displayText: `${item.name} v${item.version} (${item.ip}:${item.port})`
      }));
  
      // Si el modelValue tiene solo un ID, buscar el objeto completo
      if (modelValue.value?.id && !modelValue.value.name) {
        const found = options.value.find(opt => opt.id === modelValue.value.id);
        if (found) {
          modelValue.value = found;
        }
      }
    } catch (error) {
      console.error("Error cargando software:", error);
      showErrorAlert('cargar software');
    }
  };
  
  const showErrorAlert = (action: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: `<div class="text-sm">No se pudo ${action}</div>`,
      confirmButtonColor: '#3b82f6'
    });
  };
  
  watch(query, retrieveFromApi);
  </script>