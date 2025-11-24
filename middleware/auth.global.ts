export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore();

  // Si l'utilisateur est censé être connecté
  if (authStore.authenticated) {
    try {
      // Vérifier le token avant chaque changement de page
      const isValid = await authStore.verifyToken();
      if (!isValid) {
        return navigateTo('/auth/login');
      }
    } catch (error) {
      // Si la vérification échoue, déconnecter l'utilisateur
      console.warn('Auth check failed, logging out:', error);
      authStore.clearUser();
      return navigateTo('/auth/login');
    }
  } else if (
    to.path.startsWith('/dashboard') ||
    to.path.startsWith('/profile') ||
    to.path.startsWith('/collection')
  ) {
    // Rediriger vers login si page protégée et pas connecté
    return navigateTo('/auth/login');
  }
});
