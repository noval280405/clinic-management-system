import { getAuth, onAuthStateChanged } from "firebase/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth()
  const userstore = useUserStore()

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      userstore.setUser(user)

      // =========================
      // ✅ SUDAH LOGIN
      // =========================
      if (user) {
        userstore.setEmail(user.email)
        userstore.setDisplayname(user.displayName)

        localStorage.setItem('uid', user.uid)
        sessionStorage.setItem('email', user.email!)
        sessionStorage.setItem('displayName', user.displayName!)

        // ❗ kalau sudah login tapi buka login → redirect ke admin
        if (to.path === '/login') {
          return resolve(navigateTo('/admin/'))
        }

        return resolve()
      }

      // =========================
      // ❌ BELUM LOGIN
      // =========================
      else {
        // ❗ IZINKAN akses ke:
        // - / (landing page)
        // - /login
        if (to.path === '/' || to.path === '/login') {
          return resolve()
        }

        // ❗ selain itu redirect ke login
        return resolve(navigateTo('/login'))
      }
    })
  })
})