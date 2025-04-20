// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['@/assets/css/global.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/apollo',
    '@nuxt/icon',
    '@nuxtjs/supabase'
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.HASURA_GRAPHQL_ENDPOINT,
        httpLinkOptions: {
          headers: {
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
          },
        }
      },
    },
  }
})