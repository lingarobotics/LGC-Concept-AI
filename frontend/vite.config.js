import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['lgc-favicon.png'],

      manifest: {
        name: 'LGC Concept AI',
        short_name: 'LGC AI',
        description:
          'Exam-oriented AI learning assistant for Anna University engineering students.',

        theme_color: '#0f1115',
        background_color: '#0f1115',

        display: 'standalone',
        scope: '/',
        start_url: '/',

        icons: [
          {
            src: '/lgc-favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lgc-favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/lgc-favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
})