import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated, user } = storeToRefs(useAuthStore());
  const { verifyToken } = useAuthStore();

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/auth/login', '/auth/register', '/'];
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/public');

  // Si on a un token stocké, on vérifie sa validité
  if (user.value?.apiToken && !isPublicRoute) {
    const isValidToken = await verifyToken();
    if (!isValidToken) {
      return navigateTo('/auth/login');
    }
  }

  // Si token existe et url est /login ou /auth/register, rediriger vers l'app
  if (user.value?.apiToken && authenticated.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/app/home');
  }

  // Si pas de token et route protégée, rediriger vers login
  if (!user.value?.apiToken && !isPublicRoute) {
    abortNavigation();
    return navigateTo('/auth/login');
  }
});