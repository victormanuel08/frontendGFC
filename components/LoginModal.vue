<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Inicia Sesión</h2>
      <form @submit.prevent="doLogin">
        <div class="form-group">
          <input v-model="loginData.username" type="text" placeholder="Usuario" required />
        </div>
        <div class="form-group">
          <input v-model="loginData.password" type="password" placeholder="Contraseña" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">Iniciar Sesión</button>
          <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
        </div>
      </form>

      <div class="forgot-password">
        <a href="/forgot-password" @click.prevent="goToForgotPassword">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthTokensStorage, useAuthUserStorage } from '~/stores/auth';
import Swal from 'sweetalert2';

const router = useRouter();
const authTokensStorage = useAuthTokensStorage();
const authUserStorage = useAuthUserStorage();
const loading = ref(false);

const loginData = ref({
  username: '',
  password: '',
});

const emit = defineEmits(['login-success', 'close']); // 🟢 Definir eventos

const doLogin = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await $fetch('/api/auth/token/', {
      method: 'POST',
      body: loginData.value, 
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.access) throw new Error('Token no recibido');
    if (!response.access.startsWith('Bearer ')) response.access = `Bearer ${response.access}`;
    console.log('Token de acceso:', response.access);

    authTokensStorage.accessToken.value = response.access;

    authUserStorage.value = await $fetch('/api/me', {
      headers: { Authorization: `Bearer ${response.access}` },
    });

    Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');

    emit('login-success'); // 🟢 Notificar al componente padre que el login fue exitoso
  } catch (error) {
    console.error('Error de autenticación:', error);
    Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close'); // 🟢 Emitir evento para cerrar modal
};
</script>


<style scoped>
/* Overlay del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Estilo del modal */
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

/* Formulario */
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
