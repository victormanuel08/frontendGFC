<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Gestión de Correos Electrónicos" class="mb-2" />
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
                    Nuevo Correo
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput 
                      v-model="searchQuery" 
                      placeholder="Buscar correos..."
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
                <h3 v-if="emails.length === 0" class="text-gray-500">
                  No se encontraron correos electrónicos
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="emails.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Correo Electrónico</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Contraseña</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Creado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Actualizado</th>
                      <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="email in emails" :key="email.id" class="hover:bg-blue-50 transition-colors duration-150">
                      <td class="p-4 border border-gray-200 text-left">{{ email.email }}</td>
                      <td class="p-4 border border-gray-200 text-center">
                        <UBadge variant="soft" class="select-none">••••••••</UBadge>
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ new Date(email.created_at).toLocaleDateString() }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        {{ new Date(email.updated_at).toLocaleDateString() }}
                      </td>
                      <td class="p-4 border border-gray-200 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Editar">
                            <UButton 
                              color="gray" 
                              variant="ghost" 
                              icon="i-heroicons-pencil"
                              @click="handleEdit(email)"
                              class="hover:bg-gray-50"
                              size="sm"
                            />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton 
                              color="blue" 
                              variant="ghost" 
                              icon="i-heroicons-trash"
                              @click="handleDelete(email)"
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
  
  const emails = ref<any[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  
  const retrieveData = async () => {
    try {
      const response = await $fetch('/api/email/', {
        query: {
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value
        }
      })
      
      emails.value = response.results
      totalItems.value = response.count
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  }
  
  const showEditorModal = async (email?: any) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-lg font-semibold text-gray-800">${email?.id ? 'Editar' : 'Nuevo'} Correo</span>`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Correo Electrónico*</label>
            <input id="email" 
                   type="email"
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   value="${email?.email || ''}"
                   placeholder="ejemplo@dominio.com">
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 mb-1">Contraseña${email?.id ? ' (dejar en blanco para no cambiar)' : '*'}</label>
            <input id="password" 
                   type="password"
                   class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 border-gray-300" 
                   placeholder="••••••••">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: email?.id ? 'Actualizar' : 'Crear',
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
        const email = (document.getElementById('email') as HTMLInputElement)?.value.trim()
        const password = (document.getElementById('password') as HTMLInputElement)?.value
  
        let error = ''
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error += 'Correo electrónico inválido<br>'
        if (!email?.id && !password) error += 'La contraseña es requerida para nuevos registros<br>'
        if (error) Swal.showValidationMessage(error)
  
        return { email, password }
      }
    })
    return formValues
  }
  
  const handleAdd = async () => {
    const formValues = await showEditorModal()
    if (!formValues) return
  
    try {
      await $fetch('/api/email/', {
        method: 'POST',
        body: formValues
      })
      await retrieveData()
      Swal.fire('¡Creado!', 'Correo creado exitosamente', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el correo', 'error')
    }
  }
  
  const handleEdit = async (email: any) => {
    const formValues = await showEditorModal(email)
    if (!formValues) return
  
    try {
      // Solo actualizar password si se proporcionó
      const body = formValues.password 
        ? formValues
        : { email: formValues.email }
  
      await $fetch(`/api/email/${email.id}/`, {
        method: 'PUT',
        body: body
      })
      await retrieveData()
      Swal.fire('¡Actualizado!', 'Correo actualizado', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el correo', 'error')
    }
  }
  
  const handleDelete = async (email: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar correo?',
      text: `Estás por eliminar: ${email.email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!'
    })
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/email/${email.id}/`, { method: 'DELETE' })
        await retrieveData()
        Swal.fire('Eliminado!', 'El correo fue eliminado', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el correo', 'error')
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
  
  ::v-deep .swal2-popup input[type="password"] {
    @apply tracking-widest;
  }
  </style>