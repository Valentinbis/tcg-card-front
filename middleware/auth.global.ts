
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated, user } = storeToRefs(useAuthStore());

  if (user.value?.apiToken) {
    const { data, error } = useFetch('http://127.0.0.1:8000/api/me', {
      headers: { Authorization: `Bearer ${user.value.apiToken}` },
    });

    if (error.value) {
      authenticated.value = false;
      user.value = null;
    } else {
      authenticated.value = true;
    }
  }

  // if token exists and url is /login redirect to homepage
  if (user.value?.apiToken && to?.name === 'login') {
    return navigateTo('/app/dashboard');
  }

  // if token doesn't exist redirect to log in
  if (!user.value?.apiToken && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/auth/login');
  }
});
