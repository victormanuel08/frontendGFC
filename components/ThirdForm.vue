<template>
    <!-- Modal del Formulario de Pago -->
    <div class="modal-overlay" @click.self="closeModal">
        <div class="payment-form" :class="modalWidth">
            <h2>{{ isEdit ? 'Editar' : 'Crear' }} {{ thirdTypeLabel }}</h2>
            <form @submit.prevent="handleSubmit">
                <div :class="['grid gap-4', thirdTypeClass]">
                    <div>
                        <div class="input-group" v-if="props.thirdType === 'STUDENT' && !props.thirdId">
                            <label for="parent">Responsable</label>
                            <SelectThird type="PARENT" v-model="payer" required />
                        </div>
                        <div class="input-group" v-if="props.thirdType === 'STUDENT'">
                            <label for="location">Sede Deportiva</label>
                            <SelectLocation v-model="location" required />
                        </div>
                        
                        
                        <div class="input-group" v-if="props.thirdType === 'STUDENT' && !props.concept">
                            <label for="concept">Concepto</label>
                            <SelectConcept v-model="concept" :concept_type="concept" required />
                        </div>

                        <div class="input-group" v-if="props.thirdType === 'STUDENT'">
                            <label >Plan</label>
                            <SelectConcept v-model="conceptP" :concept_type="conceptPlan" required />
                        </div>
                    </div>
                    <div>
                        <div class="input-group">
                            <label for="first_name">Nombres</label>
                            <UInput v-model="first_name" required />
                        </div>
                        <div class="input-group">
                            <label for="last_name">Apellidos</label>
                            <UInput v-model="last_name" required />
                        </div>
                        <div class="input-group">
                            <label for="id_number">Número Identificación</label>
                            <UInput v-model="id_number" required />
                        </div>
                        <div class="input-group">
                            <label for="email">Email</label>
                            <UInput v-model="email" required />
                        </div>
                        <div class="input-group">
                            <label for="phone">Teléfono</label>
                            <UInput v-model="phone" required />
                        </div>
                        <div class="input-group">
                            <label for="date_birth">Fecha de Nacimiento</label>
                            <UInput type="date" v-model="date_birth" required />
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button type="submit" class="submit-btn">{{ isEdit ? 'Editar' : 'Crear' }} {{ thirdTypeLabel }}</button>
                    <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import Swal from 'sweetalert2';

const thirdTypeClass = computed(() => props.thirdType === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1');
const modalWidth = computed(() => props.thirdType === 'STUDENT' ? 'max-w-600' : 'max-w-400');
const conceptPlan = { id: 1, name: 'Planes de Entrenamiento' }
// Definir props correctamente
const props = defineProps({
    isOpen: Boolean,
    thirdId: Number, // ID del padre
    thirdIdPropio: Number, // ID del estudiante
    thirdType: String,
    concept: String
});

onMounted(() => {
    if (props.concept) {
        concept.value = props.concept;
    }
    if (props.thirdId) {
        payer.value = { id: props.thirdId };
    }
    if (props.thirdIdPropio) {
        // Cargar los datos del estudiante para edición si está presente
        loadStudentData(props.thirdIdPropio);
    }
});

// Emitir eventos
const emit = defineEmits(['close', 'saved']);

// Computed para verificar si es edición
const isEdit = computed(() => !!props.thirdIdPropio);


// Computed para obtener la etiqueta correcta
const thirdTypeLabel = computed(() => {
    return props.thirdType === 'PARENT' ? 'Responsable' : 'Estudiante';
});

// Variables reactivas del formulario
const first_name = ref('');
const last_name = ref('');
const id_number = ref('');
const email = ref('');
const phone = ref('');
const date_birth = ref('');
const payer = ref(null);
const location = ref(null);
const concept = ref(null);
const conceptP = ref(null);


// Método de envío del formulario
const handleSubmit = () => {
    if (isEdit.value) {
        updateThird();
    } else {
        createThird();
    }
};

// Cargar datos del estudiante para edición
const loadStudentData = async (studentId) => {
  try {
    const response = await $fetch(`api/entities/thirds/${studentId}`);
    const data = await response.json();

    // Asignar los datos cargados a las variables reactivas
    first_name.value = data.first_name;
    last_name.value = data.last_name;
    id_number.value = data.id_number;
    email.value = data.email;
    phone.value = data.phone;
    date_birth.value = data.date_birth;
    location.value = data.location ? data.location.id : null;
    concept.value = data.training_plan ? data.training_plan.id : null;
    training_plan.value = data.training_plan ? data.training_plan.id : null;
  } catch (error) {
    console.error('Error al cargar datos del estudiante:', error);
  }
};

const createThird = async () => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de crear este Tercero?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
        resetForm();
        return;
    }

    try {
        const response = await $fetch('api/entities/thirds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                type: props.thirdType,
                parent: props.thirdId ? props.thirdId : (payer.value ? payer.value.id : null), // Evita el error si es null
                first_name: first_name.value,
                last_name: last_name.value,
                id_number: id_number.value,
                email: email.value,
                phone: phone.value,
                date_birth: date_birth.value,
                location: location.value ? location.value.id : null,
                training_plan: conceptP.value ? conceptP.value.id : null,
            })
        });

        resetForm();
        emit('saved'); // Emitir evento 'saved' después de la creación
        emit('close');
        Swal.fire({
            title: 'Éxito',
            text: 'Tercero creado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } catch (error) {
        console.error('Error al crear el tercero:', error);
        Swal.fire({
            title: 'Error',
            text: error.data?.message || 'Ocurrió un error al crear el Tercero',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        emit('close');
    }
};

// Función para resetear el formulario
const resetForm = () => {
    first_name.value = '';
    last_name.value = '';
    id_number.value = '';
    email.value = '';
    phone.value = '';
    date_birth.value = '';
    location.value = null;
    concept.value = null;
    payer.value = null;
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
