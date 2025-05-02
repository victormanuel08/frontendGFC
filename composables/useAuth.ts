// composables/useAuth.ts
import { useAuthTokensStorage, useAuthUserStorage } from '~/stores/auth';

export const useAuth = () => {
  const { accessToken, refreshToken } = useAuthTokensStorage();
  const user = useAuthUserStorage();
  
  const login = async (credentials: { email: string; password: string }) => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    accessToken.value = response.access_token;
    refreshToken.value = response.refresh_token;
    user.value = response.user;
  };

  const refresh = async () => {
    if (!refreshToken.value) throw new Error('No refresh token');
    
    const response = await $fetch('/api/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken.value }
    });
    
    accessToken.value = response.access_token;
    return response;
  };

  const logout = async () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    await navigateTo('/login');
  };

  return { login, logout, refresh, user };
};