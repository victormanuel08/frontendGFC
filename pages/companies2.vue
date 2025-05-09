
<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
        <TitleBanner :text="title" class="mb-2" />
        <div class="">
            <UCard class="bg-white border-2 border-red-500 rounded-2xl shadow-sm">
                <div class="max-w-9xl mx-auto">
                    <UCard v-if="showTableList" class="border-0">
                        <template #header>
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div class="flex gap-2">
                                    <UButton variant="soft" @click="showModalThird(null)" class="flex-shrink-0">
                                        <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                                        Nuevo
                                    </UButton>
                                    <!--
                                    <UButton variant="soft" @click="generateReport" class="flex-shrink-0">
                                        <UIcon name="i-heroicons-document-arrow-down" class="mr-2 w-5 h-5" />
                                        Excel
                                    </UButton>
                                    -->
                                </div>
                                <div class="flex flex-col md:flex-row gap-3 w-full">
                                    <!--
                                    <UPopover :popper="{ placement: 'bottom-start' }">
                                        <UButton variant="soft" class="flex-shrink-0">
                                            <UIcon name="i-heroicons-funnel" class="mr-2 w-5 h-5" />
                                            Filtros
                                        </UButton>
                                        <template #panel="{ close }">
                                            <div
                                                class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                                <div
                                                    class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4 gap-3 m-4">
                                                    
                                                    <UInput v-model="filters.search" placeholder="Buscar por nombre" />
                                                    <UInput v-model="filters.id_number"
                                                        placeholder="Buscar por identificación" />
                                                    <USelect v-model="filters.type" :options="typeOptions"
                                                        placeholder="Tipo de tercero" />
                                                    <USelect v-model="filters.id_verified"
                                                        :options="verificationOptions"
                                                        placeholder="Estado verificación" />
                                                    <UButton icon="i-heroicons-x-mark-20-solid" variant="soft"
                                                        @click="resetFilters" class="ml-2">
                                                        Limpiar Filtros
                                                    </UButton>
                                                </div>
                                            </div>
                                        </template>
</UPopover>
-->
                                    <!-- Cambiar el search principal para usar filters.search -->
                                    <UInput v-model="search" placeholder="Buscar" icon="i-heroicons-magnifying-glass"
                                        :ui="{ icon: { trailing: true } }" class="flex-grow" />
                                    <UPagination v-model="pagination.page" :page-count="pagination.pageSize"
                                        :total="pagination.resultsCount" :ui="{
                                            wrapper: 'flex items-center gap-1',
                                            rounded: '!rounded-full min-w-[32px] justify-center'
                                        }" />
                                </div>
                            </div>
                        </template>
                        <div class="flex justify-center items-center py-6">
                            <h3 v-if="thirds.length === 0" class="text-gray-500">
                                No hay Terceros registrados
                            </h3>
                        </div>
                        <div class="overflow-auto" v-if="thirds.length > 0">
                            <table class="table-auto w-full permission-table">
                                <thead>
                                    <tr>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Creado</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Nombre</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-identification" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Identificación</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-tag" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Tipo</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Verificado</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Responsabilidades</span>
                                            </div>
                                        </th>
                                        <th :class="[ui.th, 'text-center']">
                                            <div class="flex items-center gap-2 justify-center">
                                                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-red-500" />
                                                <span class="text-red-700">Acciones</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(third, index) in thirds" :key="index" @click="handleRowClick(third)"
                                        :class="{ 'selected-row': isSelected(third), 'hover:bg-gray-50': true }">
                                        <td :class="[ui.td, 'text-center']">
                                            {{ formatDate(third.created_at) }}
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            {{ fullName(third) }}
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            {{third.id_type_full?.name}} {{ third.id_number || '-' }}
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            <UBadge v-if="third.type_full" :label="third.type_full?.name"
                                                :color="third.type === 1 ? 'blue' : 'green'" />
                                                <UBadge v-if="third.regiment_full" :label=" third.regiment_full?.name"
                                                :color="third.type !== 1 ? 'blue' : 'green'" />
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            <UIcon v-if="third.id_verified === 4" name="i-heroicons-check-badge"
                                                class="w-6 h-6 text-green-500" />
                                            <UIcon v-else name="i-heroicons-x-circle" class="w-6 h-6 text-red-500" />
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            <UBadge v-for="(res, index) in (third.rut?.responsabilidades)" :key="index"
                                                :color="'gray'" :label="res.code" class="text-xs font-medium mr-1 m-3">
                                                <UTooltip :text="res.tax_full?.name + '-' + res.name"
                                                    :popper="{ placement: 'top' }">
                                                    <span>{{ res.code }}</span>
                                                </UTooltip>
                                            </UBadge>
                                        </td>
                                        <td :class="[ui.td, 'text-center']">
                                            <div class="flex items-center justify-left gap-1">
                                                <UTooltip text="Ver detalles">
                                                    <UButton color="purple" variant="ghost" icon="i-heroicons-eye"
                                                        @click.stop="openRutModal(third.rut)"
                                                        class="hover:bg-purple-50" />
                                                </UTooltip>

                                                <UTooltip text="Editar">
                                                    <UButton color="gray" variant="ghost" icon="i-heroicons-pencil"
                                                        @click.stop="showModalThird(third)" class="hover:bg-gray-50" />
                                                </UTooltip>

                                                <UTooltip text="Eliminar">
                                                    <UButton color="red" variant="ghost" icon="i-heroicons-trash"
                                                        @click.stop="deleteThird(third.id)" class="hover:bg-red-50" />
                                                </UTooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </UCard>
                    <UCard v-if="newEntity" class="w-full bg-gray-50 mt-4 my-3 border-0">
                        <UButton @click="cancelAction" variant="soft" icon="i-heroicons-arrow-left" class="mb-4">
                            Regresar
                        </UButton>
                        <!-- Componente de edición/creación aquí -->
                    </UCard>
                </div>
            </UCard>
        </div>

        <!-- Modal Detalles RUT -->
        <UModal v-model="isRutModalOpen" :ui="{ width: 'sm:max-w-4xl' }">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-red-600">
                        {{ selectedRut?.razon_social || 'Detalles del RUT' }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                        @click="isRutModalOpen = false" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Actividades Económicas -->
                    <div class="space-y-4">
                        <h4 class="font-semibold text-red-500 flex items-center gap-2">
                            <UIcon name="i-heroicons-briefcase" class="w-5 h-5" />
                            Actividades Económicas
                        </h4>

                        <div v-if="selectedRut?.cod_ciiu_act_econ_pri"
                            class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-medium">Principal</p>
                                    <p class="text-sm text-gray-600">
                                        {{ selectedRut.cod_ciiu_act_econ_pri.cseCodigo }} -
                                        {{ selectedRut.cod_ciiu_act_econ_pri.cseTitulo }}
                                    </p>
                                </div>
                                <UButton variant="ghost" icon="i-heroicons-information-circle"
                                    @click="selectedRut.cod_ciiu_act_econ_pri ? openActivityModal(selectedRut.cod_ciiu_act_econ_pri) : null" />
                            </div>
                        </div>

                        <div v-if="selectedRut?.cod_ciiu_act_econ_sec"
                            class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-medium">Secundaria</p>
                                    <p class="text-sm text-gray-600">
                                        {{ selectedRut.cod_ciiu_act_econ_sec.cseCodigo }} -
                                        {{ selectedRut.cod_ciiu_act_econ_sec.cseTitulo }}
                                    </p>
                                </div>
                                <UButton variant="ghost" icon="i-heroicons-information-circle"
                                    @click="openActivityModal(selectedRut.cod_ciiu_act_econ_sec)" />
                            </div>
                        </div>
                    </div>

                    <!-- Información General -->
                    <div class="space-y-4">
                        <h4 class="font-semibold text-red-500 flex items-center gap-2">
                            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                            Información General
                        </h4>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm font-medium">Estado Matrícula {{ selectedRut?.matricula }}</p>
                                <UBadge :label="selectedRut?.estado_matricula"
                                    :color="selectedRut?.estado_matricula === 'ACTIVA' ? 'green' : 'red'" />
                            </div>

                            <div>
                                <p class="text-sm font-medium">Fecha Renovación</p>
                                <p class="text-sm">{{ formatDate(selectedRut?.fecha_renovacion) }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Tipo Sociedad</p>
                                <p class="text-sm">{{ selectedRut?.tipo_sociedad }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Organiacion Juridica</p>
                                <p class="text-sm">{{ selectedRut?.organizacion_juridica }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Representante Legal</p>
                                <p class="text-sm">{{ selectedRut?.representante_legal || 'No registrado' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Responsabilidades Tributarias -->
                <div class="mt-8" v-if="selectedRut?.responsabilidades?.length">
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-lg">
                        <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-primary-500" />
                        <span class="relative">
                            Responsabilidades Tributarias
                            <span
                                class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-purple-400"></span>
                        </span>
                    </h4>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div v-for="(res, index) in selectedRut.responsabilidades" :key="index"
                            class="group relative bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden">
                            <div class="flex items-start gap-3">
                                <div class="flex-shrink-0 mt-0.5">
                                    <div
                                        class="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                                        <UIcon name="i-heroicons-check-badge"
                                            class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-gray-800 dark:text-gray-100 truncate">
                                        {{ res.code }} - {{ res.name }}
                                    </p>
                                    <p v-if="res.tax_full"
                                        class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <UIcon name="i-heroicons-receipt-percent" class="w-4 h-4" />
                                        <span>Impuesto: {{ res.tax_full.name }}</span>
                                    </p>
                                </div>
                            </div>

                            <!-- Efecto hover decorativo -->
                            <div
                                class="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-primary-50/30 dark:from-primary-900/10 to-transparent">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-6" v-else>
                    <h4 class="font-semibold text-red-500 mb-4 flex items-center gap-2">
                        <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5" />
                        Sin Responsabilidades
                    </h4>
                    <UBadge label="Agregar Responsabilidades" color="red" variant="soft" class="cursor-pointer"
                        @click="openActivityModal(null)" />


                </div>
            </div>
        </UModal>

        <!-- Modal Detalles Actividad Económica -->
        <UModal v-model="isActivityModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
            <div v-if="selectedActivity" class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-red-600">
                        {{ selectedActivity.cseCodigo }} - {{ selectedActivity.cseTitulo }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                        @click="isActivityModalOpen = false" />
                </div>

                <div class="space-y-4">
                    <div>
                        <p class="font-medium text-sm mb-2">Descripción:</p>
                        <p class="text-gray-600 text-sm">{{ selectedActivity.cseDescripcion }}</p>
                    </div>

                    <!-- Incluye -->
                    <div v-if="selectedActivity.incluye && parseSafe(selectedActivity.incluye).length">
                        <p class="font-medium text-sm mb-2 text-green-600">Incluye:</p>
                        <ul class="list-disc pl-5 space-y-2">
                            <li v-for="(item, index) in parseSafe(selectedActivity.incluye)" :key="index"
                                class="text-sm text-gray-600">
                                {{ item.actDescripcion }}
                            </li>
                        </ul>
                    </div>

                    <!-- Excluye -->
                    <div v-if="selectedActivity.excluye && parseSafe(selectedActivity.excluye).length">
                        <p class="font-medium text-sm mb-2 text-red-600">Excluye:</p>
                        <ul class="list-disc pl-5 space-y-2">
                            <li v-for="(item, index) in parseSafe(selectedActivity.excluye)" :key="index"
                                class="text-sm text-gray-600">
                                {{ item.actDescripcion }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </UModal>
        <!-- Agrega este modal después del último UModal existente -->
        <UModal v-model="isNewThirdModalOpen" :ui="{ width: 'sm:max-w-md' }">
            <div class="p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-red-600">Nuevo Tercero</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                        @click="isNewThirdModalOpen = false" />
                </div>

                <UForm :state="newThird" @submit="createThird">
                    <div class="space-y-4">
                        <!-- Tipo de Tercero -->
                        <UFormGroup label="Tipo de Tercero" required>
                            <USelect v-model="newThirdType" :options="typeOptions" option-attribute="label"
                                placeholder="Seleccione el tipo" />
                        </UFormGroup>

                        <!-- Tipo de Documento -->
                        <UFormGroup label="Tipo de Documento" required>
                            <USelect v-model="newThirdDocType" :options="docTypeOptions" option-attribute="label"
                                placeholder="Seleccione documento" />
                        </UFormGroup>

                        <!-- Número de Identificación -->
                        <UFormGroup label="Número de Identificación" required>
                            <UInput v-model="newThirdIdNumber"
                                placeholder="Ingrese el número sin dígito de verificación" />
                        </UFormGroup>

                        <div class="flex justify-end gap-3">
                            <UButton type="button" variant="ghost" @click="isNewThirdModalOpen = false">
                                Cancelar
                            </UButton>
                            <UButton type="submit" color="primary">
                                Guardar
                            </UButton>
                        </div>
                    </div>
                </UForm>
            </div>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
import { FetchError } from "ofetch"
import Swal from 'sweetalert2'
import { format } from 'date-fns'

const title = ref("Terceros")
const showTableList = ref(true)
const newEntity = ref(false)
const thirdSelected = ref({})
const toast = useToast()

// Estados para los modales
const isRutModalOpen = ref(false)
const selectedRut = ref<any>(null)
const isActivityModalOpen = ref(false)
const selectedActivity = ref<any>(null)

const isNewThirdModalOpen = ref(false)
const newThirdIdNumber = ref<string>('')
const newThirdType = ref<number>(1)
const newThirdDocType = ref<string>('CC')

const docTypeOptions = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'NIT', label: 'NIT' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' }
]

const typeOptions = [
    { value: 1, label: 'Persona' },
    { value: 2, label: 'Empresa' }
]

const verificationOptions = [
    { value: 4, label: 'Verificado' },
    { value: 3, label: 'Pendiente' },
    { value: 0, label: 'No verificado' }
]

const filters = ref({
    search: null,
    id_number: null,
    type: null,
    id_verified: null
})

const resetFilters = () => {
    filters.value = {
        search: null,
        id_number: null,
        type: null,
        id_verified: null
    }
}

const {
    data: thirds,
    pagination,
    search,
    pending,
    refresh
} = usePaginatedFetch<any>("/api/third/")

const fullName = (third: any) => {
    if (third.type_full.id == 2) {
        return third.rut?.razon_social || third.business_name || '-'
    }
    return [third.first_name, third.second_name, third.last_name, third.second_last_name]
        .filter(Boolean).join(' ') || ' - '
}

const formatDate = (dateString: string) => {
    return dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-'
}

const handleEditClicked = () => {
    refresh()
    cancelAction()
}

const cancelAction = () => {
    newEntity.value = false
    showTableList.value = true
    thirdSelected.value = {}
    refresh()
}

const showModalThird = (third: any) => {
    if (!third) { // Modo creación
        isNewThirdModalOpen.value = true
        return
    }
    // Modo edición (tu lógica existente)
    thirdSelected.value = third || {}
    newEntity.value = true
    showTableList.value = false
}

const createThird = async () => {
    try {
        await $fetch('/api/third/', {
            method: 'POST',
            body: {
                type: newThirdType.value,
                doc_type: newThirdDocType.value,
                id_number: newThirdIdNumber.value
            }
        });

        // Reset y actualización
        isNewThirdModalOpen.value = false;
        refresh();
        Swal.fire('Éxito', 'Tercero creado correctamente', 'success');

    } catch (error) {
        let errorMessages: string[] = [];

        if (error instanceof FetchError) {
            // Extraer mensajes de error del response
            const errors = error.data?.errors || error.data;

            if (typeof errors === 'object' && errors !== null) {
                // Recorrer todas las claves del objeto de errores
                errorMessages = Object.values(errors)
                    .flat() // Aplanar arrays anidados
                    .filter(msg => typeof msg === 'string'); // Solo mensajes de texto
            }
        }

        // Mensaje por defecto si no se encontraron mensajes
        if (errorMessages.length === 0) {
            errorMessages.push('Error al crear el tercero');
        }

        // Mostrar todos los mensajes en líneas separadas
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: errorMessages.join('<br>') // Separar mensajes con saltos de línea
        });
    }
};

const deleteThird = async (id: number) => {
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        })

        if (!result.isConfirmed) return

        await $fetch(`api/third/${id}`, {
            method: 'DELETE'
        })
        refresh()
        await Swal.fire('¡Eliminado!', 'El tercero ha sido eliminado.', 'success')
    } catch (error) {
        let errorMessage = 'Error al eliminar el tercero.'
        if (error instanceof FetchError) {
            errorMessage += ' ' + error.data?.error
        }
        await Swal.fire('Error', errorMessage, 'error')
    }
}

const ui = {
    td: 'p-3 border',
    th: 'p-3 border bg-gray-50 font-semibold',
}

const rowSelected = ref(null)
const handleRowClick = (third: any) => {
    rowSelected.value = third === rowSelected.value ? null : third
}

const isSelected = (third: any) => {
    return rowSelected.value === third
}

const selectedEntity = { value: { entity: 'Reporte de Terceros' } }
const selectedColumns = {
    value: [
        { label: 'Creado' },
        { label: 'Nombre' },
        { label: 'Identificación' },
        { label: 'Tipo' },
        { label: 'Verificado' }
    ]
}

const parseSafe = (jsonString: string | null) => {
    try {
        if (!jsonString) return [];
        // Reemplazar comillas simples por dobles
        const fixedJson = jsonString.replace(/'/g, '"');
        return JSON.parse(fixedJson);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
    }
};

// Funciones para los modales
const openRutModal = (rutData: any) => {
    selectedRut.value = rutData
    isRutModalOpen.value = true
}

const openActivityModal = (activity: any) => {
    if (!activity) return; // Evita asignar null/undefined
    selectedActivity.value = activity;
    isActivityModalOpen.value = true;
};

const generateReport = async () => {
    // Lógica para generar reporte
}

onMounted(() => {
    refresh()
})
</script>

<style scoped>
.detail-item {
    @apply py-1 border-b border-gray-100;
}

.activity-card {
    @apply transition-colors duration-200 cursor-pointer;
}

.responsabilidad-item {
    @apply hover:bg-gray-50;
}

.modal-section-title {
    @apply text-lg font-semibold mb-4 pb-2 border-b border-red-200;
}
</style>