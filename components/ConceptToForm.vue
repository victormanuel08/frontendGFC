<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="concept-relation-form" :class="modalWidth">
            <h2>{{ isEdit ? 'Editar' : 'Crear' }} Campeonato - Planes - Precio</h2>
            <form @submit.prevent="handleSubmit">
                <div :class="['grid gap-4', conceptTypeClass]">
                    <div>
                        <div class="input-group">
                            <label for="concept_from">{{props.conceptFrom.name }} - {{props.conceptFrom.date }}</label>
                            <SelectConcept v-model="concept_from" :concept_type="concept" required v-if="!props.conceptFrom"/>
                        </div>
                        <div class="input-group">
                            <label for="concept_to">Plan</label>
                            <SelectConcept v-model="concept_to" :concept_type="conceptPlan" required />
                        </div>
                        <div class="input-group">
                            <label for="price">Precio</label>
                            <UInput v-model="price" type="number" step="0.01" required />
                        </div>
                        <div class="input-group">
                            <label for="groups">Grupos</label>
                            <SelectGroups v-model="groups" multiple required />
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button type="submit" class="submit-btn">{{ isEdit.value ? 'Editar' : 'Crear' }}</button>
                    <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

const conceptPlan = { id: 1, name: 'Planes de Entrenamiento' };
const concept = ref<string>('Campeonato');
const props = defineProps({
    isOpen: Boolean,
    conceptFrom: Object, // El concepto 'desde' puede venir como prop
    conceptFromType: Object, // Tipo de concepto 'desde'
    toConceptType: Object, // Tipo de concepto 'hacia'
    isEdit: Boolean,
    relationId: Number // ID para editar relación existente
});

const emit = defineEmits(['close', 'saved']);

const concept_from = ref(props.conceptFrom || null);
const concept_to = ref(null);
const price = ref(0.00);
const groups = ref([]);
const isEdit = ref(props.isEdit);

const conceptTypeClass = computed(() => props.conceptFrom ? 'grid-cols-1' : 'grid-cols-2');
const modalWidth = computed(() => props.conceptFrom ? 'max-w-400' : 'max-w-600');

onMounted(() => {
    if (props.conceptFrom) {
        concept_from.value = props.conceptFrom;
    }
    if (props.relationId) {
        loadRelationData(props.relationId);
    }
});

const loadRelationData = async (relationId) => {
    try {
        const response = await $fetch(`api/documents/conceptrelations/${relationId}`);
        const data = response.data.results[0]; // Accedemos al primer resultado

        concept_from.value = {
            id: data.concept_from,
            name: data.concept_from_name
        };
        concept_to.value = {
            id: data.concept_to,
            name: data.concept_to_name
        };
        price.value = parseFloat(data.price);
        groups.value = data.groups.map(group => ({ id: group.id, name: group.name })); // Mantener el objeto completo
        isEdit.value = true;
    } catch (error) {
        console.error('Error al cargar datos de la relación:', error);
        isEdit.value = false;
    }
};

const handleSubmit = () => {
    if (isEdit.value) {
        updateConceptRelation();
    } else {
        createConceptRelation();
    }
};

const createConceptRelation = async () => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de crear esta relación de concepto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
        return;
    }

    try {
        await $fetch('api/documents/conceptrelations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                concept_from: concept_from.value.id,
                concept_to: concept_to.value.id,
                price: price.value,
                groups: groups.value.map(group => group.id) // Solo enviar IDs de grupos
            })
        });

        resetForm();
        emit('saved'); // Emitir evento 'saved' después de la creación
        emit('close');
        Swal.fire({
            title: 'Éxito',
            text: 'Relación de concepto creada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } catch (error) {
        console.error('Error al crear la relación de concepto:', error);
        Swal.fire({
            title: 'Error',
            text: error.data?.message || 'Ocurrió un error al crear la relación de concepto',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        emit('close');
    }
};

const updateConceptRelation = async () => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de actualizar esta relación de concepto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
        return;
    }

    try {
        await $fetch(`api/documents/conceptrelations/${props.relationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                concept_from: concept_from.value.id,
                concept_to: concept_to.value.id,
                price: price.value,
                groups: groups.value.map(group => group.id) // Solo enviar IDs de grupos
            })
        });

        resetForm();
        emit('saved'); // Emitir evento 'saved' después de la actualización
        emit('close');
        Swal.fire({
            title: 'Éxito',
            text: 'Relación de concepto actualizada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } catch (error) {
        console.error('Error al actualizar la relación de concepto:', error);
        Swal.fire({
            title: 'Error',
            text: error.data?.message || 'Ocurrió un error al actualizar la relación de concepto',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        emit('close');
    }
};

const resetForm = () => {
    if (!props.conceptFrom) {
        concept_from.value = null;
    }
    concept_to.value = null;
    price.value = 0.00;
    groups.value = [];
    isEdit.value = false;
};

const checkExistingRelation = async () => {
    if (concept_from.value && concept_to.value) {
        try {
            const response = await $fetch('api/documents/conceptrelations/', {
                method: 'GET',
                query: {
                    concept_from: concept_from.value.id,
                    concept_to: concept_to.value.id
                }
            });

            if (response.results.length > 0) {
                // Si existe una relación, cargar los datos
                const relation = response.results[0];
                concept_from.value = {
                    id: relation.concept_from,
                    name: relation.concept_from_name
                };
                concept_to.value = {
                    id: relation.concept_to,
                    name: relation.concept_to_name
                };
                price.value = parseFloat(relation.price);
                groups.value = relation.groups.map(group => ({ id: group.id, name: group.name })); // Mantener el objeto completo
                isEdit.value = true;
            } else {
                // Si no existe una relación, no resetear el formulario
                isEdit.value = false;
            }
        } catch (error) {
            console.error('Error al verificar la relación de concepto:', error);
        }
    }
};

watch([concept_from, concept_to], (newValues, oldValues) => {
    if (newValues[0]?.id !== oldValues[0]?.id || newValues[1]?.id !== oldValues[1]?.id) {
        checkExistingRelation();
    }
});

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

.concept-relation-form {
    background: #fff;
    padding: 20px 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
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
