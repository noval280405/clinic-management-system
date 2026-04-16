import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserStore } from '~/stores/userStore'
import _ from "lodash";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = getAuth()
    // console.log'middleaware')
    const userstore = useUserStore()
    // console.log'9 middleware')
    // console.logto.fullPath)
    if (to.fullPath === from.fullPath) { // refresh doang
        onAuthStateChanged(auth, async (user) => {
            userstore.setUser(user)
            if (user != null) {
                // console.log12)

                userstore.setEmail(user.email)
                localStorage.setItem('uid', user.uid)
                sessionStorage.setItem('email', user.email!)
                sessionStorage.setItem('displayName', user.displayName!)
                userstore.setDisplayname(user.displayName)
                const currentpath = sessionStorage.getItem('currentPath')
                if (currentpath && to.fullPath != '/login') {
                    // console.log'15')
                    navigateTo(currentpath)
                } else {
                    navigateTo('/')
                }

            }
        })
    } else if (to.fullPath == '/login') {
        onAuthStateChanged(auth, (user) => {
            if (user != null) {
                // console.log123)
                userstore.setEmail(user.email)
                userstore.setDisplayname(user.displayName)
                navigateTo('/')
            }
        })
    }
})