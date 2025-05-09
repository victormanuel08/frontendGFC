<template>
  <div class="rounded-3xl bg-white mb-2 mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Gestionar Grupos" class="mb-2" />
    <div class="">
      <UCard class="bg-white border-2 mt-2 border-blue-500 rounded-2xl shadow-sm">
        <div class="max-w-9xl mx-auto">
          <UCard class="border-0">
            <template #header>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <UButton 
                  variant="soft" 
                  @click="handleAdd"
                  class="flex-shrink-0"
                >
                  <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                  Nuevo Grupo
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput 
                    v-model="searchQuery" 
                    placeholder="Buscar ..."
                    icon="i-heroicons-magnifying-glass"
                    :ui="{ icon: { trailing: true } }"
                    class="flex-grow"
                  />
                  <UPagination 
                    v-model="currentPage" 
                    :page-count="pageSize"
                    :total="totalItems"
                    :ui="{ 
                      wrapper: 'flex items-center gap-1',
                      rounded: '!rounded-full min-w-[32px] justify-center'
                    }"
                  />
                </div>
              </div>
            </template>

            <div class="flex justify-center items-center py-6">
              <h3 v-if="groups.length === 0" class="text-gray-500">
                No se encontraron grupos
              </h3>
            </div>

            <div class="overflow-auto" v-if="groups.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="group in groups" :key="group.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">
                      <UInput 
                        v-model="group.name" 
                        @blur="saveName(group)"
                        class="w-full border-0 focus:ring-2 focus:ring-blue-500"
                        :ui="{ 
                          base: 'focus:ring-2 focus:ring-blue-500',
                          color: { white: { outline: 'focus:ring-2 focus:ring-blue-500' } }
                        }"
                      />
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <UTooltip text="Gestionar permisos">
                          <UButton 
                            color="blue" 
                            variant="ghost" 
                            icon="i-heroicons-lock-closed"
                            @click="openPermissionsModal(group)"
                            class="hover:bg-blue-50"
                            size="sm"
                          />
                        </UTooltip>
                        <UTooltip text="Eliminar">
                          <UButton 
                            color="red" 
                            variant="ghost" 
                            icon="i-heroicons-trash"
                            @click="deleteGroup(group)"
                            class="hover:bg-red-50"
                            size="sm"
                          />
                        </UTooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Modal de permisos mejorado -->
    <UModal v-model="isPermissionsModalOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center mt-10 ">
            <h2 class="text-xl font-bold text-gray-800">Permisos para: {{ selectedGroup?.name }}</h2>
            <UButton 
              color="gray" 
              variant="soft" 
              @click="closePermissionsModal"
              icon="i-heroicons-x-mark"
              class="hover:bg-gray-100"
            />
          </div>
        </template>

        <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <UCard 
            v-for="(permissions, entity) in permissionsByEntity" 
            :key="entity" 
            class="border border-gray-200 hover:border-blue-200 transition-colors"
          >
            <template #header>
              <h3 class="font-semibold text-lg text-gray-700">{{ entity }}</h3>
            </template>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="permission in permissions" :key="permission.id" class="flex items-center">
                <UCheckbox 
                  v-model="selectedGroup.permissionsTable[permission.id]" 
                  :label="getPermissionLabel(permission.name_es)"
                  :ui="{ 
                    label: 'text-sm font-medium text-gray-600',
                    container: 'flex items-center gap-2'
                  }"
                />
              </div>
            </div>
          </UCard>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <UButton 
              color="gray" 
              variant="soft" 
              @click="closePermissionsModal"
              icon="i-heroicons-arrow-uturn-left"
            >
              Volver sin guardar
            </UButton>
            <div class="flex gap-3 mb-10">
              <UButton 
                color="white" 
                @click="resetPermissions"
                icon="i-heroicons-arrow-path"
                :disabled="isSaving"
              >
                Restablecer
              </UButton>
              <UButton 
                color="blue" 
                @click="saveGroupPermissions"
                icon="i-heroicons-check"
                :loading="isSaving"
                :disabled="isSaving"
                
              >
                Guardar Cambios
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const groups = ref<any[]>([])
const permissionsByEntity = ref({} as Record<string, any>)
const allPermisions = ref([] as any[])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const isPermissionsModalOpen = ref(false)
const selectedGroup = ref<any>(null)
const originalPermissions = ref<any>(null)
const isSaving = ref(false)

const getPermissionLabel = (permissionName: string) => {
  const labels: Record<string, string> = {
    'add': 'Crear',
    'change': 'Editar',
    'delete': 'Eliminar',
    'view': 'Ver',
    'list': 'Listar',
    'import': 'Importar',
    'export': 'Exportar'
  }
  return labels[permissionName.split('_').pop()?.toLowerCase() || ''] || permissionName
}

const handleAdd = async () => {
  const { value: groupName } = await Swal.fire({
    title: 'Nuevo Grupo',
    input: 'text',
    inputLabel: 'Nombre del grupo',
    inputPlaceholder: 'Ingrese el nombre del grupo',
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe ingresar un nombre para el grupo'
      }
    }
  })

  if (groupName) {
    try {
      await $fetch('/api/auth/groups/', {
        method: 'POST',
        body: { name: groupName }
      })
      await fetchGroups()
      Swal.fire('¡Creado!', 'Grupo creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el grupo', 'error')
    }
  }
}

const saveName = async (group: any) => {
  if (!group.name.trim()) {
    Swal.fire('Advertencia', 'El nombre no puede estar vacío', 'warning')
    await fetchGroups()
    return
  }

  try {
    await $fetch(`/api/auth/groups/${group.id}/`, {
      method: 'PATCH',
      body: { name: group.name }
    })
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cambios guardados',
      showConfirmButton: false,
      timer: 1500
    })
  } catch (error) {
    Swal.fire('Error', 'No se pudo actualizar el grupo', 'error')
    await fetchGroups()
  }
}

const deleteGroup = async (group: any) => {
  const result = await Swal.fire({
    title: '¿Eliminar grupo?',
    text: `Estás por eliminar el grupo: ${group.name}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/auth/groups/${group.id}/`, { method: 'DELETE' })
      await fetchGroups()
      Swal.fire('¡Eliminado!', 'El grupo ha sido eliminado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el grupo', 'error')
    }
  }
}

const openPermissionsModal = (group: any) => {
  selectedGroup.value = JSON.parse(JSON.stringify(group))
  originalPermissions.value = JSON.parse(JSON.stringify(group.permissionsTable))
  isPermissionsModalOpen.value = true
}

const closePermissionsModal = () => {
  if (hasPermissionsChanged()) {
    Swal.fire({
      title: '¿Descartar cambios?',
      text: 'Tienes cambios sin guardar en los permisos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        isPermissionsModalOpen.value = false
      }
    })
  } else {
    isPermissionsModalOpen.value = false
  }
}

const hasPermissionsChanged = () => {
  if (!selectedGroup.value || !originalPermissions.value) return false
  return JSON.stringify(selectedGroup.value.permissionsTable) !== JSON.stringify(originalPermissions.value)
}

const resetPermissions = () => {
  if (selectedGroup.value && originalPermissions.value) {
    selectedGroup.value.permissionsTable = JSON.parse(JSON.stringify(originalPermissions.value))
  }
}

const saveGroupPermissions = async () => {
  if (!selectedGroup.value) return

  const permissions = Object.entries(selectedGroup.value.permissionsTable)
    .filter(([_, value]) => value)
    .map(([key, _]) => parseInt(key))

  isSaving.value = true

  try {
    await $fetch(`/api/auth/groups/${selectedGroup.value.id}/`, {
      method: 'PATCH',
      body: { permissions }
    })

    // Actualizar el grupo en la lista
    const index = groups.value.findIndex(g => g.id === selectedGroup.value.id)
    if (index !== -1) {
      groups.value[index].permissionsTable = {...selectedGroup.value.permissionsTable}
    }

    originalPermissions.value = {...selectedGroup.value.permissionsTable}
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Permisos actualizados',
      showConfirmButton: false,
      timer: 1500
    })
  } catch (error) {
    Swal.fire('Error', 'No se pudieron guardar los permisos', 'error')
  } finally {
    isSaving.value = false
  }
}

const fetchGroups = async () => {
  try {
    const response = await $fetch<any>('/api/auth/groups/', {
      query: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value,
        expand: 'permissions'
      }
    })
    // quietar el group que tenga name igual a "Todos"
    const filteredGroups = response.results.filter((group: any) => group.name !== 'Todos')
    groups.value = filteredGroups    
    totalItems.value = response.count
    
    // Inicializar permisos para cada grupo
    for (const group of groups.value) {
      group.permissionsTable = {}
      allPermisions.value.map((p: any) => p.id).forEach((permissionId: number) => {
        group.permissionsTable[permissionId] = group.permissions?.includes(permissionId) || false
      })
    }
  } catch (error) {
    console.error('Error fetching groups:', error)
    Swal.fire('Error', 'No se pudieron cargar los grupos', 'error')
  }
}

const fetchPermissions = async () => {
  try {
    const response = await $fetch<any>('/api/auth/permissions/', {
      query: { page_size: 1000 }
    })

    allPermisions.value = response.results
    response.results.forEach((permission: any) => {
      const entity_name = permission.entity_name
      if (entity_name in permissionsByEntity.value) {
        permissionsByEntity.value[entity_name].push(permission)
      } else {
        permissionsByEntity.value[entity_name] = [permission]
      }
    })
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

watch([currentPage, searchQuery], fetchGroups)
onMounted(async () => {
  await fetchPermissions()
  await fetchGroups()
})
</script>

<style scoped>
.permission-table {
  @apply min-w-full divide-y divide-gray-200;
}

.permission-table tr:hover {
  @apply bg-blue-50;
}

/* Estilos personalizados para el scroll */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>