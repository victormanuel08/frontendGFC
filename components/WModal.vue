<template>
  <div class="floating-button" @click="showConfirmDialog">
    <img src="/static/icons/whatsapp-icon.png" alt="WhatsApp">
  </div>
</template>

<script setup>


const showConfirmDialog = () => {
  window.open('https://wa.me/3214575107', '_blank', 'noopener,noreferrer');
};




</script>

<style scoped>
.floating-button {
position: fixed;
bottom: 20px;
right: 20px;
background-color: transparent;

border-radius: 50%;
width: 60px;
height: 60px;
display: flex;
justify-content: center;
align-items: center;
cursor: pointer;
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); 

border: 2px solid #25D366; /* Borde verde para mantener el branding */
}

.floating-button img {
width: 40px;
height: 40px;
}
</style>
