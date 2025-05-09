<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Tipos de Terceros" class="mb-2" />
    <div>
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
                  Nuevo Tipo de Tercero
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput 
                    v-model="searchQuery" 
                    placeholder="Buscar Tipo ..."
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
              <h3 v-if="thirdTypes.length === 0" class="text-gray-500">
                No se encontraron tipos de terceros
              </h3>
            </div>

            <div class="overflow-auto" v-if="thirdTypes.length > 0">
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
                        <UIcon name="i-heroicons-code-bracket" class="w-5 h-5 text-blue-500" />
                        <span class="text-blue-700">Código</span>
                      </div>
                    </th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">
                      <div class="flex items-center gap-2 justify-center">
                        <UIcon name="i-heroicons-list-bullet" class="w-5 h-5 text-blue-500" />
                        <span class="text-blue-700">Regímenes</span>
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
                  <tr v-for="type in thirdTypes" :key="type.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">
                      {{ type.name }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <UBadge color="blue" variant="soft">
                        {{ type.code }}
                      </UBadge>
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex flex-wrap gap-1 justify-center">
                        <UBadge 
                          v-for="regimen in type.regiments_full" 
                          :key="regimen.id"
                          color="gray" 
                          variant="soft"
                          class="max-w-[150px] truncate"
                        >
                          {{ regimen.code }} - {{ regimen.name }}
                        </UBadge>
                        <span v-if="type.regiments.length === 0" class="text-gray-400">-</span>
                      </div>
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

    <!-- Modal de edición -->
    <UModal v-model="isEditorOpen">
      <UCard class="relative">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-800">
            {{ editedThirdType?.id ? 'Editar' : 'Nuevo' }} Tipo de Tercero
          </h2>
        </template>

        <UForm :state="formState" @submit="handleSave" class="space-y-4">
          <UFormGroup label="Nombre" name="name" required>
            <UInput 
              v-model="editedName" 
              placeholder="Ej: Proveedor, Cliente, etc."
              maxlength="100"
            />
          </UFormGroup>

          <UFormGroup label="Código (2 caracteres)" name="code" required>
            <UInput 
              v-model="editedCode"
              placeholder="Ej: PR, CL"
              maxlength="2"
              class="uppercase"
              :ui="{ base: 'uppercase' }"
            />
          </UFormGroup>

          <UFormGroup label="Regímenes">
            <SelectRegiments
              v-model="selectedRegimens"
              labelpersonal="Seleccionar regímenes"
            />
          </UFormGroup>

          <div class="flex justify-end gap-3 mt-6">
            <UButton 
              type="button"
              label="Cancelar" 
              color="gray" 
              variant="ghost"
              @click="isEditorOpen = false"
            />
            <UButton 
              type="submit"
              :label="editedThirdType?.id ? 'Guardar cambios' : 'Crear tipo'" 
              color="blue"
              :loading="isSaving"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ThirdType } from '~/types'

const toast = useToast()
const isEditorOpen = ref(false)
const isSaving = ref(false)
const editedThirdType = ref<ThirdType | null>(null)
const editedName = ref('')
const editedCode = ref('')
const selectedRegimens = ref<any[]>([])

const thirdTypes = ref<ThirdType[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const formState = computed(() => ({
  name: editedName.value,
  code: editedCode.value,
  regimens: selectedRegimens.value.map(r => r.id)  
}))


const retrieveData = async () => {
  try {
    const response = await $fetch('/api/third_types/', {
      query: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value,
        expand: 'regiments_full'
      }
    })
    thirdTypes.value = response.results
    totalItems.value = response.count
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.add({ title: 'Error cargando datos', color: 'red' })
  }
}

const openEditor = (type?: ThirdType) => {
  editedThirdType.value = type || null
  editedName.value = type?.name || ''
  editedCode.value = type?.code || ''
  selectedRegimens.value = type?.regiments_full || []
  isEditorOpen.value = true
}

const validateForm = () => {
  if (!editedName.value.trim()) {
    toast.add({ title: 'El nombre es requerido', color: 'red' })
    return false
  }
  if (!editedCode.value || editedCode.value.length !== 2) {
    toast.add({ title: 'El código debe tener 2 caracteres', color: 'red' })
    return false
  }
  return true
}

const handleSave = async () => {
  isSaving.value = true
  try {
    if (editedThirdType.value?.id) {
      await $fetch(`/api/third_types/${editedThirdType.value.id}/`, {
        method: 'PUT',
        body: formState.value
      })
    } else {
      await $fetch('/api/third_types/', {
        method: 'POST',
        body: formState.value
      })
    }
    await retrieveData()
    isEditorOpen.value = false
    toast.add({ title: 'Guardado con éxito', color: 'green' })
  } catch (error) {
    toast.add({ title: 'Error al guardar', color: 'red' })
    console.error('Save error:', error)
  } finally {
    isSaving.value = false
  }
}


const handleDelete = async (type: ThirdType) => {
  const result = await confirmDialog(
    '¿Eliminar tipo de tercero?',
    `Estás por eliminar: ${type.name}`,
    'warning'
  )

  if (result) {
    try {
      await $fetch(`/api/third_types/${type.id}/`, { method: 'DELETE' })
      await retrieveData()
      toast.add({ title: 'Tipo eliminado correctamente', color: 'green' })
    } catch (error) {
      toast.add({ title: 'Error eliminando tipo', color: 'red' })
    }
  }
}

const confirmDialog = (title: string, text: string, icon: any) => {
  return new Promise((resolve) => {
    const dialog = useConfirmModal({
      title,
      description: text,
      icon,
      confirm: {
        label: 'Confirmar',
        color: 'red'
      },
      cancel: {
        label: 'Cancelar'
      }
    })

    dialog.onConfirm(() => resolve(true))
    dialog.onCancel(() => resolve(false))
    dialog.open()
  })
}

const handleAdd = () => openEditor()
const handleEdit = (type: ThirdType) => openEditor(type)

watch([searchQuery, currentPage], retrieveData, { immediate: true })
</script>

  
  <style scoped>
  .permission-table {
    @apply min-w-full divide-y divide-gray-200;
  }
  
  .permission-table tr:hover {
    @apply bg-blue-50;
  }
  
  .badge-truncate {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>