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
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "defaultTheme",
        themes: {
          defaultTheme: {
            dark: false,
            colors: {
              background: "#FFFFFF",
              surface: "#FFFFFF",
              "surface-bright": "#FFFFFF",
              "surface-light": "#EEEEEE",
              "surface-variant": "#424242",
              "on-surface-variant": "#EEEEEE",
              primary: "#1867C0",
              "primary-darken-1": "#1F5592",
              secondary: "#48A9A6",
              "secondary-darken-1": "#018786",
              error: "#B00020",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              pengajuan: "#6E747B",
              setuju: "#004AAD",
            },
          },
        },
      },
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    // 1. Tambahkan ini (Jangan masukkan ke dalam 'public')
    // Nuxt akan otomatis memetakan NUXT_FIREBASE_SERVICE_ACCOUNT dari .env ke sini
    firebaseProjectId: process.env.project_id,
    firebaseClientEmail: process.env.client_email,
    firebasePrivateKey: process.env.private_key,
    public: {
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