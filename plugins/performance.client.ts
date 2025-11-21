export default defineNuxtPlugin(() => {
  // Optimisation: Disable console logs en production
  if (import.meta.client && import.meta.env.PROD) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }
});
