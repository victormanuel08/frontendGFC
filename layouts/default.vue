<template>
  <div>
    <Header />
    <main>
      <slot />
      <FloatingButtons />
    </main>
    <Footer />
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import FloatingButtons from "@/components/FloatingButtons.vue";
import Loading from "@/components/Loading.vue";

const isLoading = ref(true);

// Simula una carga de datos
setTimeout(() => {
  isLoading.value = false;
}, 3000);
</script>

<style>
main {
  padding: 2rem;
  position: relative; /* Para que FloatingButtons se posicione relativo a main */
  background-color: #f5f5f5; /* Fondo gris claro */
}
</style>
