<template>
    <div v-if="isVisible" class="toast" :class="toastType">
      <div class="toast-content">
        <p>{{ message }}</p>
        <button class="close-btn" @click="closeToast">X</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info
    },
    duration: {
      type: Number,
      default: 3000, // 3 segundos por defecto
    },
  });
  
  const isVisible = ref(true);
  
  const toastType = ref(props.type);
  
  const closeToast = () => {
    isVisible.value = false;
  };
  
  // Autocierre después de la duración especificada
  setTimeout(() => {
    closeToast();
  }, props.duration);
  </script>
  
  <style scoped>
  .toast {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .toast.success {
    background-color: green;
  }
  
  .toast.error {
    background-color: red;
  }
  
  .toast.warning {
    background-color: orange;
  }
  
  .toast.info {
    background-color: blue;
  }
  
  .toast-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }
  </style>
  