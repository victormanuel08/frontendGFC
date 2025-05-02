<template>
  <div class="home-page">
    <!-- Aquí puedes añadir más secciones de la página de inicio -->
    <div class="welcome-section">
      <h1>Componentes</h1>
      <p>Validador CRUD.</p>
    </div>
    <div class="grid-cols">
      <div class="featured-section">    
        <SelectIdentificationTypes/>
      </div>
      <div class="featured-section">      
        <SelectCountry/>
      </div>
      <div class="featured-section">      
        <SelectDepartments/>
      </div>
      <div class="featured-section">      
        <SelectCity/>
      </div>
      <div class="featured-section">      
        <SelectResponsabilitiesType/>
      </div>
      <div class="featured-section">      
        <SelectThirdTypes/>
      </div>
      <div class="featured-section">      
        <SelectActivityEconomic/>
      </div>
      <div class="featured-section">      
        <SelectScheduledEventsTypes/>
      </div>
      <div class="featured-section">      
        <SelectVpn/>
      </div>
      <div class="featured-section">      
        <SelectEmail/>
      </div>
    
    <div class="featured-section">    
      <SelectTaxCalendarFilter/>
    </div>
    <div class="featured-section">    
      <SelectSoftware/>
    </div>
    <div class="featured-section">    
      <SelectTaxCalendar/>
    </div>
    <div class="featured-section">    
      <SelectMultiEmail/>
    </div>
    <div class="featured-section">    
      <SelectThird/>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-section {
  margin: 20px;
  text-align: center;
}

.grid-cols {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columnas iguales */
  gap: 20px; /* Espacio entre columnas */
  width: 100%; /* Asegura que ocupe todo el ancho */
  justify-items: center; /* Centra los elementos dentro de las columnas */
}

.featured-section {
  text-align: center;
}
</style>
