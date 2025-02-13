<template>
    <div class="modal-payment" @click.self="closeModal">
        <div class="modal">
            <h2>VISOR DOCUMENTOS</h2>
            <div class="forgot-password">
                <UCard class="w-full  bg-gray-100 h-max mt-4" v-if="isPreview">
                    <div class="justify-center items-center flex gap-3 my-3">
                        <UButton @click="$emit('close')" class="bg-red-500 text-white">Cerrar</UButton>                  

                    </div>
                    <div>
                        <iframe :src="pagerecord" width="100%" height="600px"></iframe>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isPreview = ref<boolean>(false)
const pagerecord = ref('')

type Document = {
    id: number;
    name: string;
    doc_type: string;    
};

const props = defineProps<{    
    document: Document;
    type: string;   
}>();

const emit = defineEmits(['close']);

onMounted(() => { 
    
    //pagerecord.value = `api/pdf/CC/747`;
}); 


isPreview.value = true;
pagerecord.value = `api/pdf/${props.type}/${props.document.id}`;


const closeModal = () => {
    emit('close');
};


</script>

<style scoped>
/* Overlay del modal */
.modal-payment {
    width: 60%;
    max-width: 500px;
    height: 80vh; /* 80% de la altura de la pantalla */
    max-height: 600px; /* Máximo de 600px */
    overflow-y: auto; /* Permite desplazamiento si el contenido es muy grande */
}



/* Estilo del modal */
.modal {
    background: #fff;
    padding: 20px 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
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



.form-group {
    margin-bottom: 15px;
}

input {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border 0.3s ease;
}

input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Botones */
.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 15px;
}

.btn-submit {
    background: #212529;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    flex: 1;
}

.btn-submit:hover {
    background: #343a40;
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

/* Enlace para recuperar contraseña */
.forgot-password {
    margin-top: 15px;
}

.forgot-password a {
    color: #007bff;
    text-decoration: none;
    font-size: 14px;
}

.forgot-password a:hover {
    text-decoration: underline;
}
</style>