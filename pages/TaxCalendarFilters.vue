<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Filtros de Calendario Tributario" class="mb-2" />
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
                    Nuevo Filtro
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar Filtro ..."
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
                <h3 v-if="taxFilters.length === 0" class="text-gray-500">
                  No se encontraron filtros
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="taxFilters.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">
                        <div class="flex items-center gap-2">
                          <UIcon name="i-heroicons-tag" class="w-5 h-5 text-blue-500"/>
                          <span class="text-blue-700">Nombre</span>
                        </div>
                      </th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-arrows-pointing-out" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Longitud</span>
                        </div>
                      </th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">DV</span>
                        </div>
                      </th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">ID Number</span>
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
                    <tr v-for="filter in taxFilters" :key="filter.id" class="hover:bg-blue-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left">
                        {{ filter.name }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ lengthOptions.find(o => o.value === filter.length)?.label }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <UBadge :color="filter.dv ? 'green' : 'red'" variant="soft">
                          {{ filter.dv ? 'Sí' : 'No' }}
                        </UBadge>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <UBadge :color="filter.id_number ? 'green' : 'red'" variant="soft">
                          {{ filter.id_number ? 'Sí' : 'No' }}
                        </UBadge>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(filter)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(filter)"
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
  
  const taxFilters = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const lengthOptions = [
    { value: 0, label: 'Cero' },
    { value: 1, label: 'Uno' },
    { value: 2, label: 'Dos' }
  ]
  
  const generateAutoName = (lengthValue: number, dv: boolean, id_number: boolean) => {
    const lengthText = lengthOptions.find(choice => choice.value === lengthValue)?.label || ''
    const parts = [lengthText]
    if (dv) parts.push('DV')
    if (id_number) parts.push('ID')
    return parts.join(' + ')
  }
  
  const retrieveFromApi = async () => {
    try {
      const response = await $fetch<any>('/api/taxcalendar_filter/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      taxFilters.value = response.results
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching tax filters:', error)
    }
  }
  
  const showEditorModal = async (filter?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${filter?.id ? 'Editar' : 'Nuevo'} Filtro</span>`,
      html: `
        <div class="space-y-4">
          <div class="p-3 bg-gray-50 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre generado:</label>
            <div id="autoName" class="text-sm text-gray-900 font-semibold">
              ${filter ? generateAutoName(filter.length, filter.dv, filter.id_number) : 'Uno'}
            </div>
            <input type="hidden" id="name" value="${filter?.name || generateAutoName(1, false, false)}">
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 mb-1">Longitud</label>
            <select id="length" class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300">
              ${lengthOptions.map(choice => `
                <option value="${choice.value}" ${((!filter && choice.value === 1) || (filter?.length === choice.value)) ? 'selected' : ''}>
                  ${choice.label}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <input id="dv" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" ${filter?.dv ? 'checked' : ''}>
              <label for="dv" class="ml-2 block text-sm text-gray-600">Incluir DV</label>
            </div>
            
            <div class="flex items-center">
              <input id="id_number" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" ${filter?.id_number ? 'checked' : ''}>
              <label for="id_number" class="ml-2 block text-sm text-gray-600">Incluir ID Number</label>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: filter?.id ? 'Guardar' : 'Crear',
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
          const length = parseInt((document.getElementById('length') as HTMLSelectElement)?.value || '1')
          const dv = (document.getElementById('dv') as HTMLInputElement)?.checked
          const id_number = (document.getElementById('id_number') as HTMLInputElement)?.checked
          const autoNameElement = document.getElementById('autoName')
          const nameInput = document.getElementById('name') as HTMLInputElement
          
          if (autoNameElement && nameInput) {
            const generatedName = generateAutoName(length, dv, id_number)
            autoNameElement.textContent = generatedName
            nameInput.value = generatedName
          }
        }
  
        document.getElementById('length')?.addEventListener('change', updateAutoName)
        document.getElementById('dv')?.addEventListener('change', updateAutoName)
        document.getElementById('id_number')?.addEventListener('change', updateAutoName)
        updateAutoName()
      },
      preConfirm: () => {
        const length = parseInt((document.getElementById('length') as HTMLSelectElement)?.value || '1')
        const dv = (document.getElementById('dv') as HTMLInputElement)?.checked
        const id_number = (document.getElementById('id_number') as HTMLInputElement)?.checked
        const name = (document.getElementById('name') as HTMLInputElement)?.value
  
        return { name, length, dv, id_number }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/taxcalendar_filter/', {
        method: 'POST',
        body: formValues
      })
      await retrieveFromApi()
      Swal.fire('¡Creado!', 'Filtro creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el filtro', 'error')
    }
  }
  
  const handleEdit = async (filter: any) => {
    const formValues = await showEditorModal(filter)
    if (!formValues) return
  
    try {
      await $fetch(`/api/taxcalendar_filter/${filter.id}/`, {
        method: 'PUT',
        body: formValues
      })
      await retrieveFromApi()
      Swal.fire('¡Actualizado!', 'Filtro actualizado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el filtro', 'error')
    }
  }
  
  const handleDelete = async (filter: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar filtro?',
      text: `Estás por eliminar: ${filter.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/taxcalendar_filter/${filter.id}/`, { method: 'DELETE' })
        await retrieveFromApi()
        Swal.fire('Eliminado!', 'El filtro fue eliminado', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el filtro', 'error')
      }
    }
  }
  
  watch([currentPage, searchQuery], retrieveFromApi)
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