export default defineNuxtPlugin(async () => {
  // Ce plugin ne s'exécute que côté client
  if (import.meta.server) return;

  const { user, verifyToken, clearUser } = useAuthStore();

  // Si on a un token stocké, on vérifie sa validité au démarrage
  if (user?.apiToken) {
    try {
      console.log('[Auth Plugin] Vérification du token au démarrage...');
      const isValid = await verifyToken();
      if (!isValid) {
        console.warn('[Auth Plugin] Token invalide, nettoyage...');
        clearUser();
      } else {
        console.log('[Auth Plugin] Token valide');
      }
    } catch (error) {
      console.error('[Auth Plugin] Échec de la vérification du token:', error);
      clearUser();
    }
  }
});
