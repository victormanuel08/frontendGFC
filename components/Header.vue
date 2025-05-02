<template>
  <header class="header">
    <div class="logo-container">
      <img src="/static/navbar.png" alt="GAMERO FC Logo" class="logo-img" />
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
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

      <!-- Menú lateral en móviles -->
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
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useAuthTokensStorage, useAuthUserStorage, refreshToken } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { accessToken, refreshToken: storedRefreshToken } = useAuthTokensStorage()
const user = useAuthUserStorage()
const router = useRouter()
const menuItems = ref<mi[]>([])
const openSubMenus = ref(new Set())
const isMenuOpen = ref(false)
let tokenCheckInterval: number | null = null

type mi = {
  id: number
  label: string
  path: string
  icon: string
  childs: mi[]
}

const fetchMenuItems = async () => {
  try {
    const response = await fetch('api/public/menu')
    const data = await response.json()
    menuItems.value = data.menu
  } catch (error) {
    console.error('Error fetching menu items:', error)
  }
}

const validateToken = async () => {
  if (!accessToken.value) return

  try {
    const response = await fetch('api/auth/validate-token', {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })

    if (response.status === 401) {
      await refreshToken()
      if (!accessToken.value) logout()
    }
  } catch (error) {
    console.error('Error validando el token:', error)
  }
}

const logout = () => {
  accessToken.value = null
  storedRefreshToken.value = null
  menuItems.value = []
  router.push('/login')
  clearInterval(tokenCheckInterval!)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleSubMenu = (id: any) => {
  openSubMenus.value.has(id) ? openSubMenus.value.delete(id) : openSubMenus.value.add(id)
}

const isSubMenuOpen = (id: any) => openSubMenus.value.has(id)
const openSubMenu = (id: any) => openSubMenus.value.add(id)
const closeSubMenu = (id: any) => openSubMenus.value.delete(id)

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false
    openSubMenus.value.clear()
  }
}

onMounted(() => {
  fetchMenuItems()
  tokenCheckInterval = setInterval(validateToken, 300000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (tokenCheckInterval) clearInterval(tokenCheckInterval)
  window.removeEventListener('resize', handleResize)
})

watch(() => accessToken.value, fetchMenuItems)
</script>

<style scoped>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: linear-gradient(to right, #6699CC 13.3%, #333333 46.6%, #CC3333 80%);
  position: relative;
  z-index: 10;
}

.logo-container {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.logo-img {
  height: 350%;
  max-height: 300px;
  width: auto;
  object-fit: contain;
  
}

nav {
  display: flex;
  align-items: center;
}

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
  color: #091278;
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
  color: #f24d0c;
}

.menu li:hover > ul {
  display: block;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 0.3rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
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
  top: 60px;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
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
  border-radius: 15px;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: #f24d0c;
  color: white;
}

.sidebar a {
  color: black;
  text-decoration: none;
}

.sidebar a:hover {
  color: #f24d0c;
}

@media (max-width: 768px) {
  .header {
    height: 60px;
    padding: 0 1rem;
  }

  .logo-img {
    max-height: 50px;
    margin-left: 40px;
  }

  .menu {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .sidebar.open {
    top: 60px;
  }
}

@media (min-width: 769px) {
  .sidebar {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .logo-img {
    margin-left: 35px;
    max-height: 45px;
  }
}
</style>