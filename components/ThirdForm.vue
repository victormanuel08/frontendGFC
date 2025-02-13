<template>
    <!-- Modal del Formulario de Pago -->
    <div class="modal-overlay" @click.self="closeModal">
        <div class="payment-form" :class="modalWidth">
            <h2>{{ isEdit ? 'Editar' : 'Crear' }} {{ thirdTypeLabel }}</h2>
            <form @submit.prevent="handleSubmit">
                <div :class="['grid gap-4', thirdTypeClass]">
                    <div>
                        <div class="input-group" v-if="props.thirdType === 'STUDENT'">
                            <label for="parent">Padre</label>
                            <SelectThird type="PARENT" v-model="payer" required />
                        </div>
                        <div class="input-group" v-if="props.thirdType === 'STUDENT'">
                            <label for="location">Sede Deportiva</label>
                            <SelectLocation v-model="location" required />
                        </div>
                        <div class="input-group" v-if="props.thirdType === 'STUDENT'">
                            <label for="concept">Concepto</label>
                            <SelectConcept v-model="concept" :concept_type="conceptPlan" required />
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
                    <button type="submit" class="submit-btn">{{ isEdit ? 'Editar' : 'Crear' }} {{ thirdTypeLabel
                        }}</button>
                    <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
                </div>

            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const thirdTypeClass = computed(() => props.thirdType === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1');
const modalWidth = computed(() => props.thirdType === 'STUDENT' ? 'max-w-600' : 'max-w-400');


// Definir props correctamente
const props = defineProps({
    isOpen: Boolean,
    thirdId: Number,
    thirdType: String,
});

// Emitir eventos
const emit = defineEmits(['close', 'saved']);

// Computed para verificar si es edición
const isEdit = computed(() => !!props.thirdId);
const conceptPlan = { id: 1, name: 'Planes de Entrenamiento' }

// Computed para obtener la etiqueta correcta
const thirdTypeLabel = computed(() => {
    return props.thirdType === 'PARENT' ? 'Padre' : 'Estudiante';
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

// Método de envío del formulario
const handleSubmit = () => {
    if (isEdit.value) {
        updateThird();
    } else {
        createThird();
    }
};
const createThird = async () => {
    const message = confirm('¿Estás seguro de crear este Tercero?');

    if (!message) {
        resetForm();
        return;
    }

    if (props.thirdType === 'STUDENT' && !payer.value) {
        alert('Por favor selecciona un Padre.');
        return;
    }

    try {
        const response = await $fetch('api/entities/thirds', {
            method: 'POST',
            body: {
                type: props.thirdType,
                parent: payer.value ? payer.value.id : null, // Evita el error si es null
                first_name: first_name.value,
                last_name: last_name.value,
                id_number: id_number.value,
                email: email.value,
                phone: phone.value,
                date_birth: date_birth.value,
                location: location.value ? location.value.id : null,
                training_plan: concept.value ? concept.value.id : null,
                
            },
        });

        resetForm();
        emit('close');
    } catch (error) {
        console.error('Error al crear el tercero:', error);
        alert('Ocurrió un error al crear el tercero.');
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
