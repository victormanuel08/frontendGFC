<template>
  <div class="floating-buttons">
    <button class="floating-button login" @click="toggleAuthModal">
      <img
        :src="loginImage"
        alt="Auth"
      />
    </button>
    <button class="floating-button payment" @click="showPaymentForm = true">
      <img src="/static/icons/payment.jpg" alt="Payment" />
    </button>
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
    <LogoutModal v-if="showLogoutModal" @close="showLogoutModal = false" />
    <PaymentForm v-if="showPaymentForm" @close="showPaymentForm = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoginModal from './LoginModal.vue'; 
import LogoutModal from './LogoutModal.vue'; 
import PaymentForm from './PaymentForm.vue'; 

const isLogged = ref(false); 
const showLoginModal = ref(false);
const showLogoutModal = ref(false);
const showPaymentForm = ref(false);
const router = useRouter();
const loginImage = ref("/static/icons/login.jpg");

const toggleAuthModal = () => {
  if (isLogged.value) {
    // showLogoutModal.value = true;
    router.push('/indexadmin');
  } else {
    showLoginModal.value = true;
  }
};

onMounted(async () => {
  try {     
    const response = await fetch('api/public/menu');
    const data = await response.json();
    isLogged.value = data.isLogged;
    loginImage.value = isLogged.value
      ? "/static/icons/menuprincipal.jpg" 
      : "/static/icons/login.jpg"; 
  } catch (error) {
    console.error('Error checking login status:', error);
  }
});
</script>

<style scoped>
.floating-buttons {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.floating-button {
  background-color: rgba(194, 66, 66, 0.7);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.floating-button:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.floating-button img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .floating-buttons {
    bottom: 1rem;
    right: 0.5rem;
    gap: 0.4rem;
  }

  .floating-button {
    width: 60px;
    height: 60px;
  }

  .floating-button img {
    width: 50px;
    height: 50px;
  }
}
</style>
