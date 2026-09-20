<script setup lang="ts">
import AutomationFileTree from './AutomationFileTree.vue'
import type { AutomationNode } from '../types'


defineProps<{
  nodes: AutomationNode[]
  darkMode?: boolean
}>()

const emit = defineEmits<{
  upload: [node: AutomationNode]
  configure: [node: AutomationNode]
  execute: [node: AutomationNode]
}>()
</script>

<template>
  <AutomationFileTree
    :nodes="nodes"
    :dark-mode="darkMode"
    @configure="emit('configure', $event)"
    @execute="emit('execute', $event)"
  />
</template>
//@upload="emit('upload', $event)"
