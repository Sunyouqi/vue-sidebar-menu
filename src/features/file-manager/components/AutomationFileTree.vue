<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { Draggable, OpenIcon } from '@he-tree/vue'
import type { AutomationNode } from '../types'

const props = withDefaults(defineProps<{ nodes: AutomationNode[]; depth?: number; darkMode?: boolean }>(), {
  depth: 0,
  darkMode: false,
})
const emit = defineEmits<{
  upload: [node: AutomationNode]
  configure: [node: AutomationNode]
  execute: [node: AutomationNode]
}>()
const uploadInput = ref<HTMLInputElement | null>(null)
const treeRef = ref<InstanceType<typeof Draggable>>()
const localNodes = ref(props.nodes)

watch(() => props.nodes, (nodes) => {
  localNodes.value = nodes
})

const fileCount = computed(() => {
  let count = 0
  const visit = (nodes: AutomationNode[]) => nodes.forEach((node) => {
    if (node.kind === 'file') count += 1
    visit(node.children)
  })
  visit(props.nodes)
  return count
})

function buildTree(files: FileList) {
  const roots: AutomationNode[] = []
  Array.from(files).forEach((file) => {
    const path = file.webkitRelativePath || file.name
    const parts = path.split('/').filter(Boolean)
    let level = roots
    let parentPath = ''
    parts.forEach((name, index) => {
      const currentPath = parentPath ? `${parentPath}/${name}` : name
      let node = level.find((candidate) => candidate.name === name)
      if (!node) {

        node = {
          id: currentPath,
          name,
          path: currentPath,
          kind: index === parts.length - 1 ? 'file' : 'folder',
          children: [],
          expanded: true,
          file: index === parts.length - 1 ? file : undefined,
        }
        if ((node.kind == 'file' && name.endsWith('.py')) ||
          (node.kind == 'folder' && !name.startsWith('.'))) {
          level.push(node)
        }
        //level.push(node)
      }
      parentPath = currentPath
      level = node.children
    })
  })
  return roots
}

function handleUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return
  const tree = buildTree(files)
  localNodes.value = tree
  emit('upload', { id: '__upload__', name: `${files.length} uploaded files`, path: '', kind: 'folder', children: tree, expanded: true })
}

function openUploadDialog() {
  if (!uploadInput.value) return
  uploadInput.value.value = ''
  uploadInput.value.click()
}

/* function addFile(node: AutomationNode) {
  node.children.push({
    id: `${node.path}/new-test.py`,
    name: 'new-test.py',
    path: `${node.path}/new-test.py`,
    kind: 'file',
    children: [],
    expanded: false,
  })
}

function addFolder(node: AutomationNode) {
  node.children.push({
    id: `${node.path}/new-folder`,
    name: 'new-folder',
    path: `${node.path}/new-folder`,
    kind: 'folder',
    children: [],
    expanded: true,
  })
} */

function executePython(node: AutomationNode) {
  emit('execute', node)
}

</script>

<template>
  <section class="tree-shell" :class="{ 'tree-shell-dark': darkMode }">
    <div v-if="depth === 0" class="tree-toolbar">
      <div><strong class="repository-tree-title" :class="{ 'repository-tree-title-dark': darkMode }">Local automation
          repository</strong><small>{{ fileCount }} files · recursive tree</small></div>
      <v-btn class="upload-folder-button" size="small" color="primary" variant="tonal" prepend-icon="mdi-folder-upload"
        @click="openUploadDialog">Upload folder</v-btn>
      <input ref="uploadInput" hidden type="file" webkitdirectory directory multiple @change="handleUpload">
    </div>
    <div v-if="depth === 0 && !localNodes.length" class="tree-empty">
      <v-icon class="empty-folder-icon" icon="mdi-folder-open-outline" size="42" />
      <strong>Upload a local test folder</strong>
      <span>Folders are expanded into a navigable tree. Python files get a setup action.</span>
      <v-btn class="upload-folder-button" color="primary" variant="tonal" @click="openUploadDialog">Choose
        folder</v-btn>
    </div>
    <Draggable v-else ref="treeRef" v-model="localNodes" :disable-drag="true" class="mtl-tree" tree-line>
      <template #default="{ node, stat }">
        <div class="tree-node" :class="stat.data.kind">
          <OpenIcon v-if="stat.data.kind === 'folder'" :open="stat.open" class="expand-button"
            @click="stat.open = !stat.open" />
          <span v-else class="expand-spacer" />
          <v-icon :class="stat.data.kind === 'folder' ? 'folder-icon' : 'file-icon'"
            :icon="stat.data.kind === 'folder' ? (stat.open ? 'mdi-folder-open' : 'mdi-folder') : 'mdi-file-code-outline'"
            size="18" />
          <span class="node-name">{{ node.name }}</span>
          <v-chip v-if="node.name.endsWith('.enx')" size="x-small" color="info" variant="tonal">environment</v-chip>
          <template v-if="stat.data.kind === 'folder'">
            <!-- <v-btn icon="mdi-file-plus-outline" size="x-small" variant="text" aria-label="Add file"
              @click="addFile(stat.data)" /> -->
            <!-- <v-btn icon="mdi-folder-plus-outline" size="x-small" variant="text" aria-label="Add folder"
              @click="addFolder(stat.data)" /> -->
          </template>
          <v-btn v-if="stat.data.kind === 'file' && node.name.endsWith('.py')" icon="mdi-tune-variant" size="x-small"
            color="primary" variant="tonal" aria-label="Configure pytest setup" @click="emit('configure', stat.data)" />
          <v-btn v-if="stat.data.kind === 'file' && node.name.endsWith('.py')" class="execute-script-button"
            prepend-icon="mdi-play" size="small" color="success" variant="outlined" aria-label="Execute Python script"
            @click.stop="executePython(stat.data)">Run</v-btn>
        </div>
      </template>
    </Draggable>
  </section>
</template>

<style scoped>
.tree-shell {
  --tree-surface: #fff;
  --tree-border: #e6e8ef;
  --tree-hover: #f5f4ff;
  --tree-text: #5d6270;
  --tree-muted: #8f94a2;
  --tree-folder: #c58b34;
  --tree-file: #737989;
  --execute-border: #0e9f6e;
  --execute-text: #0b1b15;
  --execute-text_2: #33c594;
  border: 1px solid var(--tree-border);
  border-radius: 9px;
  background: var(--tree-surface);
  overflow: hidden;
}

.tree-shell-dark {
  --tree-surface: #1b1e2a;
  --tree-border: #303443;
  --tree-hover: #292744;
  --tree-text: #aeb3c2;
  --tree-muted: #aeb3c2;
  --tree-folder: #f1bd61;
  --tree-file: #c1c7d4;
  --execute-border: #65e8bd;
  --execute-text: #fff;
}

.tree-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% + 2px);
  min-height: 62px;
  margin: -1px -1px 0;
  padding: 15px 17px;
  box-sizing: border-box;
  background: var(--tree-surface);
  border-bottom: 1px solid var(--tree-border);
  border-radius: 9px 9px 0 0;
}

.tree-toolbar>div {
  flex: 1;
}

.tree-toolbar strong,
.tree-toolbar small {
  display: block;
}

.repository-tree-title {
  color: #11131c !important;
  font-size: 12px;
}

.repository-tree-title-dark {
  color: #fff !important;
}

.tree-toolbar small {
  margin-top: 4px;
  color: var(--tree-muted);
  font-size: 10px;
}

.tree-toolbar {
  border-color: var(--tree-border);
}

.upload-folder-button {
  color: #11131c !important;
  padding: 8px 14px !important;
  border: 1px solid #8b86d7 !important;
  border-radius: 7px !important;
  cursor: pointer;
}

.tree-shell-dark .upload-folder-button {
  color: #fff !important;
  border-color: #a59fff !important;
}

.tree-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  min-height: 300px;
  justify-content: center;
  color: var(--tree-muted);
  font-size: 11px;
}

.tree-empty strong {
  color: var(--tree-text);
  font-size: 13px;
}

.tree-empty span {
  max-width: 320px;
  text-align: center;
  line-height: 1.5;
}

.empty-folder-icon {
  color: var(--tree-muted);
}

.mtl-tree {
  margin: 0;
  padding: 12px 16px 18px;
  min-height: 300px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  box-sizing: border-box;
  min-height: 34px;
  padding: 3px 7px;
  border-radius: 5px;
}

.tree-node:hover {
  background: var(--tree-hover);
}

.expand-button {
  width: 16px;
  color: var(--tree-muted);
}

.tree-shell-dark .expand-button {
  color: #fff !important;
}

:deep(.tree-shell-dark .expand-button),
:deep(.tree-shell-dark .expand-button svg),
:deep(.tree-shell-dark .expand-button path) {
  color: #fff !important;
  fill: #fff !important;
  stroke: #fff !important;
}

.expand-spacer {
  width: 16px;
}

.folder-icon {
  color: var(--tree-folder);
}

.tree-shell-dark .folder-icon {
  color: #fff;
}

.file-icon {
  color: var(--tree-file);
}

.node-name {
  flex: 1;
  color: var(--tree-text);
  font: 11px 'DM Mono', monospace;
  user-select: none;
}

.execute-script-button {
  border: 1px solid #0e9f6e !important;
  color: #0e7f5a !important;
  cursor: pointer;
}

.tree-shell-dark .execute-script-button {
  border-color: #65e8bd !important;
  color: #fff !important;
}

.tree-node.folder .node-name {
  color: var(--tree-text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
}
</style>
