<template>
    <div class="rounded-3xl bg-white mb-2 mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Gestionar Expiraciones"  icon="i-heroicons-calendar-days"  class="mb-2" />
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
                    Nueva Expiración
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
                <h3 v-if="expirations.length === 0" class="text-gray-500">
                  No se encontraron expiraciones
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="expirations.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Fecha</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Dígitos</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo de Tercero</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo de Régimen</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Descripción</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="exp in expirations" :key="exp.id" class="hover:bg-blue-50 transition-colors duration-150">
             
                      <td class="p-4 border border-gray-200 text-center">
                        {{ new Date(exp.date).toLocaleDateString() }}
                      </td>
                      <td class="p-4 border border-gray-200 text-left">
                        <UBadge color="blue" variant="soft">{{ exp.digits }}</UBadge>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ exp.third_types_full?.name || '-' }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ exp.regiment_full?.name || '-' }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center max-w-[200px] truncate">
                        {{ exp.description }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(exp)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(exp)"
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
  
  const expirations = ref<any[]>([])
  const thirdTypesOptions = ref<any[]>([])
  const regimensOptions = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const retrieveData = async () => {
    try {
      const [expResponse, thirdResponse, regimenResponse] = await Promise.all([
        $fetch('/api/expirations/', {
          query: {
            page: currentPage.value,
            page_size: pageSize.value,
            search: searchQuery.value,
            expand: 'third_types,regiments_types'
          }
        }),
        $fetch('/api/third_types/'),
        $fetch('/api/regiments_types/')
      ])
      
      expirations.value = expResponse.results
      totalItems.value = expResponse.count
      thirdTypesOptions.value = thirdResponse.results
      regimensOptions.value = regimenResponse.results
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const showEditorModal = async (exp?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${exp?.id ? 'Editar' : 'Nueva'} Expiración</span>`,
      html: `
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Dígitos</label>
              <input id="digits" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${exp?.digits || ''}"
                     placeholder="Ej: 01, 02"
                     maxlength="2">
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fecha</label>
              <input id="date" 
                     type="date"
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            border-gray-300"
                     value="${exp?.date ? new Date(exp.date).toISOString().split('T')[0] : ''}">
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Tipo de Tercero</label>
              <select id="third_types" 
                      class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             bg-white border-gray-300">
                <option value="">Seleccionar...</option>
                ${thirdTypesOptions.value.map(type => `
                  <option value="${type.id}" ${exp?.third_types === type.id ? 'selected' : ''}>
                    ${type.name} (${type.code})
                  </option>
                `).join('')}
              </select>
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Tipo de Régimen</label>
              <select id="regiments_types" 
                      class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             bg-white border-gray-300">
                <option value="">Seleccionar...</option>
                ${regimensOptions.value.map(regimen => `
                  <option value="${regimen.id}" ${exp?.regiments_types === regimen.id ? 'selected' : ''}>
                    ${regimen.name} (${regimen.code})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
  
          <div>
            <label class="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea id="description" 
                      class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             border-gray-300 h-24"
                      placeholder="Descripción detallada">${exp?.description || ''}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: exp?.id ? 'Guardar' : 'Crear',
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
        const digits = (document.getElementById('digits') as HTMLInputElement)?.value
        const date = (document.getElementById('date') as HTMLInputElement)?.value
        const third_types = (document.getElementById('third_types') as HTMLSelectElement)?.value
        const regiments_types = (document.getElementById('regiments_types') as HTMLSelectElement)?.value
        const description = (document.getElementById('description') as HTMLTextAreaElement)?.value
  
        let error = ''
        if (!digits || digits.length !== 2) error += 'Dígitos debe tener 2 caracteres<br>'
        if (!date) error += 'Fecha es requerida<br>'
        if (error) Swal.showValidationMessage(error)
  
        return { 
          digits,
          date,
          third_types: third_types || null,
          regiments_types: regiments_types || null,
          description: description || 'Sin definir'
        }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/expirations/', {
        method: 'POST',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Creado!', 'Expiración creada exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la expiración', 'error')
    }
  }
  
  const handleEdit = async (exp: any) => {
    const formValues = await showEditorModal(exp)
    if (!formValues) return
  
    try {
      await $fetch(`/api/expirations/${exp.id}/`, {
        method: 'PUT',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Actualizado!', 'Expiración actualizada', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la expiración', 'error')
    }
  }
  
  const handleDelete = async (exp: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar expiración?',
      text: `Estás por eliminar: ${exp.digits} - ${new Date(exp.date).toLocaleDateString()}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/expirations/${exp.id}/`, { method: 'DELETE' })
        await retrieveData()
        Swal.fire('Eliminado!', 'La expiración fue eliminada', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la expiración', 'error')
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
  
  ::v-deep .swal2-popup select,
  ::v-deep .swal2-popup input[type="date"] {
    @apply border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500;
  }
  </style>