<template>
   
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  onMounted(() => {
    // Ejecutar SweetAlert2 cuando la página cargue
    router.push("/home");
  });
  </script>
  
  <style scoped>
  </style>
  