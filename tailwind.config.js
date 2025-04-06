/** @type {import('tailwindcss').Config} */
export default {
    content: [],
    theme: {
      screens: {
        'xs': '482px',
        'sm': '640px',
        'md': '768px',
        'lg': '1080px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      extend: {
        colors: {
          primary: {
            '50' : '#fdf6ef',
            '100' : '#faeada',
            '200' : '#f3d2b5',
            '300' : '#ebb386',
            '500' : '#de7641',
            '600' : '#cd5529',
            '800' : '#883624',
            '900' : '#6e2e20',
            '950' : '#3b150f'
          }
        },
      },
    },
    plugins: [],
  }
  
  