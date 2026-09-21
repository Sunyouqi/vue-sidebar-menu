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

interface TestCenterData {
  objname: string
  ip: string
  version: string
  interfaces: Port[]
}

const props = defineProps<NodeProps<TestCenterData>>()
const emit = defineEmits<{
  (event: 'port-dblclick', port: Port): void
  (
    event: 'port-contextmenu',
    port: Port,
    mouseEvent: MouseEvent,
    nodeId: string
  ): void
}>()
const leftPorts = computed(() =>
  (props.data.interfaces ?? []).filter((port) => port.side === 'left')
)
const rightPorts = computed(() =>
  (props.data.interfaces ?? []).filter((port) => port.side !== 'left')
)
const portStyle = (index: number) => ({ top: `${8 + index * 10}px` })
</script>

<template>
  <div class="device-node testcenter-node">
    <div class="device-title">
      <span class="device-icon">T</span>
      <span>{{ data.objname }}</span>
    </div>
    <div class="device-meta">{{ data.version || 'Spirent TestCenter' }}</div>
    <div class="device-ip">{{ data.ip || 'No IP configured' }}</div>

    <template v-for="(port, index) in leftPorts" :key="port.id">
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
    <template v-for="(port, index) in rightPorts" :key="port.id">
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
  min-width: 188px;
  height: 124px;
  box-sizing: border-box;
  padding: 14px 18px;
  border: 1px solid #825eb5;
  border-radius: 16px;
  background: linear-gradient(145deg, #3b285f, #251940);
  color: #f2eaff;
  box-shadow: 0 8px 20px rgba(22, 7, 38, 0.35);
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
  background: #b277ff;
  color: white;
  font-size: 13px;
}
.device-meta,
.device-ip {
  margin: 10px 0 0 34px;
  color: #c2a9e8;
  font-size: 11px;
}
.device-ip {
  margin-top: 5px;
  color: #a989d2;
}
.port-label {
  position: absolute;
  left: calc(100% + 12px);
  transform: translateY(-50%);
  color: #d0b9ed;
  font-size: 10px;
  cursor: pointer;
  white-space: nowrap;
}
.port-label-left {
  right: calc(100% + 12px);
  left: auto;
}
:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  border: 1px solid #ecd9ff;
  background: #b277ff;
}
:deep(.vue-flow__handle-left) {
  background: #9670c5;
}
</style>
