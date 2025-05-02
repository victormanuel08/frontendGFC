// middleware/auth.global.ts
import { jwtDecode } from "jwt-decode"

const publicRoutes = [
  "/",
  "/home",
]

export default defineNuxtRouteMiddleware((to) => {
  if (publicRoutes.includes(to.path) || to.fullPath.includes("api")) return

  const accessToken = useCookie('token').value
  const refreshToken = useCookie('refresh_token').value

  if (!accessToken) {
    return navigateTo("/")
  }

  try {
    const decodedToken = jwtDecode(accessToken)
    const expDT = new Date(decodedToken.exp * 1000)
    const nowDT = new Date()

    if (expDT < nowDT) {
      return navigateTo("/")
    }

    if (refreshToken && (expDT.getTime() - nowDT.getTime()) < 300000) {
      $fetch("/api/auth/refresh", {
        method: "POST",
        body: { refreshToken }
      }).then((response) => {
        if (response.accessToken) {
          useCookie('token').value = response.accessToken
        }
      })
    }
  } catch (e) {
    return navigateTo("/")
  }
})