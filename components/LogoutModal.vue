<template>
    <div class="modal-overlay">
      <div class="modal">
        <h3>¿Quieres cerrar sesión?</h3>
        <button @click="logOut">Sí, cerrar sesión</button>
        <button @click="close">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const close = defineEmits(['close']);
  
  const logOut = () => {
    tokenCookie.value = null;
    authUserStorage.value = {};
    authTokensStorage.accessToken.value = null;
    authTokensStorage.refreshToken.value = null;
    useRouter().push('/');
    close();
  };
  </script>
  
  <style scoped>
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
  
  .modal {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 100%;
  }
  </style>
  