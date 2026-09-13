<template>
  <section class="session-view">
    <div class="session-heading">
      <div>
        <div class="eyebrow">WORKSPACE SESSION</div>
        <h1>Team settings</h1>
        <p></p>
      </div>
    </div>

    <div class="resource-grid">
      <v-card
        v-for="resource in [{ title: 'Runner access', detail: '4 workspace members can execute plans', icon: 'mdi-account-group', status: 'Configured' }, { title: 'Notifications', detail: 'Email and in-app alerts enabled', icon: 'mdi-bell-outline', status: 'Enabled' }, { title: 'Repository connection', detail: 'GitHub · automation-tests · main', icon: 'mdi-github', status: 'Connected' }]"
        :key="resource.title" class="panel resource-card" elevation="0"><v-icon :icon="resource.icon" size="24"
          color="primary" />
        <div>
          <h2>{{ resource.title }}</h2>
          <p>{{ resource.detail }}</p>
        </div><v-chip size="small" color="success" variant="tonal">{{ resource.status }}</v-chip>
      </v-card>
    </div>
  </section>
</template>
