import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, type Messaging } from 'firebase/messaging'

declare module '#app' {
  interface NuxtApp {
    $messaging: Messaging
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $messaging: Messaging
  }
}

export default defineNuxtPlugin(() => {
  const app = getApps()[0] ?? initializeApp({
    apiKey: "AIzaSyAtlns1ykxpb8itm3gMQcp8dgW-Xn3H5y0",
    authDomain: "clinic-management-erp.firebaseapp.com",
    projectId: "clinic-management-erp",
    storageBucket: "clinic-management-erp.firebasestorage.app",
    messagingSenderId: "794499631983",
    appId: "1:794499631983:web:619b6faf0a09df80aeb69a",
  })

  const messaging = getMessaging(app)
  return {
    provide: {
      messaging,
    }
  }
})