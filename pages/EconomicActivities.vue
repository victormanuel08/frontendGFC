<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Actividades Económicas" class="mb-2" />
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
                    Nueva Actividad
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar por código o descripción..."
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
                <h3 v-if="activities.length === 0" class="text-gray-500">
                  No se encontraron actividades
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="activities.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Código</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Descripción</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">División</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Grupo</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Incluye/Excluye</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="activity in activities" :key="activity.id" class="hover:bg-blue-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left">
                        <UBadge color="blue" variant="soft">{{ activity.cseCodigo }}</UBadge>
                      </td>
                      <td class="p-4 border border-gray-200 text-left max-w-[300px] truncate">
                        {{ activity.cseDescripcion || '-' }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ activity.division || '-' }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ activity.grupo || '-' }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex flex-col gap-1">
                          <div v-if="activity.incluye?.length" class="text-green-600 text-sm">
                            Incluye: {{ activity.incluye.map(i => i.actDescripcion).join(', ') }}
                          </div>
                          <div v-if="activity.excluye?.length" class="text-red-600 text-sm">
                            Excluye: {{ activity.excluye.map(e => e.actDescripcion).join(', ') }}
                          </div>
                          <span v-if="!activity.incluye?.length && !activity.excluye?.length" class="text-gray-400">-</span>
                        </div>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(activity)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(activity)"
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
  
  const activities = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const parseJSONField = (field: string | null) => {
    try {
      if (!field || field === '[]' || field === 'null') return []
      const formatted = field
        .replace(/'/g, '"')  // Convertir comillas simples a dobles
        .replace(/\\/g, '')  // Eliminar barras invertidas escapadas
      return JSON.parse(formatted)
    } catch (error) {
      console.error('Error parsing JSON field:', error)
      return []
    }
  }
  
  const retrieveData = async () => {
    try {
      const response = await $fetch('/api/economicactivities/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      
      activities.value = response.results.map(activity => ({
        ...activity,
        incluye: parseJSONField(activity.incluye),
        excluye: parseJSONField(activity.excluye)
      }))
      
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const showEditorModal = async (activity?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${activity?.id ? 'Editar' : 'Nueva'} Actividad Económica</span>`,
      html: `
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Código CIIU*</label>
              <input id="cseCodigo" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${activity?.cseCodigo || ''}"
                     placeholder="Ej: 6201"
                     maxlength="10">
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Título</label>
              <input id="cseTitulo" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${activity?.cseTitulo || ''}"
                     placeholder="Título de la actividad"
                     maxlength="255">
            </div>
          </div>
  
          <div>
            <label class="block text-sm text-gray-600 mb-1">Descripción*</label>
            <input id="cseDescripcion" 
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${activity?.cseDescripcion || ''}"
                   placeholder="Descripción de la actividad"
                   maxlength="255">
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">División</label>
              <input id="division" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${activity?.division || ''}"
                     placeholder="División CIIU"
                     maxlength="10">
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Grupo</label>
              <input id="grupo" 
                     class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 border-gray-300" 
                     value="${activity?.grupo || ''}"
                     placeholder="Grupo CIIU"
                     maxlength="10">
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Incluye (JSON array)</label>
              <textarea id="incluye" 
                        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               border-gray-300 h-24"
                        placeholder="[{'actId': 1, 'actDescripcion': '...'}]">${JSON.stringify(activity?.incluye || [], null, 2)}</textarea>
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Excluye (JSON array)</label>
              <textarea id="excluye" 
                        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               border-gray-300 h-24"
                        placeholder="[{'actId': 1, 'actDescripcion': '...'}]">${JSON.stringify(activity?.excluye || [], null, 2)}</textarea>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: activity?.id ? 'Guardar' : 'Crear',
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
        const cseCodigo = (document.getElementById('cseCodigo') as HTMLInputElement)?.value.trim()
        const cseDescripcion = (document.getElementById('cseDescripcion') as HTMLInputElement)?.value.trim()
        const cseTitulo = (document.getElementById('cseTitulo') as HTMLInputElement)?.value.trim()
        const division = (document.getElementById('division') as HTMLInputElement)?.value.trim()
        const grupo = (document.getElementById('grupo') as HTMLInputElement)?.value.trim()
        
        try {
          const incluye = JSON.parse((document.getElementById('incluye') as HTMLTextAreaElement)?.value || '[]')
          const excluye = JSON.parse((document.getElementById('excluye') as HTMLTextAreaElement)?.value || '[]')
  
          let error = ''
          if (!cseCodigo) error += 'Código CIIU es requerido<br>'
          if (!cseDescripcion) error += 'Descripción es requerida<br>'
          if (cseCodigo?.length > 10) error += 'Código no puede exceder 10 caracteres<br>'
          if (cseDescripcion?.length > 255) error += 'Descripción no puede exceder 255 caracteres<br>'
          if (error) Swal.showValidationMessage(error)
  
          return { 
            cseCodigo,
            cseDescripcion,
            cseTitulo: cseTitulo || null,
            division: division || null,
            grupo: grupo || null,
            incluye,
            excluye
          }
        } catch (e) {
          Swal.showValidationMessage('Formato JSON inválido en Incluye/Excluye')
          return false
        }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/economicactivities/', {
        method: 'POST',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Creado!', 'Actividad creada exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la actividad', 'error')
    }
  }
  
  const handleEdit = async (activity: any) => {
    const formValues = await showEditorModal({
      ...activity,
      incluye: activity.incluye || [],
      excluye: activity.excluye || []
    })
    if (!formValues) return
  
    try {
      await $fetch(`/api/economicactivities/${activity.id}/`, {
        method: 'PUT',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Actualizado!', 'Actividad actualizada', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la actividad', 'error')
    }
  }
  
  const handleDelete = async (activity: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar actividad?',
      text: `Código: ${activity.cseCodigo} - ${activity.cseDescripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/economicactivities/${activity.id}/`, { method: 'DELETE' })
        await retrieveData()
        Swal.fire('Eliminado!', 'La actividad fue eliminada', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la actividad', 'error')
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
  
  ::v-deep .swal2-popup textarea {
    @apply font-mono text-xs border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500;
  }
  </style>