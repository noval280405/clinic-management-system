import { createVuetify } from 'vuetify'
import * as labsComponents from 'vuetify/labs/components'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
      components: {
     ...labsComponents, 
      },
        theme: {
            defaultTheme: 'myAllBlackTheme',

            themes: {
                myAllBlackTheme,
            }
          }
    })
    nuxtApp.vueApp.use(vuetify)
})
const myAllBlackTheme = {
    dark: false,
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      'surface-bright': '#FFFFFF',
      'surface-light': '#EEEEEE',
      'surface-variant': '#424242',
      'on-surface-variant': '#EEEEEE',
      primary: '#1867C0',
      'primary-darken-1': '#1F5592',
      secondary: '#48A9A6',
      'secondary-darken-1': '#018786',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
      pengajuan: '#6E747B',
      setuju : '#004AAD'
    },
   
  }