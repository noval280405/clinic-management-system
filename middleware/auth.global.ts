import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserStore } from '~/stores/userStore'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = getAuth()
    const userstore = useUserStore()

    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            userstore.setUser(user)

            if (user) {
                userstore.setEmail(user.email)
                userstore.setDisplayname(user.displayName)

                localStorage.setItem('uid', user.uid)
                sessionStorage.setItem('email', user.email!)
                sessionStorage.setItem('displayName', user.displayName!)

                // ✅ kalau sudah login dan buka login page → redirect ke home
                if (to.path === '/login') {
                    return resolve(navigateTo('/'))
                }

                // ✅ selain itu BIARKAN di halaman sekarang (tidak redirect)
                return resolve()
            } else {
                // ❌ kalau belum login dan bukan di login → paksa ke login
                if (to.path !== '/login') {
                    sessionStorage.setItem('currentPath', to.fullPath)
                    return resolve(navigateTo('/login'))
                }

                return resolve()
            }
        })
    })
})