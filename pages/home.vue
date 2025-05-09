<template>
  <main class="font-sans bg-white">
    <!-- Hero Banner (igual al de EY) -->
    <section class="relative bg-[#160029] text-white">
      <div class="container mx-auto px-4 py-32 md:py-40">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Transformación digital <br>para tu práctica contable
          </h1>
          <p class="text-xl md:text-2xl mb-8 opacity-90">
            Soluciones integradas que elevan tu productividad y precisión financiera
          </p>
          <button class="bg-[#00C6D7] hover:bg-[#00a4b3] text-[#160029] font-bold px-8 py-3 rounded-full transition-colors">
            Conoce nuestras soluciones
          </button>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- Barra de servicios (estilo EY) -->
    <section class="bg-white shadow-md -mt-8 relative z-10">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200">
          <div v-for="(service, index) in quickServices" :key="index" class="py-6 px-8 hover:bg-gray-50 transition-colors">
            <h3 class="text-lg font-bold text-[#160029] mb-2">{{ service.title }}</h3>
            <p class="text-gray-600">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección "Nuestros Servicios" (como EY) -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-[#00C6D7] font-bold uppercase tracking-wider">Servicios</span>
          <h2 class="text-3xl md:text-4xl font-bold text-[#160029] mt-2">Nuestras soluciones integrales</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="(service, index) in services" 
            :key="index" 
            class="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="h-48 bg-gradient-to-r from-[#160029] to-[#3A006B] flex items-center justify-center">
              <i :class="service.icon" class="text-white text-5xl opacity-90 group-hover:scale-110 transition-transform"></i>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-[#160029] mb-3">{{ service.title }}</h3>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              <a href="#" class="text-[#00C6D7] font-semibold flex items-center">
                Saber más
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Insights (igual a EY) -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-[#00C6D7] font-bold uppercase tracking-wider">Conocimiento</span>
          <h2 class="text-3xl md:text-4xl font-bold text-[#160029] mt-2">Insights contables</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="(insight, index) in insights" 
            :key="index" 
            class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <img :src="insight.image" :alt="insight.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <span class="text-sm text-[#00C6D7] font-semibold">{{ insight.category }}</span>
              <h3 class="text-xl font-bold text-[#160029] my-3">{{ insight.title }}</h3>
              <p class="text-gray-600 mb-4">{{ insight.excerpt }}</p>
              <a href="#" class="text-[#160029] font-semibold text-sm flex items-center">
                Leer más
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final (estilo EY) -->
    <section class="py-20 bg-[#160029] text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">¿Listo para transformar tu práctica contable?</h2>
        <p class="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Descubre cómo nuestras soluciones pueden optimizar tus procesos financieros
        </p>
        <button class="bg-[#00C6D7] hover:bg-[#00a4b3] text-[#160029] font-bold px-8 py-3 rounded-full transition-colors mr-4">
          Contactar un asesor
        </button>
        <button class="bg-transparent border-2 border-white hover:bg-white hover:text-[#160029] font-bold px-8 py-3 rounded-full transition-colors">
          Explorar soluciones
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
// Datos para la barra de servicios rápida
const quickServices = ref([
  {
    title: "Auditoría Digital",
    description: "Tecnología avanzada para procesos de auditoría"
  },
  {
    title: "Consultoría Financiera",
    description: "Soluciones personalizadas para tu negocio"
  },
  {
    title: "Automatización",
    description: "Reduce procesos manuales con inteligencia artificial"
  }
]);

// Datos para los servicios principales
const services = ref([
  {
    icon: "fas fa-chart-network",
    title: "Analítica Financiera",
    description: "Plataformas de análisis de datos para toma de decisiones"
  },
  {
    icon: "fas fa-robot",
    title: "Automatización Contable",
    description: "Procesos automatizados con tecnología RPA"
  },
  {
    icon: "fas fa-shield-check",
    title: "Cumplimiento Normativo",
    description: "Mantenimiento al día con regulaciones fiscales"
  }
]);

// Datos para insights
const insights = ref([
  {
    image: "/static/images/insight-1.jpg",
    category: "Tendencias 2024",
    title: "El futuro de la contabilidad digital",
    excerpt: "Cómo la tecnología está transformando la profesión contable"
  },
  {
    image: "/static/images/insight-2.jpg",
    category: "Webinar",
    title: "Nuevas regulaciones fiscales",
    excerpt: "Actualización sobre cambios normativos para este año"
  },
  {
    image: "/static/images/insight-3.jpg",
    category: "Caso de éxito",
    title: "Transformación digital en firmas contables",
    excerpt: "Cómo ayudamos a XYZ Contadores a mejorar su productividad"
  }
]);
</script>

<style scoped>
/* Fuentes similares a EY */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

.font-sans {
  font-family: 'Open Sans', system-ui, sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.3s ease;
}

/* Efecto hover para tarjetas */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>