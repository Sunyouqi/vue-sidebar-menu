import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
//import basicssl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.esm-bundler.js' },
    dedupe: ['vue'],
  },
})
