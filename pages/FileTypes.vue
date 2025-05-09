<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Tipos de Archivo" class="mb-2" />
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
                    Nuevo Tipo
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar tipos..."
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
                <h3 v-if="fileTypes.length === 0" class="text-gray-500">
                  No se encontraron tipos de archivo
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="fileTypes.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Creado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Actualizado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="type in fileTypes" :key="type.id" class="hover:bg-blue-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left">{{ type.name }}</td>
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
  
  const fileTypes = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const retrieveData = async () => {
    try {
      const response = await $fetch('/api/filestypes/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      
      fileTypes.value = response.results
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching file types:', error)
    }
  }
  
  const showEditorModal = async (fileType?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${fileType?.id ? 'Editar' : 'Nuevo'} Tipo de Archivo</span>`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nombre*</label>
            <input id="name" 
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${fileType?.name || ''}"
                   placeholder="Ej: PDF, Documento de texto"
                   maxlength="100">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: fileType?.id ? 'Guardar' : 'Crear',
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
        
        let error = ''
        if (!name) error += 'El nombre es requerido<br>'
        if (name.length > 100) error += 'El nombre no puede exceder 100 caracteres<br>'
        if (error) Swal.showValidationMessage(error)
        
        return { name }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/filestypes/', {
        method: 'POST',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Creado!', 'Tipo de archivo creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el tipo de archivo', 'error')
    }
  }
  
  const handleEdit = async (fileType: any) => {
    const formValues = await showEditorModal(fileType)
    if (!formValues) return
  
    try {
      await $fetch(`/api/filestypes/${fileType.id}/`, {
        method: 'PUT',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Actualizado!', 'Tipo de archivo actualizado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el tipo de archivo', 'error')
    }
  }
  
  const handleDelete = async (fileType: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar tipo de archivo?',
      text: `Estás por eliminar: ${fileType.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/filestypes/${fileType.id}/`, { method: 'DELETE' })
        await retrieveData()
        Swal.fire('Eliminado!', 'El tipo de archivo fue eliminado', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el tipo de archivo', 'error')
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
  
  ::v-deep .swal2-popup input {
    @apply tracking-normal;
  }
  </style>