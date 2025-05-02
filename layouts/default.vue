<template>
  <div>
    <Header />
    <main class="content-wrapper">
      <slot />
      <div class="floating-container">
        <FloatingButtons />
      </div>
    </main>
    <Footer />
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import FloatingButtons from "@/components/FloatingButtons.vue";      

</script>

<style>
.content-wrapper {
  position: relative; /* Para que los botones flotantes se centren respecto al contenido */
  padding: 2rem;
  background-color: #ffffff; /* Fondo blanco */
}

.floating-container {
  position: fixed; /* Cambio de absolute a fixed */
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
}


main {
  padding: 2rem;
  position: relative; /* Para que FloatingButtons se posicione relativo a main */
  background-color: #ffffff; /* Fondo blanco */
}
</style>
