<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'

interface Port {
  guid: string
  name: string
  type: string
  pid: string
  side: 'left' | 'right'
}

interface NodeData {
  guid: string
  ip: string
  position: number[]
  objname: string
  class: string
  protocolPort?: string
  username?: string
  password?: string
  version?: string
  interfaces: Port[]
}

const props = defineProps<NodeProps<NodeData>>()
const emit = defineEmits<{
  (event: 'port-dblclick', port: Port): void
  (
    event: 'port-contextmenu',
    port: Port,
    mouseEvent: MouseEvent,
    nodeId: string
  ): void
}>()

const portStyle = (index: number) => ({
  top: `${8 + index * 10}px`,
})

const leftPorts = computed(() =>
  (props.data.interfaces ?? []).filter(
    (interfaces) => interfaces.side === 'left'
  )
)
const rightPorts = computed(() =>
  (props.data.interfaces ?? []).filter(
    (interfaces) => interfaces.side === 'right'
  )
)
</script>

<template>
  <div class="device-node switch-node">
    <div class="device-title">
      <span class="device-icon">S</span>
      <span>{{ data.objname }}</span>
    </div>
    <div class="device-meta">{{ data.ip || 'No IP configured' }}</div>

    <template v-for="(port, index) in leftPorts" :key="port.guid">
      <Handle
        :id="port.guid"
        type="target"
        :position="Position.Left"
        :style="portStyle(index)"
        connectable="single"
        @dblclick.stop="emit('port-dblclick', port)"
        @contextmenu.prevent.stop="
          emit('port-contextmenu', port, $event, props.id)
        "
      />
      <span
        class="port-label port-label-left"
        :style="portStyle(index)"
        @dblclick.stop="emit('port-dblclick', port)"
        @contextmenu.prevent.stop="
          emit('port-contextmenu', port, $event, props.id)
        "
        >{{ port.name }}</span
      >
    </template>
    <template v-for="(port, index) in rightPorts" :key="port.guid">
      <Handle
        :id="port.guid"
        type="source"
        :position="Position.Right"
        :style="portStyle(index)"
        connectable="single"
        @dblclick.stop="emit('port-dblclick', port)"
        @contextmenu.prevent.stop="
          emit('port-contextmenu', port, $event, props.id)
        "
      />
      <span
        class="port-label port-label-right"
        :style="portStyle(index)"
        @dblclick.stop="emit('port-dblclick', port)"
        @contextmenu.prevent.stop="
          emit('port-contextmenu', port, $event, props.id)
        "
        >{{ port.name }}</span
      >
    </template>
  </div>
</template>

<style scoped>
.device-node {
  position: relative;
  min-width: 112px;
  height: 112px;
  box-sizing: border-box;
  padding: 14px 18px;
  border: 1px solid #315b91;
  border-radius: 16px;
  background: linear-gradient(145deg, #173967, #102746);
  color: #e5efff;
  box-shadow: 0 8px 20px rgba(3, 12, 29, 0.32);
}

.device-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
}

.device-icon {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  background: #4f8cff;
  color: white;
  font-size: 13px;
}

.device-meta {
  margin: 12px 0 0 34px;
  color: #94afd1;
  font-size: 11px;
}

.port-label {
  position: absolute;
  transform: translateY(-50%);
  color: #a9c2e4;
  font-size: 10px;
  pointer-events: auto;
  cursor: pointer;
  white-space: nowrap;
}

.port-label-left {
  right: calc(100% + 12px);
}

.port-label-right {
  left: calc(100% + 12px);
}

:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  border: 1px solid #c3dcff;
  background: #4f8cff;
}

:deep(.vue-flow__handle-left) {
  background: #8aa8d6;
}
</style>
