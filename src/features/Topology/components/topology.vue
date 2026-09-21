<script setup lang="ts">
import { computed, ref, shallowRef, triggerRef } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, Edge, EdgeMouseEvent, Node, NodeMouseEvent } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'
import TopologyNode_ from './TopologyNode_.vue'
import TestCenterNode from './TestCenterNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

console.log("uuid:", uuidv4())
let uid = (uuidv4().replace(/[-]/gi, "a"))
console.log("uid:", uid)

type DeviceKind = 'switch' | 'testcenter'

interface Port {
  guid: string;
  name: string;
  type: string;
  pid: string;
  side: 'left' | 'right'
}


interface NodeData {
  guid: string;
  ip: string;
  position: Number[];
  objname: string;
  class: string;
  protocolPort?: string;
  username?: string;
  password?: string;
  version?: string;
  interfaces: Port[];
}

interface DeviceData {
  name: string;
  ip: string;
  protocolPort?: string;
  username?: string;
  password?: string;
  version?: string;
  ports: Port[]
}

type TopologyNode_ = Node<NodeData>

type TopologyNode = Node<DeviceData>
type ContextMenu = { x: number; y: number; kind: 'node' | 'port' | 'edge'; nodeId?: string; portId?: string; edgeId?: string }

const nodes_ = shallowRef<TopologyNode_[]>([
  { id: 'switch-1', type: 'switch', position: { x: 90, y: 150 }, data: { guid: `${uuidv4().replace(/[-]/gi, "a")}`, position: [90, 150, 64, 64], objname: 'Switch instance', class: "switch", ip: '10.0.0.10', protocolPort: '22', username: 'admin', password: '', interfaces: [{ guid: 'ge-1', name: 'GE 1', type: '1G', pid: '1', side: 'right' }, { guid: 'ge-2', name: 'GE 2', type: '1G', pid: '2', side: 'right' }] } },
  { id: 'testcenter-1', type: 'testcenter', position: { x: 560, y: 150 }, data: { guid: `${uuidv4().replace(/[-]/gi, "a")}`, position: [560, 150, 64, 64], objname: 'Spirent TestCenter', class: "testcenter", ip: '10.0.0.20', version: '5.50', interfaces: [{ guid: 'port-1', name: 'Port 1', type: '10G', pid: '1', side: 'left' }] } },
])

const nodes = shallowRef<TopologyNode[]>([
  { id: 'switch-1', type: 'switch', position: { x: 90, y: 150 }, data: { name: 'Core Switch', ip: '10.0.0.10', protocolPort: '22', username: 'admin', password: '', ports: [{ guid: 'ge-1', name: 'GE 1', type: '1G', pid: '1', side: 'right' }, { guid: 'ge-2', name: 'GE 2', type: '1G', pid: '2', side: 'right' }] } },
  { id: 'testcenter-1', type: 'testcenter', position: { x: 560, y: 150 }, data: { name: 'Spirent TestCenter', ip: '10.0.0.20', version: '5.50', ports: [{ guid: 'port-1', name: 'Port 1', type: '10G', pid: '1', side: 'left' }] } },
])


const edges = shallowRef<Edge[]>([])
const selectedId = ref<string | null>('switch-1')
const selectedPort = ref<Port | null>(null)
const portDraft = ref<Port | null>(null)
const contextMenu = ref<ContextMenu | null>(null)
const xmlFileInput = ref<HTMLInputElement | null>(null)
const { addEdges, screenToFlowCoordinate } = useVueFlow()

const selectedNode = computed<TopologyNode_ | null>(() => {
  const node = nodes_.value.find((item) => item.id === selectedId.value)
  return node ?? null
})
const selectedData = computed<NodeData | undefined>(() => selectedNode.value?.data)

function selectNode(event: NodeMouseEvent) {
  selectedId.value = event.node.id
  selectedPort.value = null
  contextMenu.value = null
}

function openNodeMenu(event: NodeMouseEvent) {
  selectedId.value = event.node.id
  const mouseEvent = event.event
  if (mouseEvent instanceof MouseEvent) contextMenu.value = { x: mouseEvent.clientX, y: mouseEvent.clientY, kind: 'node', nodeId: event.node.id }
}

function openPortMenu(port: Port, event: MouseEvent, nodeId: string) {
  selectedId.value = nodeId
  contextMenu.value = { x: event.clientX, y: event.clientY, kind: 'port', nodeId, portId: port.guid }
}

function openEdgeMenu(event: EdgeMouseEvent) {
  if (event.event instanceof MouseEvent) contextMenu.value = { x: event.event.clientX, y: event.event.clientY, kind: 'edge', edgeId: event.edge.id }
}

function deleteContextItem() {
  const menu = contextMenu.value
  if (!menu) return
  if (menu.kind === 'node' && menu.nodeId) {
    nodes_.value = nodes_.value.filter((node) => node.id !== menu.nodeId)
    edges.value = edges.value.filter((edge) => edge.source !== menu.nodeId && edge.target !== menu.nodeId)
    if (selectedId.value === menu.nodeId) selectedId.value = null
  } else if (menu.kind === 'edge' && menu.edgeId) {
    edges.value = edges.value.filter((edge) => edge.id !== menu.edgeId)
  } else if (menu.kind === 'port' && menu.nodeId && menu.portId) {
    const node = nodes_.value.find((item) => item.id === menu.nodeId)
    if (node?.data) node.data.interfaces = node.data.interfaces.filter((interfaces) => interfaces.guid !== menu.portId)
    triggerRef(nodes_)
    edges.value = edges.value.filter((edge) => edge.sourceHandle !== menu.portId && edge.targetHandle !== menu.portId)
  }
  selectedPort.value = null
  portDraft.value = null
  contextMenu.value = null
}

function closeContextMenu() {
  contextMenu.value = null
}

function onConnect(connection: Connection) {
  if (connection.source && connection.target) addEdges(connection)
}

function dragStart(event: DragEvent, kind: DeviceKind | 'port') {
  event.dataTransfer?.setData('application/topology-item', kind)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}

function onDrop(event: DragEvent) {
  const kind = event.dataTransfer?.getData('application/topology-item')
  if (!kind) return
  const position = screenToFlowCoordinate({ x: event.clientX, y: event.clientY })
  if (kind === 'port') {
    const target = nodes_.value.find((node) => position.x >= node.position.x && position.x <= node.position.x + 250 && position.y >= node.position.y && position.y <= node.position.y + 180)
    if (target) addPort(target.id, position.x < target.position.x + 125 ? 'left' : 'right')
    return
  }
  const id = `${kind}-${Date.now()}`
  const data: NodeData = kind === 'switch'
    ? { guid: `"${uuidv4().replace(/[-]/gi, "a")}"`, position: [], objname: 'New Switch', ip: '', protocolPort: '22', class: "switch", username: '', password: '', interfaces: [] }
    : { guid: `"${uuidv4().replace(/[-]/gi, "a")}"`, position: [], objname: 'New TestCenter', ip: '', version: '', class: "testcenter", interfaces: [] }
  nodes_.value = [...nodes_.value, { id, type: kind, position, data }]
  selectedId.value = id
}

function addPort(nodeId = selectedId.value, side: 'left' | 'right' = 'right') {
  if (!nodeId) return
  const node = nodes_.value.find((item) => item.id === nodeId)
  if (!node?.data) return
  const number = node.data.interfaces.length + 1
  node.data.interfaces.push({ guid: `port-${Date.now()}`, name: `Port ${number}`, type: '1G', pid: String(number), side })
  triggerRef(nodes_)
}

function editPort(port: Port) {
  selectedPort.value = port
  portDraft.value = { ...port }
}

function savePort() {
  if (!selectedPort.value || !portDraft.value) return
  Object.assign(selectedPort.value, portDraft.value)
  triggerRef(nodes_)
  selectedPort.value = null
  portDraft.value = null
}

function escapeXml(value: string | null | undefined) {
  if (value) {
    console.log("encoding:", encodeURIComponent(value))
  }

  return String(value ?? '').replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

function saveEnx() {
  const guid1 = uuidv4();
  const objguid = uuidv4();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n
  <logic_environment>
    <parameters>
      <parameter name="guid" value="${guid1}" />
      <parameter name="remark" value="" />
      <parameter name="objname" value="${objguid}" />
      <parameter name="class" value="Env" />
    </parameters>
    <devices>
      <device>
        <parameters>
          <parameter name="guid" value="30178c9d566c47fc86f68af703054469" />
                <parameter name="ip" value="120.108.42.90" />
                <parameter name="position" value="758.9200000000001,680,64,64" />
                <parameter name="objname" value="Spirent" />
                <parameter name="class" value="Atm" />
                <parameter name="icon" value="Atm" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="version" value="" />
                <parameter name="username" value="" />
                <parameter name="password" value="" />
                <parameter name="remark" value="" />
                <parameter name="type" value="tester" />
                <parameter name="pypackage" value="" />
                <parameter name="pyclass" value="" />
                <parameter name="alias" value="" />
                <parameter name="caption" value="" />
                <parameter name="is_topo" value="" />
                <parameter name="realtype" value="" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="fullclass" value="Atm" />
        </parameters>
        <devices>
          <device>
            <parameters>
                <parameter name="guid" value="756287fee60c48258708ba4da97c3a35" />
                <parameter name="objname" value="Port1_tester_to_rta" />
                <parameter name="class" value="Port" />
                <parameter name="icon" value="Port" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="remark" value="" />
                <parameter name="ip" value="" />
                <parameter name="type" value="" />
                <parameter name="version" value="" />
                <parameter name="pypackage" value="" />
                <parameter name="pyclass" value="" />
                <parameter name="alias" value="" />
                <parameter name="caption" value="" />
                <parameter name="is_topo" value="" />
                <parameter name="realtype" value="" />
                <parameter name="username" value="" />
                <parameter name="password" value="" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="pid" value="" />
                <parameter name="fullclass" value="Atm::Port" />
            </parameters>
          </device>
          <device>
            <parameters>
                <parameter name="guid" value="bce06d57069e41339dddfc7d733d7a9a" />
                <parameter name="objname" value="Port3_tester_to_rta" />
                <parameter name="class" value="Port" />
                <parameter name="icon" value="Port" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="remark" value="" />
                <parameter name="ip" value="" />
                <parameter name="type" value="" />
                <parameter name="version" value="" />
                <parameter name="pypackage" value="" />
                <parameter name="pyclass" value="" />
                <parameter name="alias" value="" />
                <parameter name="caption" value="" />
                <parameter name="is_topo" value="" />
                <parameter name="realtype" value="" />
                <parameter name="username" value="" />
                <parameter name="password" value="" />
                <parameter name="shape" value="RectFrame" />
                <parameter name="fullclass" value="Atm::Port" />
            </parameters>
          </device>
          <device>
            <parameters>
              <parameter name="guid" value="7b3011d1a9644500a9d0a8bdd53d6649" />
              <parameter name="objname" value="Port6_tester_to_rta" />
              <parameter name="class" value="Port" />
              <parameter name="icon" value="Port" />
              <parameter name="shape" value="RectFrame" />
              <parameter name="remark" value="" />
              <parameter name="ip" value="" />
              <parameter name="type" value="" />
              <parameter name="version" value="" />
              <parameter name="pypackage" value="" />
              <parameter name="pyclass" value="" />
              <parameter name="alias" value="" />
              <parameter name="caption" value="" />
              <parameter name="is_topo" value="" />
              <parameter name="realtype" value="" />
              <parameter name="username" value="" />
              <parameter name="password" value="" />
              <parameter name="shape" value="RectFrame" />
              <parameter name="fullclass" value="Atm::Port" />
            </parameters>
          </device>
        </devices>
      </device>
      <device>
        <parameters>
          <parameter />
          <parameter />
          <parameter />
        </parameters>
        <devices>
          <device>
            <parameters>
              <parameter />
              <parameter />
              <parameter />
            </parameters>
          </device>
        </devices>
      </device>
    </devices>
  <links>
    <link>
    
    </link>
  </links>
  </logic_environment>\n`;
}

function saveXml() {
  console.log('!!!!!!!!', edges.value.length)
  const guid1 = uuidv4()
  const objguid = uuidv4()
  const xml = `<logic_environment>
    <parameters>
      <parameter name="guid" value="${guid1}" />
      <parameter name="remark" value="" />
      <parameter name="objname" value="${objguid}" />
      <parameter name="class" value="Env" />
    </parameters>
  ${nodes_.value
    .map((node) => {
      const data = node.data
      if (!data) return ''
      const attrs = Object.entries(data)
        .filter(([key]) => key !== 'interfaces')
        .map(
          ([key, value]) =>
            `<parameter name="${key}" value="${escapeXml(value)}" />`
        )
        .join('\n')
      const ports = data.interfaces
        .map(
          (interfaces) =>
            `<device>
      <parameters>
        <parameter name="guid" value="${interfaces.guid}" />
        <parameter name="name" value="${escapeXml(interfaces.name)}" />
        <parameter name="type" value="${escapeXml(interfaces.type)}" />
        <parameter name="pid" value="${escapeXml(interfaces.pid)}" />
        <parameter name="side" value="${escapeXml(interfaces.side)}" />
      </parameters>
     </device>\n`
        )
        .join('')
      const ports_devces = `<devices>\n${ports}</devices>`
      return `  <devices>\n <device>\n<parameters>\n${attrs}\n</parameters>\n${ports_devces}\n </device>\n </devices>\n`
    })
    .join('')}
  ${
    edges.value.length > 0
      ? `<links>
  ${edges.value
    .map(
      (edge) => `<link>
  <parameter name="guid" value="${escapeXml(edge.id)}" />
  <parameter name="remark" value="" />
  <parameter name="objgname" value="${edge.sourceHandle}_${
        edge.targetHandle
      }" />
  <parameter name="sourcetopdevicename" value="${escapeXml(edge.source)}" />
  <parameter name="sourcedeviceid" value="${escapeXml(edge.sourceHandle)}" />
  <parameter name="targettopdevicename" value="${escapeXml(edge.target)}" />
  <parameter name="targetdeviceid" value="${escapeXml(edge.targetHandle)}" />
  <parameter name="class" value="Connect" />
  <parameter name="position" value=";" />
  </link>\n `
    )
    .join('')}`
      : '<links>'
  }
  </links>
  </logic_environment>\n`

  const url = URL.createObjectURL(new Blob([xml], { type: 'application/xml' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'topology.xml'
  anchor.click()
  URL.revokeObjectURL(url)
}

function openXmlPicker() {
  xmlFileInput.value?.click()
}

function attribute(element: Element, name: string, fallback = '') {
  return element.getAttribute(name) ?? fallback
}

function parseNumber(value: string, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function loadXml(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const document = new DOMParser().parseFromString(String(reader.result), 'application/xml')
    if (document.querySelector('parsererror') || document.documentElement.nodeName !== 'topology') {
      window.alert('The selected file is not a valid topology XML file.')
      return
    }

    const importedNodes: TopologyNode[] = Array.from(document.querySelectorAll(':scope > device')).map((element, index) => {
      const type = attribute(element, 'type', 'switch') === 'testcenter' ? 'testcenter' : 'switch'
      const data: DeviceData = {
        name: attribute(element, 'name', `Imported ${type}`),
        ip: attribute(element, 'ip'),
        ports: Array.from(element.querySelectorAll(':scope > port')).map((port, portIndex) => ({
          guid: attribute(port, 'id', `${attribute(element, 'id', `device-${index}`)}-port-${portIndex + 1}`),
          name: attribute(port, 'name', `Port ${portIndex + 1}`),
          type: attribute(port, 'type', '1G'),
          pid: attribute(port, 'pid', String(portIndex + 1)),
          side: attribute(port, 'side', 'right') === 'left' ? 'left' : 'right',
        })),
      }
      if (type === 'switch') {
        data.protocolPort = attribute(element, 'protocolPort')
        data.username = attribute(element, 'username')
        data.password = attribute(element, 'password')
      } else {
        data.version = attribute(element, 'version')
      }
      return {
        id: attribute(element, 'id', `device-${index + 1}`),
        type,
        position: {
          x: parseNumber(attribute(element, 'x'), 120 + index * 220),
          y: parseNumber(attribute(element, 'y'), 120),
        },
        data,
      }
    })
    const importedEdges: Edge[] = Array.from(document.querySelectorAll(':scope > edge')).map((element, index) => ({
      id: attribute(element, 'id', `edge-${index + 1}`),
      source: attribute(element, 'source'),
      sourceHandle: attribute(element, 'sourceHandle') || undefined,
      target: attribute(element, 'target'),
      targetHandle: attribute(element, 'targetHandle') || undefined,
    })).filter((edge) => edge.source && edge.target)

    nodes.value = importedNodes
    edges.value = importedEdges
    selectedId.value = importedNodes[0]?.id ?? null
    selectedPort.value = null
    portDraft.value = null
    contextMenu.value = null
  }
  reader.onerror = () => window.alert('The topology XML file could not be read.')
  reader.readAsText(file)
}

function onCanvasDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}
</script>

<template>
  <div class="topology-shell">
    <aside class="left-panel">
      <div class="eyebrow">TOPOLOGY BUILDER</div>
      <h1>Network lab</h1>
      <p class="muted">Drag equipment and ports onto the canvas.</p>
      <div class="menu-label">EQUIPMENT</div>
      <div class="palette-card" draggable="true" @dragstart="dragStart($event, 'switch')"><span
          class="palette-icon switch">S</span><span><strong>Switch</strong><small>Network device</small></span><span
          class="drag-grip">⋮⋮</span></div>
      <div class="palette-card" draggable="true" @dragstart="dragStart($event, 'testcenter')"><span
          class="palette-icon testcenter">T</span><span><strong>Spirent TestCenter</strong><small>Traffic
            generator</small></span><span class="drag-grip">⋮⋮</span></div>
      <div class="menu-label">PORTS</div>
      <div class="palette-card port-card" draggable="true" @dragstart="dragStart($event, 'port')"><span
          class="port-dot"></span><span><strong>Network port</strong><small>Drop on a device</small></span><span
          class="drag-grip">⋮⋮</span></div>
      <div class="legend"><span class="legend-dot connected"></span> Connected <span
          class="legend-dot available"></span> Available</div>
    </aside>

    <main class="canvas-area" @drop="onDrop" @dragover="onCanvasDragOver" @click="closeContextMenu">
      <div class="canvas-toolbar"><span class="status-dot"></span><span>Unsaved topology</span><span
          class="toolbar-hint">Drag to pan · Scroll to zoom</span></div>
      <VueFlow v-model:nodes="nodes_" v-model:edges="edges" :default-viewport="{ zoom: 0.9, x: 30, y: 30 }"
        fit-view-on-init @connect="onConnect" @node-click="selectNode" @node-context-menu="openNodeMenu"
        @edge-context-menu="openEdgeMenu">
        <template #node-switch="props">
          <TopologyNode_ v-bind="props" @port-dblclick="editPort" @port-contextmenu="openPortMenu" />
        </template>
        <template #node-testcenter="props">
          <TestCenterNode v-bind="props" @port-dblclick="editPort" @port-contextmenu="openPortMenu" />
        </template>
      </VueFlow>
      <div v-if="contextMenu" class="context-menu" :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        @click.stop>
        <button @click="deleteContextItem">Delete {{ contextMenu.kind }}</button>
      </div>
    </main>

    <aside class="right-panel">
      <input ref="xmlFileInput" class="file-input" type="file" accept=".xml,application/xml,text/xml"
        @change="loadXml" />
      <div class="inspector-header">
        <div>
          <div class="eyebrow">INSPECTOR</div>
          <h2>{{ selectedData?.objname || 'No selection' }}</h2>
        </div>
        <div class="inspector-actions"><button class="icon-button" title="Open topology XML"
            @click="openXmlPicker">↑</button><button class="icon-button" title="Save topology as XML"
            @click="saveXml">↓</button></div>
      </div>
      <div v-if="selectedData && !selectedPort" class="form">
        <label>Name<input v-model="selectedData.objname" /></label>
        <label>IP address<input v-model="selectedData.ip" placeholder="192.168.1.10" /></label>
        <template v-if="selectedNode?.type === 'switch'">
          <label>Protocol port<input v-model="selectedData.protocolPort" /></label>
          <label>Login username<input v-model="selectedData.username" /></label>
          <label>Password<input v-model="selectedData.password" type="password" /></label>
        </template>
        <label v-else>Version<input v-model="selectedData.version" placeholder="5.50" /></label>
        <button class="add-button" @click="addPort()">＋ Add port</button>
      </div>
      <div v-else-if="selectedPort && portDraft" class="form">
        <div class="section-title">EDIT PORT</div>
        <label>Interface name<input v-model="portDraft.name" /></label>
        <label>Interface type<input v-model="portDraft.type" placeholder="10G" /></label>
        <label>PID / port ID<input v-model="portDraft.pid" /></label>
        <div class="button-row"><button class="ghost-button" @click="selectedPort = null">Cancel</button><button
            class="save-button" @click="savePort">Save port</button></div>
      </div>
      <div v-else class="empty-state">Select a device to edit its connection details.</div>
      <div class="save-box">
        <div><strong>Import or export topology</strong>
          <p>Open a saved XML file or save the current canvas for later.</p>
        </div>
        <div class="export-actions"><button class="open-button" @click="openXmlPicker">Open XML
            <span>↥</span></button><button class="export-button" @click="saveXml">Save XML <span>↗</span></button></div>
      </div>
    </aside>
  </div>
</template>

<style>
.topology-shell {
  display: grid;
  grid-template-columns: 248px 1fr 292px;
  height: 100vh;
  overflow: hidden;
  background: #0b1424;
  color: #dce8fa;
  font: 13px Inter, ui-sans-serif, system-ui, sans-serif;
}

.left-panel,
.right-panel {
  background: #101d31;
  padding: 28px 20px;
  z-index: 2;
}

.left-panel {
  border-right: 1px solid #1e3150;
}

.right-panel {
  border-left: 1px solid #1e3150;
}

.eyebrow,
.menu-label,
.section-title {
  color: #7088aa;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
}

.menu-label {
  margin: 30px 0 10px;
}

h1 {
  margin: 7px 0;
  font-size: 21px;
  letter-spacing: -.03em;
}

.muted {
  margin: 0;
  color: #7187a7;
  line-height: 1.5;
}

.palette-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  margin: 8px 0;
  padding: 10px;
  border: 1px solid #253b5d;
  border-radius: 10px;
  background: #152642;
  cursor: grab;
}

.palette-card:active {
  cursor: grabbing;
}

.palette-card strong,
.palette-card small {
  display: block;
}

.palette-card strong {
  font-size: 12px;
}

.palette-card small {
  margin-top: 4px;
  color: #7890b2;
  font-size: 10px;
}

.palette-icon {
  display: grid;
  place-items: center;
  flex: 0 0 28px;
  height: 28px;
  border-radius: 8px;
  font-weight: 700;
}

.palette-icon.switch {
  background: #3472d9;
}

.palette-icon.testcenter {
  background: #8e58c2;
}

.drag-grip {
  margin-left: auto;
  color: #627a9c;
  letter-spacing: -4px;
}

.port-dot,
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4f8cff;
  box-shadow: 0 0 0 3px #234371;
}

.port-card {
  min-height: 45px;
}

.port-card .port-dot {
  width: 8px;
  height: 8px;
  box-shadow: 0 0 0 2px #234371;
}

.legend {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 28px;
  color: #748bab;
  font-size: 10px;
}

.legend-dot {
  width: 6px;
  height: 6px;
  box-shadow: none;
  margin-left: 6px;
}

.legend-dot.available {
  background: #6a7b94;
}

.canvas-area {
  position: relative;
  min-width: 0;
  background-color: #0c1729;
  background-image: linear-gradient(#182942 1px, transparent 1px), linear-gradient(90deg, #182942 1px, transparent 1px);
  background-size: 24px 24px;
}

.canvas-toolbar {
  position: absolute;
  top: 18px;
  left: 24px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8298b8;
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e6aa54;
}

.toolbar-hint {
  margin-left: 18px;
  color: #536b8d;
}

.context-menu {
  position: fixed;
  z-index: 20;
  min-width: 120px;
  padding: 5px;
  border: 1px solid #315174;
  border-radius: 8px;
  background: #172b49;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .35);
}

.context-menu button {
  width: 100%;
  border: 0;
  border-radius: 5px;
  padding: 8px 10px;
  background: transparent;
  color: #f0f5ff;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.context-menu button:hover {
  background: #a94355;
}

.vue-flow {
  background: #0c1729;
}

.vue-flow__edge-path {
  stroke: #6f9ddd;
  stroke-width: 2;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #b277ff;
}

.vue-flow__node.selected>div {
  box-shadow: 0 0 0 2px #72a9ff, 0 8px 20px rgba(3, 12, 29, .32);
}

.file-input {
  display: none;
}

.inspector-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 22px;
  border-bottom: 1px solid #203552;
}

.inspector-header h2 {
  max-width: 195px;
  margin: 8px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  white-space: nowrap;
}

.inspector-actions {
  display: flex;
  gap: 6px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid #315174;
  border-radius: 8px;
  background: #172b49;
  color: #a9c9f5;
  font-size: 18px;
  cursor: pointer;
}

.form {
  display: grid;
  gap: 14px;
  padding-top: 22px;
}

.form label {
  display: grid;
  gap: 7px;
  color: #8197b7;
  font-size: 11px;
}

.form input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #294261;
  border-radius: 7px;
  outline: none;
  background: #0c192c;
  color: #e0ebfb;
  font: inherit;
}

.form input:focus {
  border-color: #548ce1;
}

.add-button,
.save-button,
.export-button {
  border: 0;
  border-radius: 7px;
  padding: 10px 12px;
  color: white;
  background: #3477dc;
  font-weight: 600;
  cursor: pointer;
}

.add-button {
  margin-top: 5px;
  background: #1b3558;
  color: #9fc5f8;
}

.button-row {
  display: flex;
  gap: 8px;
}

.ghost-button {
  border: 1px solid #2c4668;
  border-radius: 7px;
  padding: 9px 12px;
  background: transparent;
  color: #9eb4d2;
  cursor: pointer;
}

.save-button {
  flex: 1;
}

.empty-state {
  padding-top: 25px;
  color: #7187a7;
  line-height: 1.5;
}

.save-box {
  margin-top: auto;
  padding-top: 22px;
  border-top: 1px solid #203552;
}

.save-box strong {
  font-size: 12px;
}

.save-box p {
  margin: 7px 0 14px;
  color: #7187a7;
  font-size: 11px;
  line-height: 1.5;
}

.export-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.open-button,
.export-button {
  width: 100%;
  border: 1px solid #315174;
  border-radius: 7px;
  padding: 10px 9px;
  background: #172b49;
  color: #a9c9f5;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.export-button {
  border: 0;
  background: #3477dc;
  color: white;
}

.open-button span,
.export-button span {
  float: right;
  font-size: 16px;
}
</style>
