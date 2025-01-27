<template>
    <div class="about-container">


        <section class="intro-section">
          <h1 class="title">Quiénes Somos</h1>
          <p class="description">En Gamero FC, nos apasiona el fútbol y la formación de jóvenes talentos. Somos más que un club; somos una comunidad dedicada a promover el deporte, la disciplina y el trabajo en equipo.</p>
        </section>
        <section class="mission-section">
          <h2 class="section-title">Nuestra Misión</h2>
          <p class="section-description">Proveer un entorno profesional y de apoyo donde nuestros jugadores puedan desarrollarse plenamente y alcanzar su máximo potencial tanto dentro como fuera del campo.</p>
        </section>
        <section class="vision-section">
          <h2 class="section-title">Nuestra Visión</h2>
          <p class="section-description">Ser reconocidos como la mejor academia de fútbol de la región, formando jugadores íntegros y comprometidos con la sociedad.</p>
        </section>
        <section class="values-section">
          <h2 class="section-title">Nuestros Valores</h2>
          <ul class="values-list">
            <li>Pasión por el fútbol</li>
            <li>Compromiso con la formación integral</li>
            <li>Trabajo en equipo</li>
            <li>Disciplina y perseverancia</li>
          </ul>
        </section>
        <section class="history-section">
          <h2 class="section-title">Nuestra Historia</h2>
          <p class="section-description">Gamero FC fue fundado en el año 2020 por un grupo de apasionados del fútbol con el objetivo de crear una plataforma que permita a los jóvenes talentos desarrollarse en un entorno profesional. Desde entonces, hemos crecido y nos hemos convertido en una referencia en la formación de jugadores de fútbol.</p>
        </section>
        <section class="team-section">
          <h2 class="section-title">Nuestro Equipo</h2>
          <p class="section-description">Contamos con un equipo de profesionales altamente capacitados y comprometidos con la formación de nuestros jugadores. Cada miembro de nuestro staff es elegido por su experiencia, dedicación y pasión por el fútbol.</p>
        </section>
   
    
    </div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    padding: 2rem 1rem;
    box-sizing: border-box;
  }
  
  .main-content {
    width: 100%;
    max-width: 1200px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
  }
  
  .section-title {
    font-size: 2rem;
    font-weight: bold;
    color: #444;
  }
  
  .description, .section-description {
    font-size: 1rem;
    color: #555;
  }
  
  .values-list {
    list-style-type: none;
    padding: 0;
  }
  
  .values-list li {
    font-size: 1rem;
    color: #555;
    margin: 0.5rem 0;
  }
  </style>
  