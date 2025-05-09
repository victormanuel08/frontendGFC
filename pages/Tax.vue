<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Gestión de Impuestos" class="mb-2" />
    <div class="">
      <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
        <div class="max-w-9xl mx-auto">
          <UCard class="border-0">
            <template #header>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <UButton variant="soft" @click="handleAdd" class="flex-shrink-0">
                  <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                  Nuevo Impuesto
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput v-model="searchQuery" placeholder="Buscar impuesto..." icon="i-heroicons-magnifying-glass"
                    :ui="{ icon: { trailing: true } }" class="flex-grow" />
                  <UPagination v-model="currentPage" :page-count="pageSize" :total="totalItems" :ui="{
                    wrapper: 'flex items-center gap-1',
                    rounded: '!rounded-full min-w-[32px] justify-center'
                  }" />
                </div>
              </div>
            </template>

            <div class="flex justify-center items-center py-6">
              <h3 v-if="taxes.length === 0" class="text-gray-500">
                No se encontraron impuestos
              </h3>
            </div>

            <div class="overflow-auto" v-if="taxes.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Código</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Filtro Calendario</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Expiraciones</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Descripción</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tax in taxes" :key="tax.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">{{ tax.name }}</td>
                    <td class="p-4 border border-gray-200 text-center">
                      <UBadge color="blue" variant="soft">{{ tax.code }}</UBadge>
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ tax.taxcalendar_filter_full?.name || '-' }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex flex-wrap gap-1 justify-center">
                        <UTooltip v-for="exp in tax.expirations_full" :key="exp.id" :text="getTooltipText(exp)">
                          <UBadge color="gray" variant="soft" class="cursor-help">
                            {{ exp.digits }}
                          </UBadge>
                        </UTooltip>
                        <span v-if="tax.expirations_full.length === 0" class="text-gray-400">-</span>
                      </div>
                    </td>
                    <td class="p-4 border border-gray-200 text-center max-w-[200px] truncate">
                      {{ tax.description }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <UTooltip text="Editar">
                          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil" @click="handleEdit(tax)"
                            class="hover:bg-gray-50" size="sm" />
                        </UTooltip>
                        <UTooltip text="Eliminar">
                          <UButton color="blue" variant="ghost" icon="i-heroicons-trash" @click="handleDelete(tax)"
                            class="hover:bg-blue-50" size="sm" />
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

    <!-- Modal para Tax -->
    <UModal v-model="isTaxModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">{{ editingTax?.id ? 'Editar' : 'Nuevo' }} Impuesto</h2>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Nombre" required>
              <UInput v-model="taxForm.name" placeholder="Ej: IVA, ReteICA, etc." />
            </UFormGroup>

            <UFormGroup label="Código" required>
              <UInput v-model="taxForm.code" placeholder="Ej: IV, RC" uppercase maxlength="2"
                @input="taxForm.code = taxForm.code.toUpperCase()" />
            </UFormGroup>
          </div>

          <UFormGroup>
            <SelectTaxCalendarFilter v-model="taxForm.taxcalendar_filter_full" />
          </UFormGroup>

          <UFormGroup label="Expiraciones">
            <div class="flex gap-2">
              <USelectMenu v-model="taxForm.expirations" :options="taxExpirationsOptions" option-attribute="digits"
                value-attribute="id" :searchable="true" class="flex-1">
                <template #label>
                  Seelecionar Expiracione a editar
                </template>
              </USelectMenu>

              <div class="flex gap-1">
          
                <UButton icon="i-heroicons-pencil" color="gray" variant="solid"
                  @click="openExpirationEdit(taxForm.expirations)" :disabled="taxForm.expirations?.length === 1" />
                <UButton icon="i-heroicons-plus" color="gray" variant="solid" @click="openExpirationCreate" />
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="Descripción">
            <UTextarea v-model="taxForm.description" placeholder="Descripción del impuesto" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Cancelar" color="gray" @click="isTaxModalOpen = false" />

            <UButton :label="editingTax?.id ? 'Guardar' : 'Crear'" color="blue" @click="handleTaxSubmit"
              :disabled="!taxFormValid" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal para Expiración -->
    <UModal v-model="isExpirationModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">{{ editingExpiration?.id ? 'Editar' : 'Nueva' }} Expiración</h2>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Dígitos" required>
            <UInput v-model="expirationForm.digits" placeholder="Ej: 1, 2, 3..." maxlength="2"
              :disabled="!!editingExpiration?.id" />
          </UFormGroup>

          <UFormGroup required>
            <SelectThirdTypes v-model="expirationForm.third_types_full" @update:model-value="handleThirdTypeChange" />
          </UFormGroup>

          <UFormGroup required>
            <SelectRegiment v-model="expirationForm.regiment_full" :third-type-id="expirationForm.third_types"
              :disabled="!expirationForm.third_types" />
          </UFormGroup>

          <UFormGroup label="Fecha" required>
            <UInput v-model="expirationForm.date" type="date" />
          </UFormGroup>

          <UFormGroup label="Descripción">
            <UTextarea v-model="expirationForm.description" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Cancelar" color="gray" @click="isExpirationModalOpen = false" />

            <UButton :label="expirationForm ? 'Guardar' : 'Crear'" color="blue" @click="handleExpirationSubmit"
              :disabled="!expirationFormValid" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';

interface Tax {
  id: number
  name: string
  code: string
  taxcalendar_filter?: number | null
  taxcalendar_filter_full?: TaxCalendarFilter | null
  expirations_full?: Expiration[] | null
  description: string
}

interface Expiration {
  id: number
  digits: string
  date: string
  third_types: number | null
  regiment_types: number | null
  third_types_full?: { id: number; name: string } | null
  regiment_full?: { id: number; name: string } | null
  description?: string | null
}

interface TaxCalendarFilter {
  id: number
  name: string
}
interface TaxCalendarFilterOption {
  id: number
  name: string
}

const taxCalendarFilter = ref<TaxCalendarFilter | null>(null)
const taxCalendarFilterOptions = ref<TaxCalendarFilterOption[]>([])

const taxes = ref<Tax[]>([])
const expirationsOptions = ref<Expiration[]>([])
const filtersOptions = ref<TaxCalendarFilter[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// Tax Modal
const isTaxModalOpen = ref(false)
const editingTax = ref<Tax | null>(null)
const taxForm = ref({
  name: '',
  code: '',
  taxcalendar_filter: null as number | null,
  taxcalendar_filter_full: null as TaxCalendarFilter | null,
  expirations: [] as number[] | undefined,
  description: ''
})

// Expiration Modal
const isExpirationModalOpen = ref(false)
const editingExpiration = ref<Expiration | null>(null)
const expirationForm = ref<Partial<Expiration>>({
  digits: '',
  date: '',
  third_types: null as number | null,
  third_types_full: null as { id: number; name: string } | null,
  regiment_full: null as { id: number; name: string } | null,
  regiments_types: null as number | null,
  description: ''
})

// Computed
const taxFormValid = computed(() => {
  return taxForm.value.name.trim() && taxForm.value.code.trim().length === 2
})

const taxExpirationsOptions = computed(() => {
  return editingTax.value?.expirations_full || []
})

const expirationFormValid = computed(() => {
  return expirationForm.value.digits?.trim() &&
    expirationForm.value.date?.trim() &&
    expirationForm.value.description !== null && 
    expirationForm.value.description !== undefined && 
    expirationForm.value.description.trim() !== ""
})

const selectedExpiration = computed(() => {
  return expirationsOptions.value.find(e => e.id === taxForm.value.expiration)
})

// Methods
const getTooltipText = (exp: Expiration) => {
  return `Dígitos: ${exp.digits}
Fecha: ${new Date(exp.date).toLocaleDateString()}
Tipo: ${exp.third_types_full?.name || '-'}
Régimen: ${exp.regiment_full?.name || '-'}
Descripción: ${exp.description || 'Sin descripción'}`
}

const retrieveData = async () => {
  try {
    const [taxResponse, expirationsResponse] = await Promise.all([
      $fetch('/api/taxes/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value,
          expand: 'taxcalendar_filter,expirations,expirations.third_types_full,expirations.regiment_full'
        }
      }),
      $fetch('/api/expirations/', {
        query: {
          expand: 'third_types_full,regiment_full'
        }
      })
    ])

    taxes.value = taxResponse.results
    totalItems.value = taxResponse.count
    expirationsOptions.value = expirationsResponse.results
    
    //Swal.fire({
    //  icon: 'success',
    //  title: 'Datos cargados',
    //  text: 'Los impuestos se han cargado correctamente',
    //  confirmButtonColor: '#3b82f6',
    //  customClass: {
    //    popup: 'rounded-xl',
    //    confirmButton: 'px-4 py-2 text-sm font-medium'
    //  }
    //})
  } catch (error) {
    console.error('Error fetching data:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    })
  }
}

const resetTaxForm = () => {
  taxForm.value = {
    name: '',
    code: '',
    taxcalendar_filter: null,
    taxcalendar_filter_full: null,
    expirations: [],
    description: ''
  }
  editingTax.value = null
}

const handleAdd = () => {
  resetTaxForm()
  isTaxModalOpen.value = true
}

const handleEdit = (tax: Tax) => {
  editingTax.value = tax
  taxForm.value = {
    name: tax.name,
    code: tax.code,
    taxcalendar_filter: tax.taxcalendar_filter_full?.id || null,
    taxcalendar_filter_full: tax.taxcalendar_filter_full || null,
    expirations: tax.expirations_full?.map(e => e.id) || [],
    description: tax.description
  }
  isTaxModalOpen.value = true
}

const handleTaxSubmit = async () => {
  try {
    const payload = {
      ...taxForm.value,
      taxcalendar_filter: taxForm.value.taxcalendar_filter_full?.id || null,
    }

    delete payload.expirations;

    if (editingTax.value?.id) {
      await $fetch(`/api/taxes/${editingTax.value.id}/`, {
        method: 'PUT',
        body: payload
      })
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Impuesto actualizado correctamente',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })
    } else {
      await $fetch('/api/taxes/', {
        method: 'POST',
        body: payload
      })
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Impuesto creado correctamente',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })
    }

    await retrieveData()
    isTaxModalOpen.value = false
  } catch (error) {
    console.error('Error saving tax:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el impuesto',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    })
  }
}

const handleThirdTypeChange = (newValue: number) => {
  expirationForm.value.regiment_full = null
}

const openExpirationCreate = () => {
  expirationForm.value = {
    digits: '',
    date: '',
    third_types: null,
    regiments_types: null,
    description: ''
  }
  editingExpiration.value = null
  isExpirationModalOpen.value = true
}

const openExpirationEdit = async (expirationId: number) => {
  try {
    const expirationAPI = await $fetch(`/api/expirations/${expirationId}/`, {
      query: {
        expand: 'third_types_full,regiment_full'
      }
    });

    if (expirationAPI) {
      editingExpiration.value = expirationAPI;
      expirationForm.value = {
        id: expirationAPI.id,
        digits: expirationAPI.digits,
        date: expirationAPI.date.split('T')[0],
        third_types: expirationAPI.third_types,
        regiments_types: expirationAPI.regiment_types,
        regiment_full: expirationAPI.regiment_full ?? null,
        third_types_full: expirationAPI.third_types_full ?? null,
        description: expirationAPI.description || ''
      };
      isExpirationModalOpen.value = true;
    }
  } catch (error) {
    console.error('Error obteniendo expiración:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la expiración',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    })
  }
}

const handleExpirationSubmit = async () => {
  try {
    let expirationId: number

    if (expirationForm.value.id) {
      // Editar existente
      const updated = await $fetch(`/api/expirations/${expirationForm.value.id}/`, {
        method: 'PUT',
        body: expirationForm.value
      })
      expirationId = updated.id
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Expiración actualizada correctamente',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })
    } else {
      // Crear nueva
      const created = await $fetch('/api/expirations/', {
        method: 'POST',
        body: expirationForm.value
      })
      expirationId = created.id
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Expiración creada correctamente',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })

      // Si estamos editando un tax, asociar la nueva expiración
      if (editingTax.value?.id) {
        try {
          const response = await $fetch(`/api/taxes/${editingTax.value.id}/`);
          let currentExpirations = response.expirations || [];
          currentExpirations = [...currentExpirations, expirationId];

          await $fetch(`/api/taxes/${editingTax.value.id}/`, {
            method: 'PATCH',
            body: {
              expirations: currentExpirations
            }
          });
          
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Expiración asociada al impuesto correctamente',
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'px-4 py-2 text-sm font-medium'
            }
          })
        } catch (error) {
          console.error('Error al actualizar expirations:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo asociar la expiración al impuesto',
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'px-4 py-2 text-sm font-medium'
            }
          })
        }
      }
    }

    await retrieveData()
    isExpirationModalOpen.value = false

    if (!expirationForm.value.id && editingTax.value?.id) {
      await retrieveTaxData(editingTax.value.id)
    }
  } catch (error) {
    console.error('Error saving expiration:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la expiración',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    })
  }
}

const handleDelete = async (tax: Tax) => {
  const result = await Swal.fire({
    title: '¿Eliminar impuesto?',
    text: `Estás por eliminar: ${tax.name} (${tax.code})`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar!',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'px-4 py-2 text-sm font-medium',
      cancelButton: 'px-4 py-2 text-sm font-medium'
    }
  })

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/taxes/${tax.id}/`, { method: 'DELETE' })
      await retrieveData()
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El impuesto ha sido eliminado correctamente',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })
    } catch (error) {
      console.error('Error deleting tax:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el impuesto',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium'
        }
      })
    }
  }
}

const retrieveTaxData = async (taxId: number) => {
  try {
    const response = await $fetch(`/api/taxes/${taxId}/`, {
      query: {
        expand: 'taxcalendar_filter,expirations,expirations.third_types_full,expirations.regiment_full'
      }
    })

    if (editingTax.value) {
      editingTax.value = response
      taxForm.value.expirations = response.expirations
    }
  } catch (error) {
    console.error('Error fetching tax data:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información del impuesto',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium'
      }
    })
  }
}

// Lifecycle
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
</style>