<script setup lang="ts">
import { computed } from 'vue'
import type { ScriptFile } from '../types'

const props = defineProps<{
  filteredFiles: ScriptFile[]
  selectedFile: ScriptFile
  selectedScript: string
  selectedBranch: string
  search: string
}>()

const emit = defineEmits<{
  'run-plan': []
  'open-preset': []
  'update:selected-script': [value: string]
  'update:search': [value: string]
}>()

const searchModel = computed({
  get: () => props.search,
  set: (value: string) => emit('update:search', value),
})
</script>

<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>文件仓库</h1>
        <p></p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="0" @click="emit('open-preset')"></v-btn>
    </div>

    <div class="session-grid">
      <v-card class="panel session-card" elevation="0">
        <div class="panel-title">
          <div>
            <h2>Automation assets</h2>
            <p>{{ filteredFiles.length }} assets in the connected repository</p>
          </div><v-text-field v-model="searchModel" density="compact" variant="outlined" hide-details
            placeholder="Filter files..." prepend-inner-icon="mdi-magnify" />
        </div>
        <div class="file-list large-file-list"><button v-for="file in filteredFiles" :key="file.name"
            :class="{ selected: selectedScript === file.name }" @click="emit('update:selected-script', file.name)"><span
              class="file-type" :class="file.type">{{ file.type === 'pytest' ? 'PY' : file.type.toUpperCase()
              }}</span><span class="file-copy"><strong>{{ file.name }}</strong><small>{{ file.description
                }}</small></span><v-chip size="x-small" :color="file.status === 'draft' ? 'warning' : 'success'"
              variant="tonal">{{ file.status }}</v-chip><v-icon icon="mdi-chevron-right" size="18"
              color="grey" /></button></div>
      </v-card>
      <v-card class="panel session-card code-card" elevation="0">
        <div class="panel-title">
          <div>
            <h2>{{ selectedFile.name }}</h2>
            <p>Connected branch: {{ selectedBranch }}</p>
          </div><v-btn color="primary" variant="tonal" size="small" @click="emit('run-plan')">Run script</v-btn>
        </div>
        <pre><code>import pytest

    @pytest.mark.network
    def test_network_state(device, baseline):
    result = device.collect_state()
    assert result.is_reachable
    assert result.matches(baseline)</code></pre>
      </v-card>
    </div>
  </section>
</template>
