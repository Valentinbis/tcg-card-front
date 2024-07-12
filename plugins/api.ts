import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const user = storeToRefs(useAuthStore());

    const api = $fetch.create({
      baseURL: 'http://localhost:8000/api/',
      onRequest({ request, options, error }) {
        if (user.value?.apiToken) {
          const headers = options.headers ||= {}
          if (Array.isArray(headers)) {
            headers.push(['Authorization', `Bearer ${user.value?.token}`])
          } else if (headers instanceof Headers) {
            headers.set('Authorization', `Bearer ${user.value?.token}`)
          } else {
            headers.Authorization = `Bearer ${user.value?.token}`
          }
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo('/auth/login'))
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })
  