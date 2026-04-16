// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module", '@pinia/nuxt', "nuxt-vuefire"],
  build: {
    transpile: ['qrcode-vue3', 'vuetify'] // If you need to transpile external packages
  },
  nitro: {
    // keduanya bekerja di Cloud Run; pilih salah satu:
    // preset: 'gcp',
    preset: 'node-server',
    serveStatic: true,            // pastikan /_nuxt/* diserve sebagai static
    // optional: kurangi kejutan waktu build
    prerender: { crawlLinks: false },

    experimental: {
      asyncContext: true, // ✅ WAJIB ditambahkan
    },
  },
  vite: {
    optimizeDeps: {
      include: ['vuetify/labs/VTimePicker'], // ⬅️ penting!
    },
    build: {
      rollupOptions: {
        external: [], // pastikan tidak meng-external-kan 'vuetify'
      },
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    // 1. Tambahkan ini (Jangan masukkan ke dalam 'public')
    // Nuxt akan otomatis memetakan NUXT_FIREBASE_SERVICE_ACCOUNT dari .env ke sini
    cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
    token_kv: process.env.NUXT_TOKEN_KV,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    public: {
      cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      url: process.env.urlapi,
      apimaps: process.env.apimaps,
      anomid: process.env.anomid,
      putriid: process.env.putriid,

      firebaseApiKey: process.env.apiKey,
      firebaseAuthDomain: process.env.authDomain,
      firebaseProjectId: process.env.projectId,
      firebaseStorageBucket: process.env.storageBucket,
      firebaseMessagingSenderId: process.env.messagingSenderId,
      firebaseAppId: process.env.appId,
    }
  },
  ssr: false,
  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId
      // there could be other properties depending on the project
    },
  },
  compatibilityDate: "2024-07-09",
})