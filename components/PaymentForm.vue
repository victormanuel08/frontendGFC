<template>
    <!-- Modal del Formulario de Pago -->
    <div class="modal-overlay" @click.self="closeModal">
      <div class="payment-form">
        <h1>Formulario de Pago</h1>
        <form @submit.prevent="handleSubmit">

          <!-- Campos del formulario -->
          <div class="input-group">
            <label for="payer-id">Cédula del Pagador</label>
            <SelectThird 
              :type="'PARENT'"
              v-model="payer"              
              required              
            />           
          </div>
  
          <div class="input-group">
            <label for="beneficiary-id">Cédula del Beneficiario</label>
            <SelectThird 
              :type="'STUDENT'"
              :parent="payer"
              v-model="beneficiary"              
              required              
            />            
          </div>
         
          <div class="input-group">
            <label for="amount">Documentos</label>
            <SelectDocument 
              :parent="payer"
              :student="beneficiary"
              :doc_type="'CC'"
              v-model="document"              
              required             
            />
          </div>

          <div class="input-group">
            <label for="beneficiary-id">CardType(Auto)</label>
            <SelectThird 
              v-model="beneficiaryId"
              id="beneficiary-id"
              required
              placeholder="Ingrese la cédula del beneficiario"
            />
          </div>

          <div class="input-group">
            <label for="beneficiary-id">TransaccionId(Auto)</label>
            <UInput
              v-model="beneficiaryId"
              id="beneficiary-id"
              required
              placeholder="Ingrese un id unioco para la transaccion"
            />
          </div>
  
          <div class="input-group">
            <label for="benefactor">Monto Final a Pagar : {{  }}</label>
            
            <input type="hidden" name="public-key" value="LLAVE_PUBLICA_DEL_COMERCIO" />
            <input type="hidden" name="currency" value="MONEDA" />
            <input type="hidden" name="amount-in-cents" value="MONTO_EN_CENTAVOS" />
            <input type="hidden" name="reference" value="REFERENCIA_DE_PAGO" />
            <input type="hidden" name="signature:integrity" value="FIRMA_DE_INTEGRIDAD" />
            <!-- OPCIONALES -->
            <input type="hidden" name="redirect-url" value="URL_REDIRECCION" />
            <input type="hidden" name="expiration-time" value="FECHA_EXPIRACION" />
            <input type="hidden" name="tax-in-cents:vat" value="IVA_EN_CENTAVOS" />
            <input
              type="hidden"
              name="tax-in-cents:consumption"
              value="IMPOCONSUMO_EN_CENTAVOS"
            />
            <input type="hidden" name="customer-data:email" value="CORREO_DEL_PAGADOR" />
            <input
              type="hidden"
              name="customer-data:full-name"
              value="NOMBRE_DEL_PAGADOR"
            />
            <input
              type="hidden"
              name="customer-data:phone-number"
              value="NUMERO_DE_TELEFONO_DEL_PAGADOR"
            />
            <input
              type="hidden"
              name="customer-data:legal-id"
              value="DOCUMENTO_DE_IDENTIDAD_DEL_PAGADOR"
            />
            <input
              type="hidden"
              name="customer-data:legal-id-type"
              value="TIPO_DEL_DOCUMENTO_DE_IDENTIDAD_DEL_PAGADOR"
            />
            <input
              type="hidden"
              name="shipping-address:address-line-1"
              value="DIRECCION_DE_ENVIO"
            />
            <input type="hidden" name="shipping-address:country" value="PAIS_DE_ENVIO" />
            <input
              type="hidden"
              name="shipping-address:phone-number"
              value="NUMERO_DE_TELEFONO_DE_QUIEN_RECIBE"
            />
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
  const payer= ref({}); 
  const beneficiary = ref({});  
  const document = ref({});
  


  
  // Método de envío del formulario
  const handleSubmit = () => {
    console.log('Formulario enviado:', {
      payerId: payer.value,
      beneficiaryId: beneficiary.value,
      amount: amount.value,
      document: document.value,
    });
  };
  
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
  