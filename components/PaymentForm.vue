<template>

  <div class="modal-overlay" @click.self="closeModal">
    <PreviewForm v-if="showPrev" :document="document" :type="selectedType" @close="showPreview = false" />
    <div class="payment-form">
      <h1>Formulario de Pago</h1>
      <form @submit.prevent="handleSubmit">

        <!-- Campos del formulario -->
        <div class="input-group">
          <label for="payer-id">Cédula del Pagador</label>
          <SelectThird :type="'PARENT'" v-model="payer" required />
        </div>

        <div class="input-group">
          <label for="beneficiary-id">Cédula del Beneficiario</label>
          <SelectThird :type="'STUDENT'" :parent="payer" v-model="beneficiary" required />
        </div>

        <div class="input-group">
          <label for="amount">Documentos</label>
          <SelectDocument :parent="payer" :student="beneficiary" :doc_type="'CC'" v-model="document" :is-payment="isPay" />
        </div>

        <div class="input-group">
          <label for="beneficiary-id">CardType(Auto)</label>
          <SelectCardType v-model="cardType" required />
        </div>

        <div class="input-group">
          <label for="beneficiary-id">TransaccionId(Auto)</label>
          <UInput v-model="transactionId" id="beneficiary-id" required
            placeholder="Ingrese un id unioco para la transaccion" />
        </div>

        <div class="input-group">
          <label for="benefactor">
            Monto Final a Pagar : {{ document.new_amount }}
            <span v-if="document && document.new_amount > 0" @click="showPreview(document.Id)">👁️</span>

          </label>

          <input type="hidden" name="public-key" value="LLAVE_PUBLICA_DEL_COMERCIO" />
          <input type="hidden" name="currency" value="MONEDA" />
          <input type="hidden" name="amount-in-cents" value="MONTO_EN_CENTAVOS" />
          <input type="hidden" name="reference" value="REFERENCIA_DE_PAGO" />
          <input type="hidden" name="signature:integrity" value="FIRMA_DE_INTEGRIDAD" />
          <!-- OPCIONALES -->
          <input type="hidden" name="redirect-url" value="URL_REDIRECCION" />
          <input type="hidden" name="expiration-time" value="FECHA_EXPIRACION" />
          <input type="hidden" name="tax-in-cents:vat" value="IVA_EN_CENTAVOS" />
          <input type="hidden" name="tax-in-cents:consumption" value="IMPOCONSUMO_EN_CENTAVOS" />
          <input type="hidden" name="customer-data:email" value="CORREO_DEL_PAGADOR" />
          <input type="hidden" name="customer-data:full-name" value="NOMBRE_DEL_PAGADOR" />
          <input type="hidden" name="customer-data:phone-number" value="NUMERO_DE_TELEFONO_DEL_PAGADOR" />
          <input type="hidden" name="customer-data:legal-id" value="DOCUMENTO_DE_IDENTIDAD_DEL_PAGADOR" />
          <input type="hidden" name="customer-data:legal-id-type" value="TIPO_DEL_DOCUMENTO_DE_IDENTIDAD_DEL_PAGADOR" />
          <input type="hidden" name="shipping-address:address-line-1" value="DIRECCION_DE_ENVIO" />
          <input type="hidden" name="shipping-address:country" value="PAIS_DE_ENVIO" />
          <input type="hidden" name="shipping-address:phone-number" value="NUMERO_DE_TELEFONO_DE_QUIEN_RECIBE" />
          <input type="hidden" name="shipping-address:city" value="CIUDAD_DE_ENVIO" />
          <input type="hidden" name="shipping-address:region" value="REGION_DE_ENVIO" />

        </div>


        <div class="button-group">
          <button type="submit" class="submit-btn">Realizar Pago</button>
          <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
// import { ref,  onMounted, defineEmits } from 'vue';

// Emitir evento para cerrar el modal
const emit = defineEmits(['close']);

// Referencias a las variables del formulario
const payer = ref({});
const beneficiary = ref({});
const document = ref({});
const cardType = ref({});
const selectedType = ref('CC');
const transactionId = ref('');
const showPrev = ref(false);
const isPay = ref(true);


const showPreview = (docId) => {
  //showPrev.value = true;
  downloadReport(docId);
};

const downloadReport = async (docId) => {
  try {
    const documentData = document; // Cambié 'document' por 'documentData'
    console.log('Descargando el archivo:', documentData.value); // Cambié 'document' por 'documentData'

    const response = await fetch(`api/printpdf/CC/${documentData.value.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf', // Asegúrate de aceptar el tipo de contenido correcto
      },
    });

    if (!response.ok) {
      console.error('Error al descargar el archivo:', response.statusText);
      return;
    }

    const blob = await response.blob();
    const filename = documentData.value.doc_type + '-' + documentData.value.prefix + '-' + documentData.value.consecutive + '.pdf';

    // Usar window.document para asegurarnos de no sobrescribir 'document'
    const link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
    }, 250);
  } catch (error) {
    console.error('Error en la descarga:', error);
  }
};

const handleSubmit = () => {
  createPayment();
};


const createPayment = async () => {

  const message = confirm('¿Estás seguro de crear este Pago?')

  if (!message) {
    payer.value = null
    beneficiary.value = null
    document.value = null
    cardType.value = null
    transactionId.value = ''

  }

  const response = await $fetch('api/payments/payments/', {
    method: 'POST',
    body: {
      parent: payer.value.id,
      student: beneficiary.value.id,
      concept: document.value.concept,
      amount: document.value.new_amount,
      card_type: cardType.value.id,
      transaction_id: transactionId.value,
      status: 'EXITOSO',
      cxc: document.value.id,
    },
  })
  payer.value = null
  beneficiary.value = null
  document.value = null
  cardType.value = null
  transactionId.value = ''

  emit('close');
}


// Método para cerrar el modal
const closeModal = () => {
  emit('close'); // Emitir el evento para cerrar el modal desde el componente padre
};

// Pre-llenado de datos si el usuario está logueado
onMounted(() => {

});
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