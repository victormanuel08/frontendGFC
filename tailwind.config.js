// tailwind.config.js
export default {
    theme: {
      extend: {
        colors: {   
          blue: {
            50: '#e8f2fc',
            100: '#d1e5f9',
            200: '#a3cbf3',
            300: '#75b1ed',
            400: '#4797e7',
            500: '#6699CC', // DEFAULT
            600: '#517aa3',
            700: '#3d5c7a',
            800: '#283d52',
            900: '#141f29',
            //cmyk: '68-28-9-0',
            //rgb: '102-153-204'
          },

          gray: {
            50: '#f5f5f5',
            100: '#ebebeb',
            200: '#d6d6d6',
            300: '#c2c2c2',
            400: '#999999', // secondary-gray
            500: '#333333', // custom-gray (DEFAULT)
            600: '#292929',
            700: '#1f1f1f',
            800: '#141414',
            900: '#0a0a0a',
            //cmyk: '77-70-68-48',
            //rgb: '51-51-51'
          },
          
          // Rojo acento con escala completa
          red: {
            50: '#ffe5e5',
            100: '#ffb3b3',
            200: '#ff8080',
            300: '#ff4d4d',
            400: '#ff1a1a',
            500: '#CC3333', // DEFAULT
            600: '#a32929',
            700: '#7a1f1f',
            800: '#521414',
            900: '#290a0a',
            //cmyk: '7-90-78-0',
            //rgb: '204-51-51'
          }
        },
        fontFamily: {
          sans: ['HelveticaNeueThn', 'sans-serif'],
          heading: ['HelveticaNeueThn', 'sans-serif']
        }
      }
    }
  }