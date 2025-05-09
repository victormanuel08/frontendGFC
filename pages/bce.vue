<template>
    <div class="institutional-page">
      <!-- Hero Banner Minimalista -->
      <section class="hero-minimal">
        <div class="hero-content">
          <div class="logo-container">
            <img src="/static/logo-bce.png" alt="BCE S.A.S." class="logo">
          </div>
          <h1>Soluciones contables y financieras <span>a la medida</span></h1>
          <div class="hero-divider"></div>
          <p class="hero-subtitle">Expertos en transformar números en estrategias</p>
        </div>
      </section>
  
      <!-- Quiénes Somos - Estilo Tarjeta -->
      <section class="about-card">
        <div class="container">
          <div class="card-content">
            <div class="text-content">
              <h2>QUIÉNES SOMOS</h2>
              <div class="divider"></div>
              <p>
                BCE S.A.S. es una firma de contadores públicos que presta servicios especializados en: 
                asesoría financiera; asesoría contable; asesoría tributaria; revisoría fiscal; 
                auditoria externa; consultoría financiera contable y tributaria, a personas naturales 
                y jurídicas residentes y no residentes fiscales en el país de todos los sectores económicos.
              </p>
            </div>
            <div class="card-image">
              <img src="/static/team-meeting.jpg" alt="Equipo BCE S.A.S.">
            </div>
          </div>
        </div>
      </section>
  
      <!-- Servicios - Diseño Mosaico -->
      <section class="services-mosaic">
        <div class="container">
          <h2>NUESTROS SERVICIOS</h2>
          <div class="divider-center"></div>
          <div class="mosaic-grid">
            <div 
              class="mosaic-item" 
              v-for="(service, index) in services" 
              :key="index"
              :class="`item-${index + 1}`"
            >
              <div class="mosaic-content">
                <i :class="service.icon"></i>
                <h3>{{ service.title }}</h3>
                <p>{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Valores - Diseño Elegante -->
      <section class="elegant-values">
        <div class="container">
          <h2 class="section-title">NUESTROS VALORES</h2>
          <div class="divider-wrapper">
            <div class="elegant-divider"></div>
          </div>
          
          <div class="values-container">
            <div 
              class="value-card" 
              v-for="(value, index) in values" 
              :key="index"
              :style="{ '--delay': index * 0.1 + 's' }"
            >
              <div class="value-content">
                <div class="value-icon-wrapper">
                  <i :class="value.icon"></i>
                </div>
                <h3>{{ value.title }}</h3>
                <div class="value-divider"></div>
                <p>{{ value.description }}</p>
              </div>
              <div class="value-decoration"></div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Minimalista -->
      <section class="cta-minimal">
        <div class="container">
          <h2>Transformemos juntos tus desafíos financieros</h2>
          <button class="cta-btn" @click="navigateToContact">
            <span>Hablemos</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const services = ref([
    {
      icon: 'fas fa-chart-line',
      title: 'Asesoría Financiera',
      description: 'Optimización de recursos y estrategias de crecimiento'
    },
    {
      icon: 'fas fa-calculator',
      title: 'Asesoría Contable',
      description: 'Gestión precisa de sus registros financieros'
    },
    {
      icon: 'fas fa-file-invoice-dollar',
      title: 'Asesoría Tributaria',
      description: 'Cumplimiento normativo y planeación fiscal'
    },
    {
      icon: 'fas fa-search-dollar',
      title: 'Revisoría Fiscal',
      description: 'Supervisión independiente de sus estados financieros'
    },
    {
      icon: 'fas fa-clipboard-check',
      title: 'Auditoría Externa',
      description: 'Evaluación objetiva de sus procesos financieros'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Consultoría Integral',
      description: 'Soluciones a medida para su negocio'
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Financiación Empresarial',
      description: 'Estrategias para obtención de capital'
    },
    {
      icon: 'fas fa-balance-scale',
      title: 'Restructuración',
      description: 'Soluciones legales y financieras'
    },
    {
      icon: 'fas fa-user-tie',
      title: 'Finanzas Personales',
      description: 'Planificación patrimonial y de inversiones'
    },
    {
      icon: 'fas fa-chess',
      title: 'Estrategias Corporativas',
      description: 'Planes de crecimiento y competitividad'
    },
    {
      icon: 'fas fa-robot',
      title: 'Inteligencia Artificial',
      description: 'Soluciones tecnológicas personalizadas'
    },
    {
      icon: 'fas fa-laptop-code',
      title: 'Consultoría Tecnológica',
      description: 'Implementación de herramientas digitales'
    }
  ])
  
  const values = ref([
    {
      title: 'Excelencia',
      description: 'Buscamos la máxima calidad en cada servicio que ofrecemos',
      icon: 'fas fa-medal'
    },
    {
      title: 'Integridad',
      description: 'Actuamos con ética y transparencia en todas nuestras relaciones',
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'Innovación',
      description: 'Implementamos soluciones vanguardistas para nuestros clientes',
      icon: 'fas fa-lightbulb'
    },
    {
      title: 'Compromiso',
      description: 'Nos dedicamos completamente al éxito de nuestros clientes',
      icon: 'fas fa-handshake'
    }
  ])
  
  const navigateToContact = () => {
    router.push('/contacto')
  }
  </script>
  
  <style scoped>
  /* Estilos generales */
  .institutional-page {
    font-family: 'Montserrat', sans-serif;
    color: #2d3748;
    line-height: 1.6;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Hero Minimalista */
  .hero-minimal {
    background-color: #f8fafc;
    padding: 100px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .hero-minimal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 153, 204, 0.1) 0%, rgba(204, 51, 51, 0.05) 100%);
    z-index: 0;
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
  }
  
  .logo-container {
    margin-bottom: 30px;
  }
  
  .logo {
    height: 80px;
    width: auto;
  }
  
  .hero-minimal h1 {
    font-size: 2.8rem;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  
  .hero-minimal h1 span {
    color: #cc3333;
    font-weight: 600;
  }
  
  .hero-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #6699cc, #cc3333);
    margin: 0 auto 20px;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    color: #4a5568;
    font-weight: 400;
  }
  
  /* About Card */
  .about-card {
    padding: 80px 0;
  }
  
  .card-content {
    display: flex;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
  }
  
  .text-content {
    flex: 1;
    padding: 50px;
  }
  
  .card-image {
    flex: 1;
  }
  
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .about-card h2 {
    font-size: 2rem;
    color: #1a365d;
    margin-bottom: 20px;
  }
  
  .divider {
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #6699cc, #cc3333);
    margin-bottom: 30px;
  }
  
  .about-card p {
    font-size: 1.1rem;
    color: #4a5568;
    line-height: 1.8;
  }
  
  /* Services Mosaic */
  .services-mosaic {
    padding: 80px 0;
    background-color: #f8fafc;
  }
  
  .services-mosaic h2 {
    text-align: center;
    font-size: 2rem;
    color: #1a365d;
    margin-bottom: 20px;
  }
  
  .divider-center {
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #6699cc, #cc3333);
    margin: 0 auto 40px;
  }
  
  .mosaic-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 200px);
    gap: 20px;
  }
  
  .mosaic-item {
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .mosaic-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .mosaic-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 25px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
  }
  
  .mosaic-content i {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: white;
  }
  
  .mosaic-content h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  .mosaic-content p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  /* Posicionamiento del mosaico */
  .item-1 { grid-column: 1 / 3; grid-row: 1 / 2; background: #1a4b7a; }
  .item-2 { grid-column: 3 / 4; grid-row: 1 / 2; background: #2c5282; }
  .item-3 { grid-column: 4 / 5; grid-row: 1 / 3; background: #4299e1; }
  .item-4 { grid-column: 1 / 2; grid-row: 2 / 4; background: #cc3333; }
  .item-5 { grid-column: 2 / 3; grid-row: 2 / 3; background: #2b6cb0; }
  .item-6 { grid-column: 3 / 4; grid-row: 2 / 3; background: #3182ce; }
  .item-7 { grid-column: 2 / 4; grid-row: 3 / 4; background: #90cdf4; }
  .item-8 { grid-column: 1 / 2; grid-row: 4 / 5; background: #e53e3e; }
  .item-9 { grid-column: 2 / 3; grid-row: 4 / 5; background: #f56565; }
  .item-10 { grid-column: 3 / 5; grid-row: 4 / 5; background: #fed7d7; color: #2d3748; }
  .item-10 .mosaic-content { background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent); }
  .item-10 i, .item-10 h3 { color: #2d3748; }
  
  /* Elegant Values Section */
  .elegant-values {
    padding: 100px 0;
    background: linear-gradient(135deg, #f9fbfd 0%, #f0f5fa 100%);
    position: relative;
    overflow: hidden;
  }
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #1a365d;
    margin-bottom: 20px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .divider-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 60px;
  }
  
  .elegant-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #6699CC, #CC3333);
    position: relative;
  }
  
  .elegant-divider::after {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #CC3333;
    box-shadow: 0 0 0 4px rgba(204, 51, 51, 0.2);
  }
  
  .values-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    position: relative;
  }
  
  .value-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.5s ease var(--delay);
    transform: translateY(20px);
    opacity: 0;
    animation: fadeInUp 0.8s forwards;
    animation-delay: var(--delay);
  }
  
  @keyframes fadeInUp {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .value-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 153, 204, 0.05) 0%, rgba(204, 51, 51, 0.03) 100%);
    z-index: 1;
  }
  
  .value-content {
    padding: 40px 30px;
    position: relative;
    z-index: 2;
    text-align: center;
  }
  
  .value-icon-wrapper {
    width: 80px;
    height: 80px;
    margin: 0 auto 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e6f0f8);
    border-radius: 50%;
    color: #6699CC;
    font-size: 1.8rem;
    box-shadow: 0 5px 15px rgba(102, 153, 204, 0.2);
    transition: all 0.3s ease;
  }
  
  .value-card:hover .value-icon-wrapper {
    transform: scale(1.1);
    background: linear-gradient(135deg, #6699CC, #3a7bd5);
    color: white;
  }
  
  .value-card h3 {
    font-size: 1.4rem;
    color: #1a4b7a;
    margin-bottom: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .value-card:hover h3 {
    color: #CC3333;
  }
  
  .value-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #6699CC, #CC3333);
    margin: 0 auto 20px;
    transition: all 0.3s ease;
  }
  
  .value-card:hover .value-divider {
    width: 60px;
  }
  
  .value-card p {
    color: #4a5568;
    line-height: 1.7;
    font-size: 1rem;
  }
  
  .value-decoration {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(102, 153, 204, 0.1) 0%, rgba(204, 51, 51, 0.05) 100%);
    transition: all 0.5s ease;
  }
  
  .value-card:hover .value-decoration {
    transform: scale(1.5);
    opacity: 0.3;
  }
  
  /* Efectos de fondo decorativos */
  .elegant-values::before {
    content: '';
    position: absolute;
    top: -100px;
    left: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(102, 153, 204, 0.05) 0%, transparent 70%);
    z-index: 1;
  }
  
  .elegant-values::after {
    content: '';
    position: absolute;
    bottom: -150px;
    right: -100px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(135deg, transparent 0%, rgba(204, 51, 51, 0.03) 100%);
    z-index: 1;
  }
  
  /* CTA Minimalista */
  .cta-minimal {
    padding: 100px 0;
    background-color: #1a365d;
    color: white;
    text-align: center;
  }
  
  .cta-minimal h2 {
    font-size: 2.2rem;
    margin-bottom: 30px;
    font-weight: 500;
  }
  
  .cta-btn {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 15px 40px;
    font-size: 1.1rem;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  
  .cta-btn:hover {
    background: white;
    color: #1a365d;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .mosaic-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 200px);
    }
    
    .item-1 { grid-column: 1 / 3; grid-row: 1 / 2; }
    .item-2 { grid-column: 3 / 4; grid-row: 1 / 2; }
    .item-3 { grid-column: 1 / 2; grid-row: 2 / 3; }
    .item-4 { grid-column: 2 / 4; grid-row: 2 / 3; }
    .item-5 { grid-column: 1 / 3; grid-row: 3 / 4; }
    .item-6 { grid-column: 3 / 4; grid-row: 3 / 4; }
    .item-7 { grid-column: 1 / 4; grid-row: 4 / 5; }
    .item-8, .item-9, .item-10 { display: none; }
  }
  
  @media (max-width: 768px) {
    .hero-minimal h1 {
      font-size: 2.2rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .card-content {
      flex-direction: column;
    }
    
    .text-content {
      padding: 30px;
    }
    
    .card-image {
      height: 300px;
    }
    
    .mosaic-grid {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(7, 150px);
    }
    
    .item-1, .item-2, .item-3, 
    .item-4, .item-5, .item-6, 
    .item-7 {
      grid-column: 1 / 2;
      grid-row: auto;
    }
    
    .elegant-values {
      padding: 80px 0;
    }
    
    .values-container {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 576px) {
    .hero-minimal {
      padding: 60px 0;
    }
    
    .hero-minimal h1 {
      font-size: 1.8rem;
    }
    
    .about-card h2, 
    .services-mosaic h2,
    .section-title {
      font-size: 1.6rem;
    }
    
    .values-container {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .value-card {
      max-width: 100%;
    }
    
    .cta-minimal h2 {
      font-size: 1.8rem;
    }
  }
  </style>