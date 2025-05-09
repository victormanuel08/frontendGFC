<template>
  <div class="fixed top-1/2 right-4 -translate-y-1/2 flex flex-row gap-3 z-[1000]">

    <UTooltip text="Contactar por WhatsApp" :popper="{ placement: 'left' }">
      <UButton icon="i-heroicons-chat-bubble-oval-left-ellipsis" color="green" size="xl" square :ui="{
        rounded: 'rounded-full',
        padding: { xl: 'p-3' }
      }" class="shadow-lg hover:scale-110 transition-transform duration-200 bg-[#25D366] hover:bg-[#128C7E]"
        @click="openWhatsApp" />
    </UTooltip>
    <!-- Botón Login/Logout -->
    <UTooltip :text="isLogged ? 'Cerrar sesión' : 'Iniciar sesión'" :popper="{ placement: 'left' }">
      <UButton :icon="isLogged ? 'i-heroicons-arrow-left-end-on-rectangle' : 'i-heroicons-user-circle'"
        :color="isLogged ? 'red' : 'primary'" size="xl" square :ui="{
          rounded: 'rounded-full',
          padding: { xl: 'p-3' }
        }" class="shadow-lg transition-transform duration-200 hover:bg-blue-800 hover:scale-110"
        @click="handleAuthAction" />
    </UTooltip>


    <!-- Botón WhatsApp -->


    <!-- Modal de Login -->
    <UModal v-model="isLoginModalOpen">
      <div class="p-6 space-y-6">
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {{ isRegistering ? 'Registro' : 'Inicio de Sesión' }}
        </h2>

        <form @submit.prevent="submitAuthForm">
          <div class="space-y-4">
            <UFormGroup label="Usuario" required>
              <UInput v-model="authForm.username" type="text" placeholder="Nombre de usuario"
                icon="i-heroicons-user-circle" autofocus />
            </UFormGroup>

            <UFormGroup label="Contraseña" required>
              <UInput v-model="authForm.password" type="password" placeholder="••••••••"
                icon="i-heroicons-lock-closed" />
            </UFormGroup>

            <div v-if="isRegistering" class="space-y-4">
              <UFormGroup label="Confirmar Contraseña" required>
                <UInput v-model="authForm.passwordConfirm" type="password" placeholder="••••••••"
                  icon="i-heroicons-lock-closed" />
              </UFormGroup>
            </div>

            <div class="flex gap-3">
              <UButton type="submit" :loading="isSubmitting" :label="isRegistering ? 'Registrarse' : 'Iniciar Sesión'"
                class="flex-1"
                :disabled="isSubmitting || (isRegistering && authForm.password !== authForm.passwordConfirm)" />
              <UButton color="gray" label="Cancelar" class="flex-1" @click="closeAuthModal" />
            </div>
          </div>
        </form>

        <div class="text-center">
          <button @click="toggleAuthMode" class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400">
            {{ isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate' }}
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAuthTokensStorage, useAuthUserStorage } from '~/stores/auth'
import Swal from 'sweetalert2'

const { accessToken, refreshToken } = useAuthTokensStorage()
const user = useAuthUserStorage()
const router = useRouter()

const isLoginModalOpen = ref(false)
const isRegistering = ref(false)
const isSubmitting = ref(false)

const authForm = reactive({
  username: '',
  password: '',
  passwordConfirm: ''
})

const isLogged = computed(() => !!accessToken.value)

const handleAuthAction = () => {
  if (isLogged.value) {
    // Limpiar autenticación
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    router.push('/')
    Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente', 'success')
  } else {
    isLoginModalOpen.value = true
  }
}

const submitAuthForm = async () => {
  isSubmitting.value = true
  try {
    if (isRegistering.value) {
      await handleRegistration()
    } else {
      await handleLogin()
    }
  } catch (error) {
    console.error('Error de autenticación:', error)
    Swal.fire('Error', error.message || 'Error en la autenticación', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleLogin = async () => {
  const response = await fetch('/api/auth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: authForm.username,
      password: authForm.password
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Credenciales inválidas')
  }

  const data = await response.json()
  let token = data.access
  if (!token.startsWith('Bearer ')) token = `Bearer ${token}`

  accessToken.value = token

  const userResponse = await fetch('/api/me', {
    headers: { Authorization: token }
  })

  if (!userResponse.ok) throw new Error('Error al obtener datos de usuario')

  user.value = await userResponse.json()
  closeAuthModal()
  Swal.fire('Éxito', 'Sesión iniciada correctamente', 'success')
}

const handleRegistration = async () => {
  if (authForm.password !== authForm.passwordConfirm) {
    throw new Error('Las contraseñas no coinciden')
  }

  const response = await $fetch('/api/auth/register', {
    method: 'POST',
    body: {
      username: authForm.username,
      password: authForm.password
    }
  })

  Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión', 'success')
  toggleAuthMode()
}

const toggleAuthMode = () => {
  isRegistering.value = !isRegistering.value
  resetForm()
}

const closeAuthModal = () => {
  isLoginModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  authForm.username = ''
  authForm.password = ''
  authForm.passwordConfirm = ''
}

const openWhatsApp = () => {
  window.open('https://wa.me/573214575107', '_blank')
}
</script>

<style scoped>
@media (max-width: 768px) {
  .fixed {
    right: 0.5rem;
    gap: 0.75rem;
  }

  .u-button {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>