<script setup lang="ts">
const emit = defineEmits<{
  'run-plan': []
  'open-preset': []
  'update:selected-script': [value: string]
}>()

function runPlan(script: string) {
  emit('update:selected-script', `tests/${script}`)
  emit('run-plan')
}
</script>

<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>测试计划</h1>
        <p></p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="0" @click="emit('open-preset')"></v-btn>
    </div>

    <div class="plan-grid">
      <v-card
        v-for="plan in [{ name: 'BGP convergence - staging', script: 'bgp_convergence.py', schedule: 'Manual · 4 workers', target: 'lab-east-01', color: 'purple' }, { name: 'Interface health smoke', script: 'interface_health.py', schedule: 'Every weekday at 09:00', target: 'lab-west-02', color: 'green' }, { name: 'OSPF failover regression', script: 'ospf_failover.py', schedule: 'Manual · 2 workers', target: 'lab-east-01', color: 'orange' }]"
        :key="plan.name" class="panel plan-card" elevation="0">
        <div class="plan-icon" :class="plan.color"><v-icon icon="mdi-tune-variant" /></div>
        <h2>{{ plan.name }}</h2>
        <p>{{ plan.script }}</p>
        <div class="plan-meta"><span><v-icon icon="mdi-server-outline" size="14" />{{ plan.target
            }}</span><span><v-icon icon="mdi-calendar-clock" size="14" />{{ plan.schedule }}</span></div><v-btn block
          color="primary" variant="tonal" @click="runPlan(plan.script)">Run
          plan</v-btn>
      </v-card>
    </div>
  </section>
</template>
