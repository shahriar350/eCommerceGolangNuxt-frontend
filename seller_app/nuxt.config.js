import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: 4000 // default: 3000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - bongobitan',
    title: 'bongobitan',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'},
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' },
      // { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css' },
      // { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.4.95/css/materialdesignicons.min.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/mixins',
    '~plugins/get_csrf',
    '~/plugins/error.js',
    '~plugins/vue2editor.client.js',
    '~plugins/tiptapVuetify.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'cookie-universal-nuxt',
    '@nuxtjs/toast',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],
  toast: {
    position: 'bottom-right',
    duration: 4000,
  },
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

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    icons: {
      iconfont: 'mdiSvg', // default - only for display purposes
    },
    treeShake: true,
    // defaultAssets: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: {
      ignoreOrder: true
    },
    transpile: [
      'vee-validate/dist/rules',
      'vuetify/lib', "tiptap-vuetify"
    ],

  }
}
