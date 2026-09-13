<script setup lang="ts">
import { computed } from 'vue'
import Chart from '../../components/Chart.vue'
import type { Run, ScriptFile, WeeklyRunStat } from '../types'

const props = defineProps<{
  currentDateLabel: string
  runnerState: 'ready' | 'running' | 'passed'
  weeklyRunStats: WeeklyRunStat[]
  files: ScriptFile[]
  filteredFiles: ScriptFile[]
  runs: Run[]
  selectedFile: ScriptFile
  selectedScript: string
  selectedEnvironment: string
  selectedBranch: string
  target: string
  search: string
}>()

const emit = defineEmits<{
  'run-plan': []
  'open-preset': []
  navigate: [view: string]
  'update:selected-script': [value: string]
  'update:selected-environment': [value: string]
  'update:selected-branch': [value: string]
  'update:target': [value: string]
  'update:search': [value: string]
}>()

const selectedScriptModel = computed({
  get: () => props.selectedScript,
  set: (value: string) => emit('update:selected-script', value),
})
const selectedEnvironmentModel = computed({
  get: () => props.selectedEnvironment,
  set: (value: string) => emit('update:selected-environment', value),
})
const selectedBranchModel = computed({
  get: () => props.selectedBranch,
  set: (value: string) => emit('update:selected-branch', value),
})
const targetModel = computed({
  get: () => props.target,
  set: (value: string) => emit('update:target', value),
})
const searchModel = computed({
  get: () => props.search,
  set: (value: string) => emit('update:search', value),
})
</script>

<template>
  <div class="dashboard-layout">
    <section class="hero">
      <div>
        <div class="eyebrow">{{ currentDateLabel }}</div>
        <h1>Iats-poc Test Platform <span><v-icon icon="mdi-cog" color="cyan" /></span></h1>
        <p>Plan, run and monitor your network automation tests from one place.</p>
      </div><v-btn color="primary" prepend-icon="mdi-play" elevation="0" @click="emit('run-plan')">{{ runnerState ===
        'running' ? 'Starting run…' : 'Run test plan' }}</v-btn>
    </section>

    <section class="stats">
      <v-card
        v-for="stat in [{ label: 'RUNS THIS WEEK', value: '128', change: '↑ 18.4%', note: 'vs last week', icon: 'mdi-play-circle-outline', color: 'purple' }, { label: 'PASS RATE', value: '94.8%', change: '↑ 2.1%', note: 'vs last week', icon: 'mdi-check-circle-outline', color: 'green' }, { label: 'ACTIVE PLANS', value: '6', change: '2 scheduled today', note: '', icon: 'mdi-tune-variant', color: 'orange' }, { label: 'AVG. DURATION', value: '04m 12s', change: '↓ 12.6%', note: 'faster this week', icon: 'mdi-timer-outline', color: 'blue' }]"
        :key="stat.label" class="stat-card" elevation="0">
        <div class="stat-label">{{ stat.label }}<v-icon :color="stat.color" :icon="stat.icon" size="20" /></div>
        <strong>{{ stat.value }}</strong>
        <div
          :class="['stat-change', stat.change.startsWith('↑') || stat.change.startsWith('↓') ? 'positive' : 'neutral']">
          {{ stat.change }} <span>{{ stat.note }}</span></div>
      </v-card>
    </section>

    <section class="two-col">
      <Chart />
      <v-card class="panel quick-panel" elevation="0">
        <div class="panel-title">
          <div>
            <h2>Quick run</h2>
            <p>Execute a saved test plan</p>
          </div><v-icon icon="mdi-dots-horizontal" color="grey" />
        </div><v-select v-model="selectedScriptModel" label="TEST PLAN" density="compact" variant="outlined"
          :items="files.filter(f => f.type === 'pytest').map(f => f.name)" /><v-select
          v-model="selectedEnvironmentModel" label="ENVIRONMENT" density="compact" variant="outlined"
          :items="['Staging', 'Production', 'Lab']" />
        <div class="inline"><v-text-field v-model="selectedBranchModel" label="BRANCH" density="compact"
            variant="outlined" /><v-text-field v-model="targetModel" label="TARGET" density="compact"
            variant="outlined" /></div><v-btn block color="primary" elevation="0" prepend-icon="mdi-play"
          @click="emit('run-plan')">{{ runnerState === 'running' ? 'Starting execution…' : 'Run now' }}<span
            class="shortcut">⌘ ↵</span></v-btn>
        <div class="last-run"><v-icon icon="mdi-check-circle" color="success" /><span><strong>Last run
              passed</strong><small>Today at 14:32 · 03m 42s</small></span><code>lab-east-01</code></div>
      </v-card>
    </section>

    <section class="two-col lower">
      <v-card class="panel repository-panel" elevation="0">
        <div class="panel-title">
          <div>
            <h2>Script repository</h2>
            <p>Browse pytest, YAML and XML automation assets</p>
          </div><v-btn variant="text" color="primary" size="small" @click="emit('navigate', 'Script repository')">View
            repository <v-icon icon="mdi-arrow-right" /></v-btn>
        </div>
        <div class="repo-toolbar"><v-text-field v-model="searchModel" density="compact" variant="outlined" hide-details
            placeholder="Filter files..." prepend-inner-icon="mdi-magnify" /><v-btn variant="outlined"
            prepend-icon="mdi-source-branch">main</v-btn></div>
        <div class="file-list"><button v-for="file in filteredFiles" :key="file.name"
            :class="{ selected: selectedScript === file.name }" @click="emit('update:selected-script', file.name)"><span
              class="file-type" :class="file.type">{{ file.type === 'pytest' ? 'PY' : file.type.toUpperCase()
              }}</span><span class="file-copy"><strong>{{ file.name }}</strong><small>{{ file.description
                }}</small></span><v-chip size="x-small" :color="file.status === 'draft' ? 'warning' : 'success'"
              variant="tonal">{{ file.status }}</v-chip></button></div>
      </v-card>
      <v-card class="panel recent-panel" elevation="0">
        <div class="panel-title">
          <div>
            <h2>Recent runs</h2>
            <p>Latest activity from your workspace</p>
          </div><v-btn variant="text" color="primary" size="small" @click="emit('navigate', 'Run history')">View all
            <v-icon icon="mdi-arrow-right" /></v-btn>
        </div>
        <div class="run-list">
          <div v-for="run in runs.slice(0, 4)" :key="run.script + run.time" class="run-row"><v-icon
              :icon="run.status === 'Passed' ? 'mdi-check-circle' : run.status === 'Running' ? 'mdi-loading' : 'mdi-clock-outline'"
              :color="run.status === 'Passed' ? 'success' : 'warning'" size="19" /><span><strong>{{ run.script
                }}</strong><small>{{ run.target }} · {{ run.duration }}</small></span><time>{{ run.time }}</time>
          </div>
        </div>
        <div class="runner-status"><span class="online-dot" />Runner is ready <v-btn variant="text" color="primary"
            size="small" @click="emit('open-preset')">Configure preset <v-icon icon="mdi-arrow-right" /></v-btn></div>
      </v-card>
    </section>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard-layout .hero,
.dashboard-layout .stats,
.dashboard-layout .two-col {
  margin-bottom: 0;
}

.dashboard-layout .hero {
  min-height: 76px;
}

.dashboard-layout .stats {
  gap: 10px;
}

.dashboard-layout .stat-card,
.dashboard-layout :deep(.panel) {
  padding: 15px 16px;
}

.dashboard-layout .stat-card strong {
  margin: 9px 0 4px;
}

.dashboard-layout .two-col {
  gap: 12px;
}

.dashboard-layout :deep(.quick-panel .v-select) {
  margin-top: 10px;
}

.dashboard-layout :deep(.last-run) {
  margin-top: 12px;
}
</style>
