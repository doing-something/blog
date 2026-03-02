/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'h1': { marginTop: '0', marginBottom: '0.75em' },
            'h2': { marginTop: '1.5em', marginBottom: '0.5em' },
            'h3, h4': { marginTop: '1.25em', marginBottom: '0.5em' },
            'p, ul, ol': { marginTop: '0.625em', marginBottom: '0.625em' },
            'li': { marginTop: '0.25em', marginBottom: '0.25em' },
            'blockquote': { marginTop: '0.75em', marginBottom: '0.75em' },
            'pre, table': { marginTop: '0.75em', marginBottom: '0.75em' },
            'hr': { marginTop: '1.5em', marginBottom: '1.5em' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
