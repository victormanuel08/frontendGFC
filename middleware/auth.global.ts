
import { jwtDecode } from "jwt-decode";
import { useCookie } from 'nuxt/app';

const publicRoutes = [
  "/",
  "/home",
  "/championship",
  "/club",
  "/sportsvenue",  
];

export default defineNuxtRouteMiddleware((to) => {
  console.log("Middleware de autenticación global", to.path, to.fullPath);
  if (publicRoutes.includes(to.path) || to.fullPath.includes("api")) {
    console.log("Ignoramos la ruta pública");
    return;
  }

  const accessToken = useCookie('token');
  const refreshToken = useCookie('refresh_token');

  if (!accessToken.value) {
    return navigateTo("/");
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(accessToken.value);
    console.log("Tenemos token");
    if (!decodedToken || !decodedToken.exp) {
      return navigateTo("/");
    }
  } catch (e) {
    console.error(e);
    return navigateTo("/");
  }

  const expDT = new Date(decodedToken.exp * 1000); // Convertimos el tiempo de expiración a milisegundos
  const nowDT = new Date();
  const remainingTime = expDT.getTime() - nowDT.getTime();

  // Si queda menos de 60 segundos, renovamos el token
  if (remainingTime < 300000) {


    if (refreshToken.value) {
      $fetch("/api/auth/refresh", {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      }).then((response) => {
        if (response.accessToken) {
        
          accessToken.value = response.accessToken;
          useCookie('token').value = response.accessToken;
        }
      });
    }
  } else {
    const CURRENT_USER_PATH = '/api/me';
    const useUserStorage = useAuthUserStorage();
    if (decodedToken.user_id !== useUserStorage.value.id) {
      $fetch(CURRENT_USER_PATH).then((response) => {
        if (response.error) {
          console.error(response.error);
          return navigateTo("/");
        }
        useUserStorage.value = response;
      });
    }
  }

  if (expDT < nowDT) {

    return navigateTo("/");
  }
});
