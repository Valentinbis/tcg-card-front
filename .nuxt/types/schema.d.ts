import { NuxtModule, RuntimeConfig } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ["primevue"]?: typeof import("@primevue/nuxt-module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["piniaPersistedstate"]?: typeof import("@pinia-plugin-persistedstate/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["auth"]?: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,  modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@primevue/nuxt-module", Exclude<NuxtConfig["primevue"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@pinia-plugin-persistedstate/nuxt", Exclude<NuxtConfig["piniaPersistedstate"], boolean>] | ["nuxt-auth-utils", Exclude<NuxtConfig["auth"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["primevue"]?: typeof import("@primevue/nuxt-module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["piniaPersistedstate"]?: typeof import("@pinia-plugin-persistedstate/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["auth"]?: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,  modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@primevue/nuxt-module", Exclude<NuxtConfig["primevue"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@pinia-plugin-persistedstate/nuxt", Exclude<NuxtConfig["piniaPersistedstate"], boolean>] | ["nuxt-auth-utils", Exclude<NuxtConfig["auth"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },

   session: {
      name: string,

      password: string,

      cookie: {
         sameSite: string,
      },
   },

   oauth: {
      github: {
         clientId: string,

         clientSecret: string,
      },

      spotify: {
         clientId: string,

         clientSecret: string,
      },

      google: {
         clientId: string,

         clientSecret: string,
      },

      twitch: {
         clientId: string,

         clientSecret: string,
      },

      auth0: {
         clientId: string,

         clientSecret: string,

         domain: string,

         audience: string,
      },

      microsoft: {
         clientId: string,

         clientSecret: string,

         tenant: string,

         scope: Array<any>,

         authorizationURL: string,

         tokenURL: string,

         userURL: string,
      },

      discord: {
         clientId: string,

         clientSecret: string,
      },

      battledotnet: {
         clientId: string,

         clientSecret: string,
      },

      keycloak: {
         clientId: string,

         clientSecret: string,

         serverUrl: string,

         realm: string,
      },

      linkedin: {
         clientId: string,

         clientSecret: string,
      },

      cognito: {
         clientId: string,

         clientSecret: string,

         region: string,

         userPoolId: string,
      },

      facebook: {
         clientId: string,

         clientSecret: string,
      },
   },
  }
  interface PublicRuntimeConfig {
   apiBase: string,

   primevue: {
      usePrimeVue: boolean,

      autoImport: boolean,

      resolvePath: any,

      importPT: any,

      importTheme: {
         from: string,
      },

      options: {
         ripple: boolean,

         locale: {
            dayNames: Array<string>,

            dayNamesShort: Array<string>,

            dayNamesMin: Array<string>,

            monthNames: Array<string>,

            monthNamesShort: Array<string>,

            today: string,

            weekHeader: string,

            firstDayOfWeek: number,

            dateFormat: string,

            fileSizeTypes: Array<any>,

            clear: string,
         },
      },

      components: Array<{

      }>,

      directives: Array<{

      }>,

      composables: Array<{

      }>,

      config: Array<{

      }>,

      services: Array<{

      }>,

      styles: Array<{

      }>,

      injectStylesAsString: Array<any>,

      injectStylesAsStringToTop: Array<string>,
   },

   persistedState: {
      storage: string,

      debug: boolean,

      cookieOptions: any,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }