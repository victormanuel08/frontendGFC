<template>
    <!-- Modal del Formulario de Pago -->
    <div class="modal-overlay" @click.self="closeModal">
      <div class="payment-form">        
        <h2>{{ isEdit ? 'Editar Documento' : 'Crear Documento' }}</h2>
        <form @submit.prevent="handleSubmit">

        <div class="input-group">
            <label for="amount">Tipo Documento</label>
            <SelectDocumentType               
              v-model="documenttype"              
              required             
            />
        </div>

          <!-- Campos del formulario -->
        <div class="input-group">
            <label for="payer-id">Responsable</label>
            <SelectThird 
              :type="'PARENT'"
              v-model="payer"              
              required              
            />           
        </div>
  
        <div class="input-group">
            <label for="beneficiary-id">Estudiante</label>
            <SelectThird 
              :type="'STUDENT'"
              :parent="payer"
              v-model="beneficiary"              
              required              
            />            
        </div>
        <div class="input-group">
            <label for="amount">Concepto</label>
            <SelectConcept 
              :concept_type="concept_type"
              v-model="concept"              
              required
            />
        </div>

        <div class="button-group">
            <button type="submit" class="submit-btn">{{ isEdit ? 'Editar Documento' : 'Crear Documento' }}</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
        </div>
        </form>
      </div>
    </div>
  </template>

<script setup>

import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['close', 'saved']);

const isEdit = computed(() => !!props.documentId);

const props = defineProps({
    isOpen: Boolean,
    documentId: Number,
});

const payer = ref({});
const beneficiary = ref({});
const document = ref({});
const documenttype = ref({});
const totalAmount = ref('');
const observations = ref('');

const concept_type = ref('');
const concept = ref({});





// Método de envío del formulario
const handleSubmit = () => {
    console.log('Formulario enviado:', {
        payerId: payer.value,
        beneficiaryId: beneficiary.value,
        amount: amount.value,
        document: document.value,
        observations: observations.value,
        concept: concept.value,

    });
};

// Método para cerrar el modal
const closeModal = () => {
    emit('close'); // Emitir el evento para cerrar el modal desde el componente padre
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

/* Estilo del formulario de pago */
.payment-form {
    background: #fff;
    padding: 20px 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
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


