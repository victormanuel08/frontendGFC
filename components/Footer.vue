<template>
  <footer class="footer" @mouseenter="scrollToBottom">
    <!-- Todo el contenido que estará oculto por defecto -->
    <div class="footer-content">
      <!-- Sección de redes sociales -->
      <div class="footer-section social">
        <ul class="social-links">
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener">
              <img src="/static/icons/facebook.svg" alt="Facebook" class="social-icon" />
              <span class="social-name">Facebook</span>
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noopener">
              <img src="/static/icons/twitter.png" alt="Twitter" class="social-icon" />
              <span class="social-name">Twitter</span>
            </a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener">
              <img src="/static/icons/instagram.png" alt="Instagram" class="social-icon" />
              <span class="social-name">Instagram</span>
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank" rel="noopener">
              <img src="/static/icons/youtube.png" alt="YouTube" class="social-icon" />
              <span class="social-name">YouTube</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Logo visible solo en pantallas grandes -->
      <div class="footer-section logo">
        <img src="/static/navbar.png" alt="GAMERO FC Logo" class="logo-img" />
      </div>
    </div>

    <!-- Texto inferior visible siempre -->
    <div class="footer-bottom">
      <p>&copy; Gamero FC. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.footer {
  background-color: #091278; /* Azul oscuro */
  color: white;
  padding: 0.5rem 1rem; /* Reducido para ser más compacto inicialmente */
  font-size: 0.85rem;
  position: relative;
}

/* Ocultamos todo el contenido del footer por defecto */
.footer-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0; /* Sin padding inicial */
}

/* Expandir contenido cuando el mouse pasa por encima */
.footer:hover .footer-content {
  max-height: 1000px; /* Permite mostrar el contenido */
  padding: 1rem 0; /* Añadimos espacio al pasar el mouse */
}

.footer-section {
  padding: 0.5rem 0;
  transition: padding 0.3s ease;
}

.social-links {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.5rem; /* Espacio reducido entre iconos inicialmente */
  justify-content: center;
  text-align: center;
}

.social-links li {
  margin-bottom: 0.5rem;
}

.social-links a {
  display: block;
  color: white;
  text-decoration: none;
}

.social-icon {
  width: 25px; /* Tamaño más pequeño de iconos */
  height: 25px;
  transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1); /* Efecto al hacer hover */
}

.social-name {
  display: block;
  font-size: 0.7rem; /* Fuente más pequeña para nombres sociales */
  margin-top: 0.3rem;
}

/* Estilo del logo, se oculta en pantallas pequeñas */
.logo img {
  max-width: 100px; /* Logo más compacto inicialmente */
  opacity: 0;
  transition: opacity 0.3s ease-in-out, max-width 0.3s ease-in-out;
}

.footer:hover .logo img {
  opacity: 1;
  max-width: 120px; /* Logo más grande al hacer hover */
}

/* Footer bottom siempre visible */
.footer-bottom {
  text-align: center;
  padding-top: 0.5rem; /* Reducido para menor altura */
  border-top: 1px solid transparent; /* Ocultar línea inicialmente */
  margin-top: 0.5rem; /* Menor espaciado con el contenido */
  transition: border-top 0.3s ease; /* Suave transición para la línea */
}

.footer:hover .footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Línea visible al hacer hover */
  margin-top: 1rem; /* Mayor espaciado al expandirse */
}

/* Estilos para pantallas pequeñas */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    max-height: 1000px;
    text-align: center;
    padding: 0.5rem 0; /* Más compacto en pantallas pequeñas */
  }

  .footer-section {
    min-width: unset;
    width: 100%;
    padding: 0.5rem 0;
  }

  .social-links {
    gap: 0.5rem;
    justify-content: center;
  }

  .social-name {
    display: none; /* Ocultar el texto de redes sociales en pantallas pequeñas */
  }

  .logo img {
    display: none; /* Ocultar logo en pantallas pequeñas */
  }

  .footer-bottom {
    padding-top: 0.5rem;
  }
}
</style>
