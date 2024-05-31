import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-segoeui)']
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'max-content' // add required value here
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
export default config
