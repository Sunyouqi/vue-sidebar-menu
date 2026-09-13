import type { App, Plugin } from 'vue'
import SidebarMenu from './components/SidebarMenu.vue'
import FetchComponent from './components/FetchComponent.vue'

export type {
  SidebarMenuProps,
  SidebarMenuEmits,
  SidebarItemType,
  SidebarItem,
  SidebarHeaderItem,
  SidebarComponentItem,
  ItemIcon,
  ItemBadge,
} from './types'

const plugin: Plugin = {
  install(app: App) {
    app.component('SidebarMenu', SidebarMenu)
    app.component('FetchComponent', FetchComponent)
  },
}

export default plugin

export { SidebarMenu, FetchComponent }
