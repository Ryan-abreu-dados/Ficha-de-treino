import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * `base` vem do ambiente porque o GitHub Pages serve o site num subcaminho
 * (/Ficha-de-treino/), enquanto Vercel, Netlify e o dev server servem na raiz.
 * Sem isso o Pages sobe o HTML mas procura o JS e o CSS no lugar errado —
 * a pagina abre em branco, sem erro visivel.
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
