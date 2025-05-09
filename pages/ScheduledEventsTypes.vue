<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Tipos de Evento" class="mb-2" />
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
                    Nuevo Tipo de Evento
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar Tipo Evento ..."
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
                <h3 v-if="eventTypes.length === 0" class="text-gray-500">
                  No se encontraron tipos de evento
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="eventTypes.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-bue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">
                        <div class="flex items-center gap-2">
                          <UIcon name="i-heroicons-tag" class="w-5 h-5 text-blue-500"/>
                          <span class="text-blue-700">Nombre</span>
                        </div>
                      </th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-swatch" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Color</span>
                        </div>
                      </th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Acciones</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="eventType in eventTypes" :key="eventType.id" class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left">
                        {{ eventType.name }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex justify-center">
                          <div 
                            class="w-6 h-6 rounded-full shadow-sm border border-gray-200"
                            :style="{ backgroundColor: eventType.color }"
                          ></div>
                        </div>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(eventType)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(eventType)"
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
  
  const eventTypes = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const retrieveFromApi = async () => {
    try {
      const response = await $fetch<any>('/api/scheduledevents_types/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      eventTypes.value = response.results
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching event types:', error)
    }
  }
  
  const showEditorModal = async (eventType?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${eventType?.id ? 'Editar' : 'Nuevo'} Tipo de Evento</span>`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nombre</label>
            <input id="name" 
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${eventType?.name || ''}"
                   placeholder="Ej: Reunión, Vacaciones, etc."
                   maxlength="100">
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 mb-1">Color</label>
            <input id="color" 
                   type="color"
                   class="w-full h-10 cursor-pointer"
                   value="${eventType?.color || '#3b82f6'}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: eventType?.id ? 'Guardar' : 'Crear',
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
        const color = (document.getElementById('color') as HTMLInputElement)?.value.trim()
  
        let error = ''
        if (!name || name.length < 3) error += 'El nombre debe tener al menos 3 caracteres<br>'
        if (name.length > 100) error += 'El nombre no puede exceder los 100 caracteres<br>'
        if (!color || !/^#[0-9A-F]{6}$/i.test(color)) error += 'Color hexadecimal inválido'
  
        if (error) Swal.showValidationMessage(error)
        return { name, color }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/scheduledevents_types/', {
        method: 'POST',
        body: formValues
      })
      await retrieveFromApi()
      Swal.fire('¡Creado!', 'Tipo de evento creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el tipo de evento', 'error')
    }
  }
  
  const handleEdit = async (eventType: any) => {
    const formValues = await showEditorModal(eventType)
    if (!formValues) return
  
    try {
      await $fetch(`/api/scheduledevents_types/${eventType.id}/`, {
        method: 'PUT',
        body: formValues
      })
      await retrieveFromApi()
      Swal.fire('¡Actualizado!', 'Tipo de evento actualizado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el tipo de evento', 'error')
    }
  }
  
  const handleDelete = async (eventType: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar tipo de evento?',
      text: `Estás por eliminar: ${eventType.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/scheduledevents_types/${eventType.id}/`, {
          method: 'DELETE'
        })
        await retrieveFromApi()
        Swal.fire('Eliminado!', 'El tipo de evento fue eliminado', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el tipo de evento', 'error')
      }
    }
  }
  
  // Watchers
  watch([currentPage, searchQuery], retrieveFromApi)
  
  // Initial load
  onMounted(retrieveFromApi)
  </script>
  
  <style scoped>
  .permission-table {
    @apply min-w-full divide-y divide-gray-200;
  }
  
  .permission-table tr:hover {
    @apply bg-blue-50;
  }
  </style>