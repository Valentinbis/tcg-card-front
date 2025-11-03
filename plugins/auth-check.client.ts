export default defineNuxtPlugin(async () => {
  // Ce plugin ne s'exécute que côté client
  if (process.server) return;

  const { user, verifyToken } = useAuthStore();

  // Si on a un token stocké, on vérifie sa validité au démarrage
  if (user?.apiToken) {
    try {
      await verifyToken();
    } catch (error) {
      console.warn('Échec de la vérification du token au démarrage:', error);
    }
  }
});