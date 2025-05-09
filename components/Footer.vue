<template>
  <footer class="footer">
    <!-- Barra superior visible inicialmente -->
    <div class="footer-top-bar" @click="toggleFooter">
      <div class="footer-logo left-logo">
        <img src="/static/navbar.png" class="logo-img" alt="Logo Banco de Contadores">
      </div>
      
      <div class="footer-mini-content">
        <h3 class="footer-company-name">Banco de Contadores Especializados</h3>
        <div class="mini-links">
          <a href="#" @click.stop>Política</a> | 
          <a href="#" @click.stop>Términos</a> | 
          <a href="#" @click.stop>Aviso Legal</a>
        </div>
      </div>
      
      <div class="footer-logo right-logo">
        <img src="/static/navbar.png" class="logo-img" alt="Logo Banco de Contadores">
      </div>
    </div>

    <!-- Contenido desplegable al hacer click -->
    <div class="footer-content" :class="{ 'expanded': isExpanded }" @click.stop>
      <div class="footer-main-content">
        <!-- Sección de información -->
        <div class="footer-section about">
          <h3 class="footer-title">Banco de Contadores Especializados</h3>
          <p class="footer-text">Expertos en soluciones contables y financieras para tu negocio.</p>
          <div class="contact-info">
            <p><i class="fas fa-map-marker-alt"></i> Dirección: Calle Ejemplo 123, Ciudad</p>
            <p><i class="fas fa-phone"></i> Teléfono: +1 234 567 890</p>
            <p><i class="fas fa-envelope"></i> Email: info@contadores.com</p>
          </div>
        </div>

        <!-- Sección de enlaces rápidos -->
        <div class="footer-section links">
          <h3 class="footer-title">Enlaces Rápidos</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Inicio</a></li>
            <li><a href="#" class="footer-link">Servicios</a></li>
            <li><a href="#" class="footer-link">Nosotros</a></li>
            <li><a href="#" class="footer-link">Blog</a></li>
            <li><a href="#" class="footer-link">Contacto</a></li>
          </ul>
        </div>

        <!-- Sección de servicios -->
        <div class="footer-section services">
          <h3 class="footer-title">Nuestros Servicios</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Auditoría Contable</a></li>
            <li><a href="#" class="footer-link">Asesoría Fiscal</a></li>
            <li><a href="#" class="footer-link">Contabilidad Empresarial</a></li>
            <li><a href="#" class="footer-link">Planificación Financiera</a></li>
            <li><a href="#" class="footer-link">Consultoría</a></li>
          </ul>
        </div>

        <!-- Sección de redes sociales -->
        <div class="footer-section social">
          <h3 class="footer-title">Síguenos</h3>
          <ul class="social-links">
            <li>
              <a href="https://facebook.com" target="_blank" class="social-link">
                <i class="fab fa-facebook-f"></i>
                <span class="social-tooltip">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" class="social-link">
                <i class="fab fa-twitter"></i>
                <span class="social-tooltip">Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" class="social-link">
                <i class="fab fa-instagram"></i>
                <span class="social-tooltip">Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" class="social-link">
                <i class="fab fa-linkedin-in"></i>
                <span class="social-tooltip">LinkedIn</span>
              </a>
            </li>
          </ul>
          
          <div class="newsletter">
            <h4>Suscríbete a nuestro boletín</h4>
            <form class="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" required>
              <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2023 Banco de Contadores Especializados. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      isExpanded: false
    }
  },
  methods: {
    toggleFooter() {
      this.isExpanded = !this.isExpanded;
    },
    closeFooter(event) {
      if (!this.$el.contains(event.target)) {
        this.isExpanded = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeFooter);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeFooter);
  }
}
</script>

<style scoped>
/* Estilos base */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #6699CC 13.3%, #333333 46.6%, #CC3333 80%);
}

/* Barra superior inicial */
.footer-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background: #1a4b7a;
  transition: all 0.3s ease;
  height: 60px;
  cursor: pointer;
}

.footer-mini-content {
  text-align: center;
  flex-grow: 1;
}

.footer-company-name {
  margin: 0;
  font-size: 1.1rem;
  color: white;
}

.mini-links {
  margin-top: 0.3rem;
}

.mini-links a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
  text-decoration: none;
  margin: 0 0.3rem;
  transition: color 0.3s ease;
}

.mini-links a:hover {
  color: white;
  text-decoration: underline;
}

.footer-logo {
  width: 200px;
  display: flex;
  align-items: center;
}

.left-logo {
  justify-content: flex-start;
}

.right-logo {
  justify-content: flex-end;
}

.logo-img {
  max-height: 80px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05);
}

/* Contenido desplegable */
.footer-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
  background: linear-gradient(135deg, #2c3e50, #3498db);
}

.footer-content.expanded {
  max-height: 1000px;
}

.footer-main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Secciones del footer */
.footer-section {
  padding: 0 1rem;
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background: #CC3333; /* Rojo institucional */
}

.footer-text {
  margin-bottom: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  color: white;
}

.contact-info {
  margin-top: 1.5rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.9;
  color: white;
}

.contact-info i {
  width: 20px;
  text-align: center;
  color: white;
}

/* Enlaces */
.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 2px;
}

.footer-link:hover {
  opacity: 1;
  color: #CC3333; /* Rojo institucional */
}

.footer-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: #CC3333; /* Rojo institucional */
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

/* Redes sociales */
.social-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  position: relative;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #CC3333; /* Rojo institucional */
  transform: translateY(-5px);
}

.social-link i {
  font-size: 1rem;
}

.social-tooltip {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #CC3333; /* Rojo institucional */
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.social-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: #CC3333 transparent transparent; /* Rojo institucional */
}

.social-link:hover .social-tooltip {
  opacity: 1;
  visibility: visible;
  top: -40px;
}

/* Newsletter */
.newsletter {
  margin-top: 2rem;
}

.newsletter h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  color: white;
}

.newsletter-form {
  display: flex;
}

.newsletter-form input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.newsletter-form button {
  background: #CC3333; /* Rojo institucional */
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.newsletter-form button:hover {
  background: #a82a2a; /* Rojo más oscuro para hover */
}

/* Footer inferior */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
  margin-top: 1rem;
  text-align: center;
}

.copyright {
  opacity: 0.7;
  font-size: 0.9rem;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-top-bar {
    padding: 0.5rem 1rem;
    height: 50px;
  }
  
  .footer-company-name {
    font-size: 0.9rem;
  }
  
  .mini-links a {
    font-size: 0.6rem;
  }
  
  .footer-logo {
    width: 120px;
  }
  
  .logo-img {
    max-height: 50px;
  }
  
  .footer-main-content {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .footer-section {
    margin-bottom: 1.5rem;
  }
}
</style>