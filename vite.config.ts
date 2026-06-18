import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本地开发用默认 '/'，部署到 GitHub Pages 时用 --base=/nuclear-x/
export default defineConfig({
  plugins: [react()],
})
