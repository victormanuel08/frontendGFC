<template>
  <div class="layout-container">
    <Header class="fixed-header" />
    <main class="content-wrapper" @scroll="handleScroll">
      <slot />
      <div v-show="showFloatingButton" class="floating-container">
        <FloatingButtons />
      </div>
    </main>
    <Footer class="fixed-footer" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import FloatingButtons from "@/components/FloatingButtons.vue";

const showFloatingButton = ref(true);

const handleScroll = () => {
  showFloatingButton.value = window.scrollY === 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

.content-wrapper {
  flex: 1;
  margin-top: var(--header-height, 70px);
  margin-bottom: var(--footer-height, 60px);
  padding: 0;
  width: 100%;
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

.floating-container {
  position: fixed;
  top: 21%;
  right: 0.5rem;
  transform: translateY(-50%);
  z-index: 999;
  flex-direction: column;
  transition: opacity 0.3s ease-in-out;
}
</style>
