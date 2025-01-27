<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="closeModal" class="close-btn">X</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="close-btn">Cerrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  });
  
  const isVisible = ref(true);
  
  const closeModal = () => {
    isVisible.value = false;
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
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .close-btn {
    background: none;
    border: none;
    color: black;
    cursor: pointer;
  }
  </style>
  