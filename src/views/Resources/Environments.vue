<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>环境配置</h1>
        <p></p>
      </div>
    </div>

    <!-- <div class="resource-grid">
      <v-card
        v-for="resource in [{ title: 'Staging lab', detail: 'lab-east-01 · 18 devices', icon: 'mdi-server-network', status: 'Connected' }, { title: 'West regression lab', detail: 'lab-west-02 · 12 devices', icon: 'mdi-server-network', status: 'Connected' }, { title: 'Production guardrail', detail: 'Read-only · 42 devices', icon: 'mdi-shield-check', status: 'Protected' }]"
        :key="resource.title" class="panel resource-card" elevation="0"><v-icon :icon="resource.icon" size="24"
          color="primary" />
        <div>
          <h2>{{ resource.title }}</h2>
          <p>{{ resource.detail }}</p>
        </div><v-chip size="small" color="success" variant="tonal">{{ resource.status }}</v-chip>
      </v-card>
    </div> -->
    <Topology></Topology>
  </section>
</template>

<script setup lang="ts">
import Topology from '../../features/Topology/components/topology.vue'

</script>
