<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Crear Nuevo Tercero</h2>
      <form @submit.prevent="submitForm">
        <!-- Select Tipo de Persona -->
        <div class="form-group">
          <SelectThirdTypes v-model="type_full" @change="loadRegiments" :icons="false"
            :labelpredeterminado="'Tipo de Persona'" />
        </div>

        <!-- Select Tipo de Identificación -->
        <div class="form-group">
          <SelectIdentificationTypes :icons="false" :labelpredeterminado="'Tipo de Identificación'"
            v-model="id_type_full" />
        </div>

        <!-- Select Tipo de Régimen (dinámico) -->

        <div class="form-group">
          <label>Tipo de Régimen</label>
          <USelectMenu v-model="regimen_full" :options="types_regiments" option-attribute="name"
            placeholder="Seleccione un régimen" />
        </div>

        <!-- Input Numérico -->
        <div class="form-group">
          <label>Número de Identificación</label>
          <input v-model="identifier" type="text" 
            inputmode="numeric" 
            placeholder="Sin dígito de verificación"
            required
            class="input-number"
            @keydown="handleNumericInput"
            @paste="handlePaste"
          />
        </div>

        <!-- Botones de Acción -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading || !formValid">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';

interface Regimen {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface ThirdType {
  id: number;
  name: string;
  regiments_full: Regimen[];
  code: string;
}

interface IdentificationType {
  id: number;
  name: string;
  regiments_full: Regimen[];
  code: string;
}

const emit = defineEmits(['close', 'created']);

// Datos del formulario
const type_full = ref<ThirdType | null>(null);
const id_type_full = ref<IdentificationType | null>(null);
const identifier = ref<string>('');
const regimen_full = ref<Regimen | null>(null);
const loading = ref(false);
const types_regiments = ref<Regimen[]>([]);

const handleNumericInput = (event: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  const isNumber = /^[0-9]$/i.test(event.key);
  
  if (!isNumber && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const pasteData = event.clipboardData?.getData('text') || '';
  if (!/^\d+$/.test(pasteData)) {
    event.preventDefault();
  }
};

watch(identifier, (newVal) => {
  identifier.value = newVal.replace(/[^\d]/g, '');
});

const loadRegiments = () => {
  console.log('Tipo de persona seleccionado:', type_full.value);
  if (type_full.value) {
    types_regiments.value = type_full.value.regiments_full || [];
    console.log('Regímenes cargados:', types_regiments.value);
  } else {
    types_regiments.value = [];
  }
};

watch(type_full, (newVal) => {
  console.log('Tipo de persona cambiado (watcher):', newVal);
  loadRegiments();
});

const submitForm = async () => {
  if (!formValid.value) return;

  loading.value = true;

  try {
    const response = await fetch('/api/third', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type_full.value?.id,
        id_type: id_type_full.value?.id,
        id_number: identifier.value,
        regiment: regimen_full.value?.id,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar el tercero');
    }

    const data = await response.json();

    // Mostrar alerta de éxito
    await Swal.fire({
      title: '¡Éxito!',
      text: 'El tercero ha sido creado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#6699CC',
    });

    emit('created', data);
    closeModal();
  } catch (error) {
    console.error('Error:', error);

    // Mostrar alerta de error
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Ocurrió un error al intentar guardar el tercero',
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#6699CC',
    });
  } finally {
    loading.value = false;
  }
};

const formValid = computed(() => {
  return type_full.value?.id &&
    id_type_full.value?.id &&
    identifier.value &&
    regimen_full.value?.id;
});

const closeModal = () => {
  emit('close');
};
</script>


<style scoped>
input:focus {
  border-color: #007bff;
  /* Borde azul al enfocar */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* Sombra azul al enfocar */
}

select:focus {
  border-color: #007bff;
  /* Borde azul al enfocar */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* Sombra azul al enfocar */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.form-group label {
  display: block;
  text-align: left;
  margin-bottom: 5px;
  font-weight: 500;
  color: #444;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  outline: none;
  transition: border 0.3s ease;
  cursor: pointer;

}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Botones */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 15px;
}

.input-number {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s ease;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-submit {
  background-color: #6699CC;
  /* Color azul para que se vea */
  color: white;
  /* Texto blanco para contraste */
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;
}

.btn-submit:hover {
  background: #0056b3;
  /* Azul más oscuro al pasar el mouse */
}


.btn-cancel {
  background: #ccc;
  color: #333;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;
}

.btn-cancel:hover {
  background: #b3b3b3;
}
</style>