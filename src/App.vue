<script setup lang="ts">

import '@he-tree/vue/style/default.css'
import { computed, h, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import type { SidebarMenuProps, SidebarItem } from './types/index'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { AutomationNode } from './features/file-manager/types'
import type { Run, ScriptFile, WeeklyRunStat } from './views/types'
import Dashboard from './views/Workspace/Dashboard.vue'
import ScriptRepository from './views/Workspace/ScriptRepository.vue'
import FileManager from './views/Workspace/FileManager.vue'
import TestPlans from './views/Workspace/TestPlans.vue'
import RunHistory from './views/Workspace/RunHistory.vue'
import Environments from './views/Resources/Environments.vue'
import TeamSettings from './views/Resources/TeamSettings.vue'

const collapsed = ref(false)
const isOnMobile = ref(false)
const activeView = ref('Dashboard')
const selectedScript = ref('tests/bgp_convergence.py')
const search = ref('')
const runnerState = ref<'ready' | 'running' | 'passed'>('ready')
const presetDialog = ref(false)
const selectedEnvironment = ref('Staging')
const selectedBranch = ref('main')
const target = ref('lab-east-01')
const theme = useTheme()
const darkMode = ref(false)
const currentDate = ref(new Date())
let dateTimer: number | undefined
const uploadedTree = ref<AutomationNode[]>([])

const icon = (name: string) => ({
  element: h('div', [h(FontAwesomeIcon, { icon: name })]),
})

const menu = ref<SidebarMenuProps['menu']>([
  { header: 'WORKSPACE', hiddenOnCollapse: true },
  { title: 'Dashboard', href: '#/', icon: icon('fa-solid fa-chart-line') },
  { title: 'Script repository', href: '#/repository', icon: icon('fa-solid fa-code-branch'), badge: { text: '24', class: 'vsm--badge_default' } },
  { title: 'File manager', href: '#/files', icon: icon('fa-solid fa-folder-tree') },
  { title: 'Test plans', href: '#/plans', icon: icon('fa-solid fa-sliders') },
  { title: 'Run history', href: '#/history', icon: icon('fa-solid fa-clock-rotate-left') },
  { header: 'RESOURCES', hiddenOnCollapse: true },
  { title: 'Environments', href: '#/environments', icon: icon('fa-solid fa-server') },
  { title: 'Team settings', href: '#/settings', icon: icon('fa-solid fa-gear') },
])

const files: ScriptFile[] = [
  { name: 'tests/bgp_convergence.py', type: 'pytest', status: 'stable', description: 'BGP peer convergence after route updates' },
  { name: 'tests/interface_health.py', type: 'pytest', status: 'stable', description: 'Validate interface errors and link state' },
  { name: 'tests/ospf_failover.py', type: 'pytest', status: 'draft', description: 'Measure OSPF failover recovery time' },
  { name: 'fixtures/lab-east-01.yaml', type: 'yaml', status: 'ready', description: 'East lab inventory and credentials' },
  { name: 'fixtures/routing-policy.xml', type: 'xml', status: 'ready', description: 'Route policy fixture for edge devices' },
]

const runs = ref<Run[]>([
  { script: 'bgp_convergence.py', target: 'lab-east-01', duration: '03m 42s', status: 'Passed', time: '2 min ago' },
  { script: 'interface_health.py', target: 'lab-west-02', duration: '01m 18s', status: 'Passed', time: '18 min ago' },
  { script: 'ospf_failover.py', target: 'lab-east-01', duration: '—', status: 'Queued', time: 'Scheduled' },
])
const weeklyRunStats = ref<WeeklyRunStat[]>([
  { label: 'Mon', passed: 18, failed: 2 },
  { label: 'Tue', passed: 24, failed: 1 },
  { label: 'Wed', passed: 15, failed: 3 },
  { label: 'Thu', passed: 29, failed: 2 },
  { label: 'Fri', passed: 22, failed: 1 },
  { label: 'Sat', passed: 10, failed: 1 },
  { label: 'Sun', passed: 2, failed: 0 },
])

const filteredFiles = computed(() => files.filter((file) => file.name.toLowerCase().includes(search.value.toLowerCase())))
const selectedFile = computed(() => files.find((file) => file.name === selectedScript.value) ?? files[0])
const breadcrumbSection = computed(() => ['Environments', 'Team settings'].includes(activeView.value) ? 'Resources' : 'Workspace')
const currentDateLabel = computed(() => new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(currentDate.value).toUpperCase())
function runPlan() {
  if (runnerState.value === 'running') return
  runnerState.value = 'running'
  runs.value.unshift({ script: selectedFile.value.name.split('/').pop() ?? selectedFile.value.name, target: target.value, duration: 'Running', status: 'Running', time: 'Just now' })
  window.setTimeout(() => {
    runnerState.value = 'passed'
    runs.value[0].status = 'Passed'
    runs.value[0].duration = '02m 14s'
    weeklyRunStats.value[6].passed += 1
  }, 1500)
}

function onItemClick(_event: Event, item: SidebarItem) {
  activeView.value = item.title ?? 'Dashboard'
}

function configureNode(node: AutomationNode) {
  console.info(`Pytest configuration requested for ${node.path}`)
}

function handleTreeUpload(node: AutomationNode) {
  uploadedTree.value = node.children
}

function executeNode(node: AutomationNode) {
  console.info(`Python execution requested for ${node.path}`)
}

function onResize() {
  isOnMobile.value = window.innerWidth <= 767
  if (isOnMobile.value) collapsed.value = true
}

function toggleTheme(value: boolean | null) {
  darkMode.value = value === true
  theme.global.name.value = darkMode.value ? 'automationDark' : 'automation'
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
  dateTimer = window.setInterval(() => {
    currentDate.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (dateTimer !== undefined) window.clearInterval(dateTimer)
})
</script>

<template>
  <v-app>
    <sidebar-menu v-model:collapsed="collapsed" :menu="menu" :show-one-child="true" :smooth-scroll="true"
      @item-click="onItemClick" />
    <div v-if="isOnMobile && !collapsed" class="sidebar-overlay" @click="collapsed = true" />
    <div id="automation-app" :class="{ collapsed, onmobile: isOnMobile, 'dark-mode': darkMode }">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">N</div>
          <div><strong>netpilot</strong><small>AUTOMATION CONSOLE</small></div>
        </div>
        <div class="breadcrumbs"><span>{{ breadcrumbSection }}</span><b>/</b><strong>{{ activeView }}</strong></div>
        <div class="top-actions"><button class="theme-toggle" type="button" :aria-pressed="darkMode"
            aria-label="Toggle light and dark theme" @click="toggleTheme(!darkMode)"><span
              class="theme-toggle-track"><span class="theme-toggle-thumb"><v-icon
                  :icon="darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'" size="13" /></span></span><span>{{
                    darkMode ? 'Dark' : 'Light' }}</span></button><v-btn icon="mdi-help-circle-outline" variant="text"
            size="small" /><!-- <v-btn icon="mdi-bell-outline" variant="text" size="small" /> --><v-avatar
            color="#f6dfca" size="30"><span class="avatar-text">iats-poc</span></v-avatar></div>
      </header>

      <main class="content">
        <Dashboard v-if="activeView === 'Dashboard'" v-model:selected-script="selectedScript"
          v-model:selected-environment="selectedEnvironment" v-model:selected-branch="selectedBranch"
          v-model:target="target" v-model:search="search" :current-date-label="currentDateLabel"
          :runner-state="runnerState" :weekly-run-stats="weeklyRunStats" :files="files" :filtered-files="filteredFiles"
          :runs="runs" :selected-file="selectedFile" @run-plan="runPlan" @navigate="activeView = $event"
          @open-preset="presetDialog = true" />
        <ScriptRepository v-else-if="activeView === 'Script repository'" v-model:selected-script="selectedScript"
          v-model:search="search" :filtered-files="filteredFiles" :selected-file="selectedFile"
          :selected-branch="selectedBranch" @run-plan="runPlan" @open-preset="presetDialog = true" />
        <FileManager v-else-if="activeView === 'File manager'" :uploaded-tree="uploadedTree" :dark-mode="darkMode"
          @upload="handleTreeUpload" @configure="configureNode" @execute="executeNode" />
        <TestPlans v-else-if="activeView === 'Test plans'" @run-plan="runPlan"
          @update:selected-script="selectedScript = $event" @open-preset="presetDialog = true" />
        <RunHistory v-else-if="activeView === 'Run history'" :runs="runs" />
        <Environments v-else-if="activeView === 'Environments'" />
        <TeamSettings v-else-if="activeView === 'Team settings'" />
      </main>
    </div>

  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
@import './assets/main.css'
</style>
