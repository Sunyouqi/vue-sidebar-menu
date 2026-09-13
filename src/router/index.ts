import { createRouter, createWebHashHistory } from 'vue-router'
import Installation from '../views/Installation.vue'
import BasicUsage from '../views/BasicUsage.vue'
import Props from '../views/Props.vue'
import Events from '../views/Events.vue'
import Styling from '../views/Styling.vue'
import Slots from '../views/Slots.vue'
import ExScripts from '../views/ExScripts.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Installation', component: Installation },
    { path: '/basic-usage', name: 'BasicUsage', component: BasicUsage },
    { path: '/props', name: 'Props', component: Props },
    { path: '/events', name: 'Events', component: Events },
    { path: '/styling', name: 'Styling', component: Styling },
    { path: '/slots', name: 'Slots', component: Slots },
    { path: '/exscripts', name: 'ExScripts', component: ExScripts },
    { path: '/:pathMatch(.*)', component: Installation },
  ],
})

export default router
