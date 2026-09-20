<script setup lang="ts">
import { ref } from 'vue'
import FileTree from '../../features/file-manager/components/FileTree.vue'
import type { AutomationNode } from '../../features/file-manager/types'
import ConfigureDialog from '../../components/ConfigureDialog.vue'


defineProps<{
  uploadedTree: AutomationNode[]
  darkMode: boolean
}>()

const emit = defineEmits<{
  upload: [node: AutomationNode]
  configure: [node: AutomationNode]
  execute: [node: AutomationNode]
}>()

const configureDialogOpen = ref(false)
const selectedNode = ref<AutomationNode | null>(null)

function openConfigureDialog(node: AutomationNode | null = null) {
  selectedNode.value = node
  configureDialogOpen.value = true
}

function handleConfigure(node: AutomationNode) {
  emit('configure', node)
  openConfigureDialog(node)
}
</script>

<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>脚本管理/执行</h1>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-tune-variant"
          @click="openConfigureDialog()">Configure</v-btn>
        <br />
      </div>
    </div>
    <div class="file-manager-session">
      <v-card class="panel file-manager-card" elevation="0">
        <FileTree :nodes="uploadedTree" :dark-mode="darkMode" @upload="emit('upload', $event)"
          @configure="handleConfigure" @execute="emit('execute', $event)" />
      </v-card>
    </div>
    <ConfigureDialog v-model="configureDialogOpen" :node="selectedNode" />
  </section>
</template>
