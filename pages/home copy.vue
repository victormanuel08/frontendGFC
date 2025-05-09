
<template>
  <main class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Expertos en Soluciones Financieras y Contables</h1>
        <p class="hero-subtitle">Integración perfecta con tus sistemas contables y herramientas profesionales</p>
        <div class="hero-buttons">
          <button class="primary-btn" @click="navigateTo('/abrir-cuenta')">Portafolio</button>
          <button class="secondary-btn" @click="navigateTo('/contacto')">Contactar Asesor</button>
        </div>
      </div>
      <div class="hero-image">
        <img src="/static/contabilidad-hero.png" alt="Soluciones contables integradas">
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2>Nuestras Ventajas Exclusivas</h2>
        <p>Diseñadas específicamente para profesionales contables</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon" :style="{ backgroundColor: feature.color }">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Integration Section -->
    <section class="integration-section">
      <div class="section-header">
        <h2>Integraciones con Principales Sistemas Contables</h2>
        <p>Trabajamos con las plataformas que ya usas</p>
      </div>
      
      <div class="integration-logos">
        <div class="logo-item" v-for="(logo, index) in integrations" :key="index">
          <img :src="logo.image" :alt="logo.name">
          <span>{{ logo.name }}</span>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Profesionales contables que confían en nosotros</p>
      </div>
      
      <div class="testimonials-slider">
        <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="testimonial-content">
            <p>"{{ testimonial.text }}"</p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img :src="testimonial.avatar" :alt="testimonial.name">
            </div>
            <div class="author-info">
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.position }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>¿Listo para optimizar tu práctica contable?</h2>
        <p>Únete a la comunidad de contadores que ya están ahorrando tiempo y mejorando su productividad</p>
        <button class="primary-btn" @click="navigateTo('/abrir-cuenta')">Iniciar Ahora</button>
      </div>
    </section>
  </main>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos reactivos
const features = ref([
  {
    icon: 'fas fa-sync-alt',
    title: 'Reconciliación Automática',
    description: 'Integración directa con tus sistemas contables para reconciliación en tiempo real',
    color: '#6699CC'
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'Seguridad Garantizada',
    description: 'Protección bancaria nivel empresarial para tus transacciones',
    color: '#333333'
  },
  {
    icon: 'fas fa-file-invoice-dollar',
    title: 'Reportes Personalizados',
    description: 'Genera reportes contables con los formatos que necesitas',
    color: '#CC3333'
  },
  {
    icon: 'fas fa-clock',
    title: 'Ahorro de Tiempo',
    description: 'Reduce horas de trabajo manual con nuestros procesos automatizados',
    color: '#6699CC'
  }
])

const integrations = ref([
  { name: 'SAP', image: '/static/logos/sap.png' },
  { name: 'QuickBooks', image: '/static/logos/quickbooks.png' },
  { name: 'ContaPlus', image: '/static/logos/contaplus.png' },
  { name: 'Siigo', image: '/static/logos/siigo.png' },
  { name: 'Xero', image: '/static/logos/xero.png' }
])

const testimonials = ref([
  {
    text: 'Desde que uso BancoCont he reducido el tiempo de reconciliación en un 70%. La integración con mi software contable es perfecta.',
    name: 'María González',
    position: 'Contadora Pública',
    avatar: '/static/avatars/avatar1.jpg'
  },
  {
    text: 'Finalmente un banco que entiende las necesidades específicas de los contadores. El soporte técnico es excelente.',
    name: 'Carlos Mendoza',
    position: 'Auditor Financiero',
    avatar: '/static/avatars/avatar2.jpg'
  }
])

// Métodos
const navigateTo = (path) => {
  router.push(path)
}

// Efectos
onMounted(() => {
  // Puedes agregar lógica de inicialización aquí si es necesario
})
</script>

<style scoped>
/* Tus estilos existentes permanecen igual */
.home-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: white;
  padding-bottom: 100px;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 5%;
  background: linear-gradient(to right, #f8f9fa 50%, #ffffff 50%);
}

.hero-content {
  max-width: 50%;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a4b7a;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.hero-image {
  max-width: 45%;
}

.hero-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Common Section Styles */
.section-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.section-header h2 {
  font-size: 2rem;
  color: #1a4b7a;
  margin-bottom: 15px;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
}

/* Features Section */
.features-section {
  padding: 80px 5%;
  background-color: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 1.5rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Integration Section */
.integration-section {
  padding: 80px 5%;
}

.integration-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.logo-item img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.logo-item:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

.logo-item span {
  font-size: 0.9rem;
  color: #555;
  text-align: center;
}

/* Testimonials Section */
.testimonials-section {
  padding: 80px 5%;
  background-color: #f8f9fa;
}

.testimonials-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.testimonial-content {
  margin-bottom: 20px;
  font-style: italic;
  color: #555;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  margin: 0;
  color: #333;
}

.author-info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  color: #666;
}

/* CTA Section */
.cta-section {
  padding: 80px 5%;
  text-align: center;
  background: linear-gradient(135deg, #1a4b7a, #2c3e50);
  color: white;
  border-radius: 8px;
  margin: 0 5%;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

/* Buttons */
.primary-btn, .secondary-btn {
  padding: 12px 30px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.primary-btn {
  background-color: #CC3333;
  color: white;
}

.primary-btn:hover {
  background-color: #a82a2a;
  transform: translateY(-2px);
}

.secondary-btn {
  background-color: transparent;
  color: #1a4b7a;
  border: 2px solid #1a4b7a;
}

.secondary-btn:hover {
  background-color: #1a4b7a;
  color: white;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    background: #f8f9fa;
    padding: 60px 5%;
  }
  
  .hero-content {
    max-width: 100%;
    margin-bottom: 40px;
    text-align: center;
  }
  
  .hero-image {
    max-width: 100%;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .feature-card {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .primary-btn, .secondary-btn {
    width: 100%;
  }
}
</style>