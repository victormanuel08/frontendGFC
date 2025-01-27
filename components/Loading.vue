<template>
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <img src="/static/icons/menuprincipal.jpg" alt="Balon" class="balon-image" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true, // Puedes cambiar este valor según el estado de carga de tu aplicación
      };
    },
    mounted() {
      this.rotateBall();
    },
    methods: {
      rotateBall() {
        const ball = document.querySelector('.balon-image');
        let angle = 0;
        setInterval(() => {
          angle += 5;
          ball.style.transform = `rotate(${angle}deg)`;
        }, 100);
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
    backdrop-filter: blur(5px); /* Efecto borroso */
    z-index: 9999; /* Asegúrate de que esté por encima de otros elementos */
  }
  
  .loading-content {
    text-align: center;
  }
  
  .balon-image {
    width: 100px; /* Ajusta el tamaño según tus necesidades */
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  