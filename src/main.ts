import { createApp } from 'vue'
import App from './App.vue'
import VueSidebarMenu from './index'
import router from './router'
import PrismCode from './components/PrismCode.vue'

import './assets/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueFinder from 'vuefinder'
import 'vuefinder/dist/vuefinder.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {
  VAvatar, VIcon, VBtn, VCard, VSelect,
  VChip, VTextField, VApp
} from 'vuetify/components'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { EnformaPlugin } from '@encolajs/enforma'
import useVuetifyPreset from '@encolajs/enforma/presets/vuetify'

const vuetify = createVuetify({
  components: {
    VAvatar,
    VIcon,
    VBtn,
    VCard,
    VSelect,
    VTextField,
    VApp,
    VChip,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'automation',
    themes: {
      automation: {
        dark: false,
        colors: {
          primary: '#635bff',
          secondary: '#0e9f6e',
          background: '#f7f8fc',
          surface: '#ffffff',
        },
      },
      automationDark: {
        dark: true,
        colors: {
          primary: '#8a83ff',
          secondary: '#43d6a7',
          background: '#11131c',
          surface: '#1b1e2a',
        },
      },
    },
  },
})
useVuetifyPreset()

createApp(App)
  .use(router)
  .use(VueSidebarMenu)
  .use(vuetify)
  .use(EnformaPlugin)
  .component('prism-code', PrismCode)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(VueFinder)
  .mount('#app')
