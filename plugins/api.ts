export default defineNuxtPlugin((nuxtApp) => {
    const { session } = useUserSession()
  
    const api = $fetch.create({
      baseURL: 'http://localhost:8000/api/',
      onRequest({ request, options, error }) {
        if (session.value?.token) {
          const headers = options.headers ||= {}
          if (Array.isArray(headers)) {
            headers.push(['Authorization', `Bearer ${session.value?.token}`])
          } else if (headers instanceof Headers) {
            headers.set('Authorization', `Bearer ${session.value?.token}`)
          } else {
            headers.Authorization = `Bearer ${session.value?.token}`
          }
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo('/login'))
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
  