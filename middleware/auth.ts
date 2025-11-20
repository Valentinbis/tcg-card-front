export default defineNuxtRouteMiddleware(() => {
  const { $auth } = useNuxtApp();

  // Vérifier si l'utilisateur est connecté
  if (!($auth as any)?.user?.value) {
    return navigateTo('/login');
  }
});