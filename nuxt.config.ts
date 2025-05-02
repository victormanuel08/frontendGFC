// nuxt.config.js
require('dotenv').config();

export default defineNuxtConfig({
  modules: [    
    '@nuxt/ui',

    '@vueuse/nuxt',
    "nuxt-lodash",
    '@nuxt/image'
  ],

  plugins: [
    { src: '~/plugins/pdf.client.js', mode: 'client' }
  ],

  runtimeConfig: {
    apiURL: process.env.API_URL
  },

  build: {
    transpile: ["@fullcalendar"]
  },

  imports: {
    dirs: ["stores"], 
  },

  css: ['~/assets/css/fonts.css'],
  
  devServer: {
    host: '0.0.0.0',
    port: 3000, // Elige el puerto que desees
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }, // 🔹 Habilitar las DevTools
  // image: {
  //   domains: ['localhost:8000'],
  //   alias: {
  //     images: 'http://localhost:8000/media'
  //   },
  //   presets: {
  //     default: {
  //       modifiers: {
  //         quality: 100
  //       }
  //     }
  //   },
  //   staticFilename: '[name].[ext]'  // Evita agregar modificadores
  // },
  
})

