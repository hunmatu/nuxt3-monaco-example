// process.env
import { config } from 'dotenv'
config()
// https://nuxt.com/docs/api/configuration/nuxt-config
const lifecycle = process.env.npm_lifecycle_event
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/elementPlus.scss'],
  build: {
    transpile: lifecycle === 'build' ? ['element-plus'] : []
  }
})   