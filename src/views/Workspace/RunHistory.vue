<script setup lang="ts">
import type { Run } from '../types'

defineProps<{
  runs: Run[]
}>()
</script>

<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>Run history</h1>
        <p></p>
      </div>
    </div>

    <div class="session-grid single">
      <v-card class="panel session-card" elevation="0">
        <div class="panel-title">
          <div>
            <h2>Execution history</h2>
            <p>{{ runs.length }} recent executions across all environments</p>
          </div><v-btn variant="outlined" prepend-icon="mdi-download">Export CSV</v-btn>
        </div>
        <div class="history-table">
          <div class="history-head"><span>TEST
              SCRIPT</span><span>TARGET</span><span>DURATION</span><span>STATUS</span><span>WHEN</span></div>
          <div v-for="run in runs" :key="run.script + run.time" class="history-row"><strong>{{ run.script
          }}</strong><span>{{ run.target }}</span><span>{{ run.duration }}</span><v-chip size="x-small"
              :color="run.status === 'Passed' ? 'success' : 'warning'" variant="tonal">{{ run.status
              }}</v-chip><time>{{
                run.time }}</time></div>
        </div>
      </v-card>
    </div>
  </section>
</template>
