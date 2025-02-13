// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/icon", "@nuxt/image"],

  plugins: [
    '~/plugins/error-handler.ts', // Ruta al archivo de plugin
  ],

  imports: {
    dirs: ['stores'],
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000, // Elige el puerto que desees
  },

  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  image: {
    domains: ['localhost:8000'],
    alias: {
      images: 'http://localhost:8000/media'
    },
    presets: {
      default: {
        modifiers: {
          quality: 100
        }
      }
    },
    staticFilename: '[name].[ext]'  // Evita agregar modificadores
  }
})
