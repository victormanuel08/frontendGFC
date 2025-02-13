<template>
    <header class="header">
      <div class="logo-container">
        <img src="/static/navbar.png" alt="GAMERO FC Logo" class="logo-img" />
        <NuxtLink to="/" class="logo-text">GAMERO FC ADMIN</NuxtLink>
        <div class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
  
      <!-- Menú en pantallas grandes -->
      <nav>
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.id" @mouseover="openSubMenu(item.id)" @mouseleave="closeSubMenu(item.id)">
            <NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
            <ul v-if="item.childs.length && isSubMenuOpen(item.id)" class="submenu">
              <li v-for="child in item.childs" :key="child.id">
                <NuxtLink :to="child.path">{{ child.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
  
        <!-- Menú lateral para pantallas pequeñas -->
        <ul :class="{ open: isMenuOpen }" class="sidebar">
          <li v-for="item in menuItems" :key="item.id">
            <div @click="toggleSubMenu(item.id)" class="sidebar-item">
              {{ item.label }}
            </div>
            <ul v-if="item.childs.length && isSubMenuOpen(item.id)" class="submenu">
              <li v-for="child in item.childs" :key="child.id">
                <NuxtLink :to="child.path">{{ child.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  </template>
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  
  const menuItems = ref<mi[]>([]) // Lista de elementos del menú
  const openSubMenus = ref(new Set()) // Submenús abiertos
  const isMenuOpen = ref(false) // Estado del menú lateral
  
  type mi = {
    id: number
    label: string
    path: string
    icon: string
    childs: mi[]
  }
  
  // Función para obtener los elementos del menú desde una API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('api/public/menu') // Solicitar los elementos del menú
      const data = await response.json()
      menuItems.value = data.menu
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }
  
  // Función para alternar la visibilidad del menú lateral
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value // Alternar la visibilidad del menú lateral
  }
  
  // Función para alternar la visibilidad de los submenús en el menú lateral
  const toggleSubMenu = (id:any) => {
    // Cerrar todos los submenús antes de abrir el seleccionado
    if (openSubMenus.value.has(id)) {
      openSubMenus.value.delete(id) // Alternar submenú
    } else {
      openSubMenus.value.clear() // Cerrar todos los submenús antes de abrir uno nuevo
      openSubMenus.value.add(id)
    }
  }
  
  // Función para verificar si un submenú está abierto
  const isSubMenuOpen = (id:any) => {
    return openSubMenus.value.has(id) // Comprobar si un submenú está abierto
  }
  
  // Funciones para abrir y cerrar submenús en pantallas grandes
  const openSubMenu = (id:any) => {
    openSubMenus.value.add(id) // Abrir un submenú
  }
  
  const closeSubMenu = (id:any) => {
    openSubMenus.value.delete(id) // Cerrar un submenú
  }
  
  // Cerrar el menú lateral al maximizar la ventana
  const handleResize = () => {
    if (window.innerWidth > 768) {
      isMenuOpen.value = false
      openSubMenus.value.clear()
    }
  }
  
  onMounted(() => {
    fetchMenuItems() // Cargar los elementos del menú al montar el componente
    window.addEventListener('resize', handleResize) // Agregar el evento de resize para cerrar el menú lateral en pantallas grandes
  })
  
  // Escuchar cambios en el tamaño de la ventana
  watch(() => window.innerWidth, handleResize)
  </script>
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: linear-gradient(to right, #091278, #f24d0c);
    color: white;
    position: relative;
    z-index: 10;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: flex-start;
    width: 100%;
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }
  
  .logo-img {
    max-width: 80px;
  }
  
  nav {
    display: flex;
    align-items: center;
  }
  
  /* Menú en pantallas grandes */
  .menu {
    list-style: none;
    display: flex;
    gap: 2rem;
  }
  
  .menu li {
    position: relative;
  }
  
  .menu a {
    text-decoration: none;
    color: white;
    font-weight: 600;
    transition: color 0.3s;
  }
  
  .menu a:hover {
    color: #091278; /* Cambia a azul */
  }
  
  .menu li ul {
    display: none;
    position: absolute;
    background: white;
    color: black;
    padding: 0.5rem;
    border-radius: 0.5rem;
    white-space: nowrap;
  }
  
  .menu li ul li a {
    color: black;
    font-weight: 500;
  }
  
  .menu li ul li a:hover {
    color: #f24d0c; /* Cambia a rojo */
  }
  
  .menu li:hover > ul {
    display: block;
  }
  
  /* Menú lateral para pantallas pequeñas */
  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 0.3rem;
  }
  
  .hamburger span {
    width: 25px;
    height: 3px;
    background: white;
  }
  
  .sidebar {
    display: none;
  }
  
  .sidebar.open {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    top: 60px; /* Comienza justo debajo del header */
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.5); /* Fondo transparente */
    backdrop-filter: blur(10px); /* Efecto de desenfoque */
    color: black;
    padding: 1rem;
    overflow-y: auto;
    z-index: 9;
    border-top: 2px solid #f24d0c;
  }
  
  .sidebar-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin: 0.5rem 0;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 15px; /* Botón redondeado */
    transition: background-color 0.3s;
  }
  
  .sidebar-item:hover {
    background-color: #f24d0c; /* Cambiar fondo al pasar el ratón */
    color: white; /* Texto blanco al pasar el ratón */
  }
  
  .sidebar a {
    color: black;
    text-decoration: none;
  }
  
  .sidebar a:hover {
    color: #f24d0c;
  }
  
  @media (max-width: 768px) {
    .logo-container {
      justify-content: center;
    }
  
    .logo-text {
      order: 1;
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
    }
  
    .logo-img {
      order: 0;
      max-width: 60px;
    }
  
    .hamburger {
      display: flex;
      position: absolute;
      left: 1rem;
    }
  
    .menu {
      display: none;
    }
  
    .sidebar {
      top: 60px; /* Ajuste debajo del header */
    }
  
    .sidebar.open {
      top: 60px; /* Se despliega debajo del header */
    }
  }
  
  @media (min-width: 768px) {
    .logo-container {
      justify-content: flex-start;
    }
  
    .logo-text {
      margin-left: 10px;
    }
  }
  </style>
  
  