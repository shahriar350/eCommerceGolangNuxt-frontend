import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  attributify: true,
  safelist: 'p-1 p-2 p-3 p-4',
  theme: {
    container: {
      center: true,
      padding: {
        'DEFAULT': '1rem',
        'sm': '2rem',
        'lg': '4rem',
        'xl': '5rem',
        '2xl': '6rem',
      },
    },
  },
})
