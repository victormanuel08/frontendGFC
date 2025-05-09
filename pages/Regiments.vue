<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Gestión de Tipos de Régimen" class="mb-2" />
      <div class="">
        <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
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
                    Nuevo Régimen
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar regímenes..."
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
                <h3 v-if="regimentTypes.length === 0" class="text-gray-500">
                  No se encontraron tipos de régimen
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="regimentTypes.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Código</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Descripción</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Creado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Actualizado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="type in regimentTypes" :key="type.id" class="hover:bg-blue-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left font-mono">{{ type.code }}</td>
                      <td class="p-4 border border-gray-200 text-left">{{ type.name }}</td>
                      <td class="p-4 border border-gray-200 text-left">{{ type.description || '-' }}</td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ new Date(type.created_at).toLocaleDateString() }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ new Date(type.updated_at).toLocaleDateString() }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(type)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(type)"
                              class="hover:bg-blue-50"
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
    </div>
  </template>
  
  <script setup lang="ts">
  import Swal from 'sweetalert2'
  
  const regimentTypes = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const retrieveData = async () => {
    try {
      const response = await $fetch('/api/regiments_types/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      
      regimentTypes.value = response.results
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const showEditorModal = async (type?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${type?.id ? 'Editar' : 'Nuevo'} Régimen</span>`,
      html: `
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Código*</label>
              <input id="code" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300 font-mono uppercase" 
                     value="${type?.code || ''}"
                     placeholder="Ej: 01"
                     maxlength="2"
                     style="letter-spacing: 0.1em">
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nombre*</label>
              <input id="name" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${type?.name || ''}"
                     placeholder="Nombre del régimen"
                     maxlength="100">
            </div>
          </div>
  
          <div>
            <label class="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea id="description" 
                      class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             placeholder-gray-400 border-gray-300" 
                      rows="3"
                      placeholder="Descripción opcional">${type?.description || ''}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: type?.id ? 'Guardar' : 'Crear',
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
        const getValue = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value
        
        const data = {
          code: getValue('code')?.toUpperCase(),
          name: getValue('name'),
          description: getValue('description')
        }
  
        let error = ''
        if (!data.code) error += 'Código es requerido<br>'
        if (data.code?.length !== 2) error += 'Código debe tener 2 caracteres<br>'
        if (!data.name) error += 'Nombre es requerido<br>'
        if (error) Swal.showValidationMessage(error)
  
        return data
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/regiments_types/', {
        method: 'POST',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Creado!', 'Régimen creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el régimen', 'error')
    }
  }
  
  const handleEdit = async (type: any) => {
    const formValues = await showEditorModal(type)
    if (!formValues) return
  
    try {
      await $fetch(`/api/regiments_types/${type.id}/`, {
        method: 'PATCH',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Actualizado!', 'Régimen actualizado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el régimen', 'error')
    }
  }
  
  const handleDelete = async (type: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar régimen?',
      text: `Estás por eliminar: ${type.name} (${type.code})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/regiments_types/${type.id}/`, { method: 'DELETE' })
        await retrieveData()
        Swal.fire('Eliminado!', 'El régimen fue eliminado', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el régimen', 'error')
      }
    }
  }
  
  watch([currentPage, searchQuery], retrieveData)
  onMounted(retrieveData)
  </script>
  
  <style scoped>
  .permission-table {
    @apply min-w-full divide-y divide-gray-200;
  }
  
  .permission-table tr:hover {
    @apply bg-blue-50;
  }
  
  ::v-deep .swal2-popup input[type="text"].font-mono {
    font-family: monospace;
  }
  </style>