export default defineNuxtRouteMiddleware(() => {
  const { $auth } = useNuxtApp();

  // Vérifier si l'utilisateur est connecté
  const auth = $auth as { user?: { value?: boolean } } | undefined;
  if (!auth?.user?.value) {
    return navigateTo('/login');
  }
});
