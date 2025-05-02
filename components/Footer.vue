<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section social">
        <ul class="social-links">
          <li>
            <a href="https://facebook.com" target="_blank">
              <img src="/static/icons/facebook.svg" class="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank">
              <img src="/static/icons/twitter.png" class="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank">
              <img src="/static/icons/instagram.png" class="social-icon" />
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-section logo">
        <img src="/static/navbar.png" class="logo-img" />
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; Banco de Contadores Especializados. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #6699CC;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 30px;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1);
}

.logo-img {
  max-width: 100px;
}
</style>
