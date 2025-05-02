<template>
    <UModal v-model="isOpen">
      <div class="p-4 bg-white rounded-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold">
          {{ rutData.id ? 'Editar RUT' : 'Crear RUT' }}
        </h3>
  
        <!-- Formulario RUT -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Sección Información Básica -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Información Básica</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UInput v-model="rutData.razon_social" label="Razón Social*" required />
              <UInput v-model="rutData.sigla" label="Sigla" />
              <UInput v-model="rutData.digito_verificacion" label="Dígito Verificación" />
            </div>
          </div>
  
          <!-- Sección Matrícula -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Matrícula Mercantil</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UInput v-model="rutData.matricula" label="Número Matrícula" />
              <SelectCities v-model="rutData.camara_comercio" label="Cámara de Comercio" />
              <UInput v-model="rutData.codigo_camara" label="Código Cámara" />
              <UInput v-model="rutData.inscripcion_proponente" label="Inscripción Proponente" />
              <UInput v-model="rutData.fecha_matricula" type="date" label="Fecha Matrícula" />
              <UInput v-model="rutData.fecha_renovacion" type="date" label="Fecha Renovación" />
            </div>
          </div>
  
          <!-- Sección Actividades Económicas -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Actividades Económicas</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectEconomicActivities 
                v-model="rutData.cod_ciiu_act_econ_pri" 
                label="Actividad Económica Principal" 
              />
              <SelectEconomicActivities 
                v-model="rutData.cod_ciiu_act_econ_sec" 
                label="Actividad Económica Secundaria" 
              />
              <SelectEconomicActivities 
                v-model="rutData.ciiu3" 
                label="CIIU 3" 
              />
              <SelectEconomicActivities 
                v-model="rutData.ciiu4" 
                label="CIIU 4" 
              />
            </div>
          </div>
  
          <!-- Sección Representante Legal -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Representante Legal</h4>
            <SelectThird 
              v-model="rutData.representante_legal" 
              label="Representante Legal"
              :filter-types="[1]"  
            />
          </div>
  
          <!-- Sección Información Tributaria -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Información Tributaria</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectCountry v-model="rutData.pais" label="País" />
              <SelectDepartments 
                v-model="rutData.departamento" 
                label="Departamento" 
                :country-id="rutData.pais?.id"
              />
              <SelectCities 
                v-model="rutData.ciudad_municipio" 
                label="Ciudad/Municipio" 
                :department-id="rutData.departamento?.id"
              />
              <UInput v-model="rutData.direccion_principal" label="Dirección Principal" />
              <UInput v-model="rutData.correo_electronico" type="email" label="Correo Electrónico" />
              <UInput v-model="rutData.telefono_1" label="Teléfono 1" />
              <UInput v-model="rutData.telefono_2" label="Teléfono 2" />
            </div>
          </div>
  
          <!-- Sección Responsabilidades -->
          <div class="md:col-span-2">
            <h4 class="font-medium text-gray-700 mb-2">Responsabilidades</h4>
            <SelectMultiResponsabilitys 
              v-model="rutData.responsabilidades" 
              label="Responsabilidades" 
            />
          </div>
        </div>
  
        <div class="flex justify-end gap-2 mt-4">
          <UButton color="gray" @click="isOpen = false">Cancelar</UButton>
          <UButton color="primary" @click="saveRut" :loading="isSaving">
            {{ rutData.id ? 'Actualizar' : 'Guardar' }}
          </UButton>
        </div>
      </div>
    </UModal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    thirdId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'saved']);
  
  const isOpen = ref(false);
  const isSaving = ref(false);
  const rutData = ref({
    id: null,
    third: null,
    razon_social: '',
    // ... todos los demás campos del modelo RUT
  });
  
  // Abrir modal y cargar datos si existe
  const openModal = async () => {
    isOpen.value = true;
    if (props.thirdId) {
      try {
        const { data } = await useFetch(`/api/rut/?third=${props.thirdId}`);
        if (data.value?.results?.length) {
          rutData.value = data.value.results[0];
        } else {
          resetForm();
        }
      } catch (error) {
        console.error('Error cargando RUT:', error);
        resetForm();
      }
    }
  };
  
  // Resetear formulario
  const resetForm = () => {
    rutData.value = {
      id: null,
      third: props.thirdId,
      razon_social: '',
      // ... inicializar todos los demás campos
    };
  };
  
  // Guardar RUT
  const saveRut = async () => {
    isSaving.value = true;
    try {
      const url = rutData.value.id 
        ? `/api/rut/${rutData.value.id}/` 
        : '/api/rut/';
      const method = rutData.value.id ? 'PUT' : 'POST';
  
      const { data, error } = await useFetch(url, {
        method,
        body: rutData.value
      });
  
      if (error.value) throw error.value;
  
      emit('saved', data.value);
      isOpen.value = false;
    } catch (error) {
      console.error('Error guardando RUT:', error);
    } finally {
      isSaving.value = false;
    }
  };
  
  // Sincronizar con v-model
  watch(() => props.modelValue, (val) => {
    if (val) openModal();
    else isOpen.value = false;
  });
  
  watch(isOpen, (val) => {
    emit('update:modelValue', val);
  });
  </script>