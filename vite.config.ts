import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:preview` gera um único HTML autocontido (imagens e fontes
// embutidas) em dist-preview/, para visualizar sem servidor.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'preview-file' ? [viteSingleFile()] : [])],
  ...(mode === 'preview-file' && {
    build: { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 },
  }),
}))
