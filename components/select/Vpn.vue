<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <label class="block">Conexión VPN:</label>
            <!-- Icono Agregar -->
            <button @click="handleAdd" class="p-1 text-gray-500 hover:text-green-600 transition-colors"
                title="Agregar nueva VPN">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            <!-- Icono Editar -->
            <button v-if="modelValue?.id" @click="handleEdit"
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Editar VPN seleccionada">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>

            <!-- Icono Eliminar -->
            <button v-if="modelValue?.id" @click="handleDelete"
                class="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Eliminar VPN seleccionada">
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

const options = ref<any[]>([]);
const query = ref("");
const modelValue = defineModel<any>({default: () => ({})});

onMounted(() => {
    retrieveFromApi();
});

const showEditorModal = async (isEdit: boolean = false) => {
    const currentItem = modelValue.value;
    
    const { value: formValues } = await Swal.fire({
        title: `<span class="text-lg font-semibold text-gray-800">${isEdit ? 'Editar' : 'Nueva'} Conexión VPN</span>`,
        html: `
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nombre</label>
          <input id="name" 
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400 border-gray-300" 
                 value="${isEdit ? currentItem.name : ''}"
                 placeholder="Ej: VPN Oficina Central"
                 maxlength="100">
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Dirección IP</label>
            <input id="ip" 
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${isEdit ? currentItem.ip : ''}"
                   placeholder="Ej: 192.168.1.1">
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 mb-1">Puerto</label>
            <input id="port" 
                   type="number"
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${isEdit ? currentItem.port : ''}"
                   placeholder="Ej: 1194"
                   min="1"
                   max="65535">
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Usuario</label>
          <input id="user" 
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400 border-gray-300" 
                 value="${isEdit ? currentItem.user : ''}"
                 placeholder="Ej: admin"
                 maxlength="100">
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Contraseña</label>
          <input id="password" 
                 type="password"
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400 border-gray-300" 
                 value="${isEdit ? currentItem.password : ''}"
                 placeholder="••••••••"
                 maxlength="100">
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Token</label>
          <input id="token" 
                 class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400 border-gray-300" 
                 value="${isEdit ? currentItem.token : ''}"
                 placeholder="Token de autenticación"
                 maxlength="100">
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
            const name = (document.getElementById('name') as HTMLInputElement)?.value.trim()
            const ip = (document.getElementById('ip') as HTMLInputElement)?.value.trim()
            const port = (document.getElementById('port') as HTMLInputElement)?.value.trim()
            const user = (document.getElementById('user') as HTMLInputElement)?.value.trim()
            const password = (document.getElementById('password') as HTMLInputElement)?.value.trim()
            const token = (document.getElementById('token') as HTMLInputElement)?.value.trim()

            let error = ''
            if (!name || name.length < 3) error += 'El nombre debe tener al menos 3 caracteres<br>'
            if (!ip || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) error += 'La dirección IP no es válida<br>'
            if (!port || parseInt(port) < 1 || parseInt(port) > 65535) error += 'El puerto debe estar entre 1 y 65535<br>'
            if (!user || user.length < 1) error += 'El usuario es requerido<br>'
            if (!password || password.length < 1) error += 'La contraseña es requerida<br>'
            if (!token || token.length < 1) error += 'El token es requerido'

            if (error) Swal.showValidationMessage(error)
            return { name, ip, port: parseInt(port), user, password, token }
        },
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton()
            const inputs = Swal.getPopup().querySelectorAll('input')
            
            const validateInputs = () => {
                const nameValid = inputs[0].value.trim().length >= 3
                const ipValid = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(inputs[1].value.trim())
                const portValid = inputs[2].value.trim() && 
                                 parseInt(inputs[2].value.trim()) >= 1 && 
                                 parseInt(inputs[2].value.trim()) <= 65535
                const userValid = inputs[3].value.trim().length >= 1
                const passwordValid = inputs[4].value.trim().length >= 1
                const tokenValid = inputs[5].value.trim().length >= 1
                
                confirmButton.disabled = !(nameValid && ipValid && portValid && userValid && passwordValid && tokenValid)
            }

            validateInputs()
            
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
            const newItem = await $fetch('api/vpn/', {
                method: 'POST',
                body: {
                    name: formValues.name,
                    ip: formValues.ip,
                    port: formValues.port,
                    user: formValues.user,
                    password: formValues.password,
                    token: formValues.token
                }
            });

            options.value = await retrieveFromApi();
            modelValue.value = newItem;

            Swal.fire({
                icon: 'success',
                title: '¡Creado!',
                text: 'La conexión VPN se creó correctamente',
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
            const updatedItem = await $fetch(`api/vpn/${modelValue.value.id}/`, {
                method: 'PUT',
                body: {
                    name: formValues.name,
                    ip: formValues.ip,
                    port: formValues.port,
                    user: formValues.user,
                    password: formValues.password,
                    token: formValues.token
                }
            });

            options.value = await retrieveFromApi();
            modelValue.value = updatedItem;

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'La conexión VPN se editó correctamente',
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
        title: '¿Eliminar conexión VPN?',
        text: `Estás por eliminar: ${modelValue.value.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
    });

    if (result.isConfirmed) {
        try {
            await $fetch(`api/vpn/${modelValue.value.id}/`, {
                method: 'DELETE'
            });
            
            options.value = await retrieveFromApi();
            modelValue.value = {};
            
            Swal.fire('Eliminado!', 'La conexión VPN fue eliminada', 'success');
        } catch (error) {
            showErrorAlert('eliminar');
        }
    }
};

const showErrorAlert = (action: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${action} la conexión VPN`,
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium'
        }
    })
}

const retrieveFromApi = async () => {
    try {
        const response = await $fetch<any>("api/vpn/", {
            query: { search: query.value }
        });
        options.value = response.results.map((item: any) => ({
            ...item,

        }));
        return options.value;
    } catch (error) {
        console.error("Error al recuperar los datos", error);
        return options.value;
    }
};

watch(query, retrieveFromApi);
</script>