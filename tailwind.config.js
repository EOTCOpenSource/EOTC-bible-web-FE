// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        auth: "url('/assets/images/auth-bg.jpg')",
      },
      colors: {
        burgundy: 'oklch(var(--burgundy))',
      },
      maxWidth: {
        '8xl': '1344px',
      },
    },
  },
}
