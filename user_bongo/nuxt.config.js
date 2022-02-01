export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'bongobitan',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  env: {
    localEncrypt: "fgFGGg2Gsfg7sRRG4sRG@h3jrJdsf"
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 'primeflex/primeflex.css',
    '@/assets/css/main.css',
    // windi preflight
    // 'virtual:windi-base.css',
    // // windi extras
    // 'virtual:windi-components.css',
    // 'virtual:windi-utilities.css',
  ],
  primevue: {
    theme: 'tailwind-light',
    ripple: true,
    // components: ['Card']
    components: ['Card', 'Button','Toast','ConfirmDialog'],
    directives: ['Tooltip']
  },
  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      // see https://github.com/unjs/listhen#options
      server: {
        port: 4444,
        open: true,
      }
    },

    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
        // @nuxt/image module
        'nuxt-img': 'img',
      },
    },

  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/mixins.js',
    '~/plugins/vue-cryptojs.client.js',
    // '~/plugins/primevue.server.js',
    // '@/plugins/csrf.server.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/image',
    'nuxt-windicss',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://www.primefaces.org/primevue/showcase-v2/#/setup
    'primevue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    withCredentials: true,
    proxy: true
  },
  proxy: {
    '/api/': {
      target: "http://127.0.0.1:8000/",
      pathRewrite: {
        '^/api/': 'api/'
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: true,
    cssSourceMap: true,
    extractCSS: true,
    optimizeCSS: true,
    ssr: true,
    // https://github.com/primefaces/primevue/issues/844
    transpile: [
      'primevue',  'vee-validate/dist/rules',
    ],
  }
}
