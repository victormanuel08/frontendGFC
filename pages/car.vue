<template>
    <div class="financial-landing">
      <!-- Hero Section with Gradient -->
      <section class="financial-hero">
        <div class="hero-container">
          <div class="hero-content">
            <h1>Asesoría Financiera y Tributaria <span>Personalizada</span></h1>
            <p class="hero-subtitle">Soluciones expertas para optimizar tus finanzas y cumplimiento fiscal</p>
            <div class="price-tag">
              <span class="amount">$100</span>
              <span class="text">USD por consulta</span>
            </div>
            <button class="cta-button" @click="scrollToPayment">
              Reservar Ahora
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="hero-image">
            <img src="/static/financial-consulting.png" alt="Asesoría Financiera">
          </div>
        </div>
      </section>
  
      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="container">
          <h2>¿Por qué necesitas esta asesoría?</h2>
          <div class="benefits-grid">
            <div class="benefit-card" v-for="(benefit, index) in benefits" :key="index">
              <div class="benefit-icon" :style="{ backgroundColor: benefit.color }">
                <i :class="benefit.icon"></i>
              </div>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Process Section -->
      <section class="process-section">
        <div class="container">
          <h2>Así de simple es el proceso</h2>
          <div class="process-steps">
            <div class="step" v-for="(step, index) in processSteps" :key="index">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonial Section -->
      <section class="testimonial-section">
        <div class="container">
          <div class="testimonial-card">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <p class="testimonial-text">"La asesoría me ayudó a ahorrar $2,500 en impuestos este año. El mejor $100 invertido en mi negocio."</p>
            <div class="client-info">
              <img src="/static/client-avatar.jpg" alt="Cliente Satisfecho" class="client-avatar">
              <div>
                <h4>María González</h4>
                <p>Dueña de negocio</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Payment CTA Section -->
      <section class="payment-section" id="paymentSection">
        <div class="container">
          <h2>Reserva tu asesoría ahora</h2>
          <p class="subtitle">Pago seguro a través de nuestra plataforma</p>
          
          <div class="payment-card">
            <div class="service-details">
              <h3>Asesoría Financiera y Tributaria Personalizada</h3>
              <ul class="service-features">
                <li><i class="fas fa-check-circle"></i> 60 minutos de consulta personalizada</li>
                <li><i class="fas fa-check-circle"></i> Análisis de tu situación financiera</li>
                <li><i class="fas fa-check-circle"></i> Recomendaciones estratégicas</li>
                <li><i class="fas fa-check-circle"></i> Plan de acción personalizado</li>
                <li><i class="fas fa-check-circle"></i> Soporte por email post-consulta</li>
              </ul>
            </div>
            
            <div class="payment-details">
              <div class="price-box">
                <span class="price">$100.00</span>
                <span class="currency">USD</span>
              </div>
              <button class="payment-button" @click="processPayment">
                <i class="fab fa-cc-stripe"></i> Pagar con Stripe
              </button>
              <div class="payment-methods">
                <img src="/static/payment-methods.png" alt="Métodos de pago aceptados">
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="container">
          <h2>Preguntas Frecuentes</h2>
          <div class="faq-list">
            <div class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
              <div class="faq-question">
                <h3>{{ faq.question }}</h3>
                <i :class="['fas', faq.open ? 'fa-minus' : 'fa-plus']"></i>
              </div>
              <div class="faq-answer" :class="{ 'open': faq.open }">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Benefits Data
  const benefits = ref([
    {
      icon: 'fas fa-shield-alt',
      title: 'Cumplimiento Fiscal',
      description: 'Evita multas y sanciones por errores en tus declaraciones',
      color: '#1a4b7a'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Optimización Financiera',
      description: 'Identifica oportunidades para mejorar tu flujo de efectivo',
      color: '#cc3333'
    },
    {
      icon: 'fas fa-piggy-bank',
      title: 'Ahorro en Impuestos',
      description: 'Aprovecha todos los beneficios fiscales disponibles',
      color: '#6699CC'
    },
    {
      icon: 'fas fa-clock',
      title: 'Ahorro de Tiempo',
      description: 'Deja los temas complejos en manos de expertos',
      color: '#333333'
    }
  ])
  
  // Process Steps
  const processSteps = ref([
    {
      title: 'Reserva tu sesión',
      description: 'Compra tu asesoría y agenda un horario conveniente'
    },
    {
      title: 'Preparación',
      description: 'Envíanos tus documentos relevantes con anticipación'
    },
    {
      title: 'Sesión de consulta',
      description: 'Reunión virtual de 60 minutos con nuestro experto'
    },
    {
      title: 'Plan de acción',
      description: 'Recibe recomendaciones personalizadas por escrito'
    }
  ])
  
  // FAQ Data
  const faqs = ref([
    {
      question: '¿Qué documentos necesito para la asesoría?',
      answer: 'Depende de tu caso específico, pero generalmente necesitarás tus declaraciones de impuestos recientes, estados financieros y cualquier documento relevante a tu situación. Te enviaremos una lista personalizada después de reservar.',
      open: false
    },
    {
      question: '¿Puedo cancelar o reprogramar mi cita?',
      answer: 'Sí, puedes reprogramar con 24 horas de anticipación. Las cancelaciones con menos de 24 horas no son reembolsables.',
      open: false
    },
    {
      question: '¿La consulta incluye seguimiento?',
      answer: 'La consulta incluye soporte por email durante 7 días después de tu sesión para aclarar dudas sobre las recomendaciones recibidas.',
      open: false
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos todas las tarjetas de crédito y débito principales a través de nuestra plataforma segura de pagos con Stripe.',
      open: false
    }
  ])
  
  // Methods
  const toggleFaq = (index) => {
    faqs.value[index].open = !faqs.value[index].open
  }
  
  const scrollToPayment = () => {
    const element = document.getElementById('paymentSection')
    element.scrollIntoView({ behavior: 'smooth' })
  }
  
  const processPayment = () => {
    // Aquí iría la lógica para conectar con la pasarela de pagos
    alert('Redirigiendo a la pasarela de pagos...')
  }
  </script>
  
  <style scoped>
  /* Base Styles */
  .financial-landing {
    font-family: 'Montserrat', sans-serif;
    color: #2d3748;
    line-height: 1.6;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Hero Section */
  .financial-hero {
    background: linear-gradient(135deg, #1a4b7a 0%, #6699CC 100%);
    color: white;
    padding: 80px 0;
  }
  
  .hero-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
  
  .hero-content {
    margin-right: 2%;
    margin-left: 10%;
    text-align: left;


    flex: 1;
    max-width: 600px;
  }
  
  .hero-image {
    flex: 1;
  }
  
  .hero-image img {
    width: 100%;
    max-width: 500px;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .financial-hero h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  
  .financial-hero h1 span {
    color: #FFD700;
    font-weight: 600;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 30px;
    opacity: 0.9;
  }
  
  .price-tag {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    border-radius: 50px;
    margin-bottom: 30px;
  }
  
  .price-tag .amount {
    font-size: 2rem;
    font-weight: 700;
    margin-right: 10px;
  }
  
  .price-tag .text {
    font-size: 1rem;
    opacity: 0.9;
  }
  
  .cta-button {
    background: #FFD700;
    padding-left: 1%;
    color: #1a365d;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
  
  .cta-button:hover {
    background: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
  }
  
  /* Benefits Section */
  .benefits-section {
    padding: 100px 0;
    background-color: #f8fafc;
  }
  
  .benefits-section h2 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: #1a365d;
  }
  
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 50px;
  }
  
  .benefit-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s ease;
  }
  
  .benefit-card:hover {
    transform: translateY(-10px);
  }
  
  .benefit-icon {
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
  
  .benefit-card h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: #1a365d;
  }
  
  .benefit-card p {
    color: #4a5568;
    font-size: 1rem;
  }
  
  /* Process Section */
  .process-section {
    padding: 100px 0;
    background: white;
  }
  
  .process-section h2 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 60px;
    color: #1a365d;
  }
  
  .process-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    counter-reset: step-counter;
  }
  
  .step {
    position: relative;
    padding: 30px;
    background: #f8fafc;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    counter-increment: step-counter;
  }
  
  .step-number {
    position: absolute;
    top: -25px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: #cc3333;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    box-shadow: 0 5px 15px rgba(204, 51, 51, 0.3);
  }
  
  .step-content {
    margin-top: 20px;
  }
  
  .step h3 {
    font-size: 1.3rem;
    color: #1a365d;
    margin-bottom: 15px;
  }
  
  .step p {
    color: #4a5568;
  }
  
  /* Testimonial Section */
  .testimonial-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #f9fbfd 0%, #f0f5fa 100%);
  }
  
  .testimonial-card {
    background: white;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }
  
  .quote-icon {
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 3rem;
    color: rgba(102, 153, 204, 0.1);
  }
  
  .testimonial-text {
    font-size: 1.2rem;
    font-style: italic;
    color: #4a5568;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
  }
  
  .client-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .client-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .client-info h4 {
    margin: 0;
    color: #1a365d;
  }
  
  .client-info p {
    margin: 5px 0 0;
    color: #718096;
  }
  
  /* Payment Section */
  .payment-section {
    padding: 100px 0;
    background-color: #1a365d;
    color: white;
  }
  
  .payment-section h2 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 15px;
  }
  
  .subtitle {
    text-align: center;
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 50px;
  }
  
  .payment-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .service-details {
    flex: 2;
    padding: 40px;
    color: #2d3748;
  }
  
  .service-details h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #1a4b7a;
  }
  
  .service-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .service-features li {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .service-features i {
    color: #6699CC;
  }
  
  .payment-details {
    flex: 1;
    background: #f8fafc;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .price-box {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .price {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a365d;
    display: block;
  }
  
  .currency {
    font-size: 1.2rem;
    color: #718096;
  }
  
  .payment-button {
    background: #6772e5;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
    justify-content: center;
  }
  
  .payment-button:hover {
    background: #5469d4;
    transform: translateY(-2px);
  }
  
  .payment-methods img {
    max-width: 200px;
    opacity: 0.7;
  }
  
  /* FAQ Section */
  .faq-section {
    padding: 100px 0;
    background: #f8fafc;
  }
  
  .faq-section h2 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 50px;
    color: #1a365d;
  }
  
  .faq-list {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    background: white;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .faq-question {
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  
  .faq-question h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #1a365d;
  }
  
  .faq-question i {
    color: #6699CC;
    transition: all 0.3s ease;
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    padding: 0 25px;
  }
  
  .faq-answer.open {
    max-height: 500px;
    padding: 0 25px 20px;
  }
  
  .faq-answer p {
    color: #4a5568;
    line-height: 1.7;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .hero-container {
      flex-direction: column;
    }
    
    .hero-content {
      text-align: center;
      max-width: 100%;
    }
    
    .price-tag {
      margin-left: auto;
      margin-right: auto;
    }
    
    .payment-card {
      flex-direction: column;
    }
  }
  
  @media (max-width: 768px) {
    .financial-hero h1 {
      font-size: 2.2rem;
    }
    
    .hero-subtitle {
      font-size: 1.1rem;
    }
    
    .benefits-section h2,
    .process-section h2,
    .payment-section h2,
    .faq-section h2 {
      font-size: 1.8rem;
    }
  }
  
  @media (max-width: 576px) {
    .financial-hero h1 {
      font-size: 1.8rem;
    }
    
    .price-tag {
      flex-direction: column;
      gap: 5px;
    }
    
    .price-tag .amount {
      font-size: 1.8rem;
    }
    
    .cta-button {
      width: 100%;
      justify-content: center;
    }
    
    .step {
      padding: 20px;
    }
    
    .testimonial-card {
      padding: 30px 20px;
    }
    
    .service-details,
    .payment-details {
      padding: 30px 20px;
    }
  }
  </style>