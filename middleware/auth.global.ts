import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated, user } = storeToRefs(useAuthStore());

  // if token exists and url is /login or /auth/register, redirect to homepage
  if (user.value?.apiToken && (to.path ===  '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/app/dashboard');
  }

  // if token doesn't exist and url is not /auth/login or /auth/register, redirect to log in
  if (!user.value?.apiToken && to.path !== '/auth/login' && to.path !== '/auth/register') {
    abortNavigation();
    return navigateTo('/auth/login');
  }
});