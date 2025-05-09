<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <!-- Modal para edición/creación -->
    <UModal v-model="isModalOpen">
      <UCard class="relative">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Editar' : 'Nueva' }} Responsabilidad
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isModalOpen = false"
            />
          </div>
        </template>

        <UForm  class="space-y-4">
          <UFormGroup label="Código" required>
            <UInput
              v-model="currentForm.code"
              placeholder="Código"
              maxlength="100"
            />
          </UFormGroup>

          <UFormGroup label="Nombre" required>
            <UInput
              v-model="currentForm.name"
              placeholder="Nombre"
              maxlength="100"
            />
          </UFormGroup>

          <UFormGroup >
     
            <SelectTax
              v-model="currentForm.tax_full"
              :options="taxes"
              placeholder="Seleccionar impuesto..."
            />
          </UFormGroup>

          <div class="flex justify-end gap-2 mt-6">
            <UButton
              type="button"
              color="gray"
              label="Cancelar"
              @click="isModalOpen = false"
            />
            <UButton
              
              @click="saveResponsability"
              color="primary"
              :label="isEditing ? 'Guardar' : 'Crear'"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Contenido principal existente -->
    <TitleBanner text="Gestión de Tipos de Responsabilidad" class="mb-2" />
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
                  Nueva Responsabilidad
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput 
                    v-model="searchQuery" 
                    placeholder="Buscar responsabilidades..."
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
              <h3 v-if="responsabilityTypes.length === 0" class="text-gray-500">
                No se encontraron tipos de responsabilidad
              </h3>
            </div>

            <div class="overflow-auto" v-if="responsabilityTypes.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Código</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Impuesto</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Creado</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Actualizado</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="type in responsabilityTypes" :key="type.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left font-mono">{{ type.code }}</td>
                    <td class="p-4 border border-gray-200 text-left">{{ type.name }}</td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ type.tax_full?.name || '-' }}
                    </td>
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

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentForm = ref({
  id: null,
  code: '',
  name: '',
  tax: null,
  tax_full: null
})

const responsabilityTypes = ref<any[]>([])
const taxes = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const retrieveData = async () => {
  try {
    const [responsabilityRes, taxesRes] = await Promise.all([
      $fetch('/api/responsabilitys_types/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value,
          expand: 'tax'
        }
      }),
      $fetch('/api/taxes/')
    ])
    
    responsabilityTypes.value = responsabilityRes.results
    totalItems.value = responsabilityRes.count
    taxes.value = taxesRes.results
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error cargando datos',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#fff',
      iconColor: '#ef4444'
    })
  }
}

const handleAdd = () => {
  isEditing.value = false
  currentForm.value = {
    id: null,
    code: '',
    name: '',
    tax: null,
    tax_full: null
  }
  isModalOpen.value = true
}

const handleEdit = (type: any) => {
  isEditing.value = true
  currentForm.value = {
    id: type.id,
    code: type.code,
    name: type.name,
    tax: type.tax_full?.id || null,
    tax_full: type.tax_full || null
  }
  isModalOpen.value = true
}

const saveResponsability = async () => {
  try {
    if (!currentForm.value.code || !currentForm.value.name || !currentForm.value.tax_full) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Todos los campos marcados como obligatorios deben ser completados',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        background: '#fff',
        iconColor: '#eab308'
      })
      return
    }

    const payload = {
      code: currentForm.value.code,
      name: currentForm.value.name,
      tax: currentForm.value.tax_full?.id || null
    }

    if (isEditing.value) {
      await $fetch(`/api/responsabilitys_types/${currentForm.value.id}/`, {
        method: 'PATCH',
        body: payload
      })
    } else {
      await $fetch('/api/responsabilitys_types/', {
        method: 'POST',
        body: payload
      })
    }

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: `Responsabilidad ${isEditing.value ? 'actualizada' : 'creada'} correctamente`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#fff',
      iconColor: '#22c55e'
    })

    isModalOpen.value = false
    await retrieveData()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al procesar la solicitud',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      background: '#fff',
      iconColor: '#ef4444'
    })
  }
}

const handleDelete = async (type: any) => {
  const result = await Swal.fire({
    title: 'Confirmar eliminación',
    html: `¿Estás seguro de eliminar la responsabilidad:<br><b>${type.name} (${type.code})</b>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      confirmButton: 'mr-2',
      cancelButton: 'ml-2'
    }
  })

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/responsabilitys_types/${type.id}/`, { method: 'DELETE' })
      await retrieveData()
      
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La responsabilidad ha sido eliminada',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#fff',
        iconColor: '#22c55e'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la responsabilidad',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        background: '#fff',
        iconColor: '#ef4444'
      })
    }
  }
}

watch([currentPage, searchQuery], retrieveData)
onMounted(retrieveData)
</script>

<style scoped>
/* Tus estilos permanecen igual */
.permission-table {
  @apply min-w-full divide-y divide-gray-200;
}

.permission-table tr:hover {
  @apply bg-blue-50;
}
</style>