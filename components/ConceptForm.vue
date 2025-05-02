<template>
    <!-- Modal del Formulario de Concepto -->
    <div class="modal-overlay" @click.self="closeModal">
      <div class="payment-form" :class="modalWidth">
        <h2>{{ isEdit ? 'Editar' : 'Crear' }} {{ props.conceptType?.name }}</h2>
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <div :class="['grid gap-4', thirdTypeClass]">
            <div>
              <div class="input-group">
                <label for="code">Código</label>
                <UInput v-model="code" required />
              </div>
              <div class="input-group">
                <label for="name">Nombre</label>
                <UInput v-model="name" required />
              </div>
              <div class="input-group">
                <label for="description">Descripción</label>
                <UInput v-model="description" required />
              </div>
              <div class="input-group">
                <label for="acountaux">Cuenta Auxiliar</label>
                <SelectAccountAux v-model="acountaux" />
              </div>
            </div>
            <div>
              <div class="input-group" v-if="props.conceptType.code == 'CC'">
                <label for="date">Fecha</label>
                <UInput type="date" v-model="date" required />
              </div>
              <div class="input-group" v-if="props.conceptType.code != 'CC'">
                <label for="price">Valor</label>
                <UInput v-model="price" />
              </div>
              <div class="input-group" v-if="props.conceptType.code != 'CL'">
                <label for="image">Imagen</label>
                <input type="file" @change="handleFileUpload" required />
              </div>
            </div>
          </div>
          <div class="button-group">
            <button type="submit" class="submit-btn">{{ isEdit ? 'Editar' : 'Crear' }} {{ props.conceptType?.name }}</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps, defineEmits } from 'vue';
  
  const thirdTypeClass = computed(() => props.thirdType === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1');
  const modalWidth = computed(() => props.thirdType === 'STUDENT' ? 'max-w-600' : 'max-w-400');
  
  // Definir props correctamente
  const props = defineProps({
    isOpen: Boolean,
    conceptType: Object,
  });
  
  // Emitir eventos
  const emit = defineEmits(['close', 'saved']);
  
  // Computed para verificar si es edición
  const isEdit = computed(() => !!props.thirdId);
  
  // Variables reactivas del formulario
  const name = ref('');
  const code = ref('');
  const price = ref('');
  const description = ref('');
  const acountaux = ref({});
  const concept_type = ref({});
  const date = ref('');
  const image = ref<File | null>(null);
  
  // Método para manejar el cambio de archivo
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      image.value = target.files[0];
    }
  };
  
  // Método de envío del formulario
  const handleSubmit = () => {
    if (isEdit.value) {
      updateConcept();
    } else {
      createConcept();
    }
  };
  
  const createConcept = async () => {
    const message = confirm('¿Estás seguro de crear este Concepto?');
  
    if (!message) {
      resetForm();
      return;
    }
  
    if (props.conceptType.code === 'CC') {
      alert('Campeonato.');
      //return;
    }
  
    try {
      const formData = new FormData();
      formData.append('code', code.value);
      formData.append('name', name.value);
      formData.append('price', price.value ? parseFloat(price.value) : 0);
      formData.append('description', description.value);
      formData.append('account_aux', acountaux.value ? acountaux.value.id : null);
      formData.append('concept_type', props.conceptType.id ? props.conceptType.id : null);
      if (image.value) {
        formData.append('image', image.value);
      }
      formData.append('date', date.value);
  
      const response = await $fetch('api/documents/concepttypes', {
        method: 'POST',
        body: formData,
      });
  
      resetForm();
      emit('close');
    } catch (error) {
      console.error('Error al crear el Concepto:', error);
      alert('Ocurrió un error al crear el Concepto.');
    }
  };
  
  // Función para resetear el formulario
  const resetForm = () => {
    name.value = '';
    code.value = '';
    price.value = '';
    description.value = '';
    acountaux.value = {};
    concept_type.value = {};
    date.value = '';
    image.value = null;
  };
  
  // Método para cerrar el modal
  const closeModal = () => {
    emit('close');
  };
  </script>
  


<style scoped>
/* Fondo oscuro para el overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.payment-form {
    background: #fff;
    padding: 20px 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    /* max-width: 600px;  Antes estaba en 400px */
}

.max-w-400 {
    max-width: 400px;
}

.max-w-600 {
    max-width: 600px;
}


/* Ajuste en la distribución */
.grid {
    display: grid;
    gap: 20px;
    /* Mantiene la separación */
}

.grid-cols-1 {
    grid-template-columns: 1fr;
    /* Solo una columna */
}

.grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
    /* Dos columnas */
}



.input-group {
    margin-bottom: 15px;
}

input,
select {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border 0.3s ease;
}

input:focus,
select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 15px;
}

.submit-btn,
.cancel-btn {
    background: #212529;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.submit-btn:hover {
    background: #343a40;
}

.cancel-btn {
    background: #ccc;
    color: #333;
}

.cancel-btn:hover {
    background: #b3b3b3;
}
</style>
