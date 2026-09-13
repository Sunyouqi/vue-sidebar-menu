<template>
    <!-- 1. CRITICAL: Your entire page/app must be wrapped in v-app for overlays to work -->
    <v-app>
        <v-main class="d-flex justify-center align-center" style="height: 100vh;">

            <!-- Background Content -->
            <div class="text-center">
                <h1>Main Page Content</h1>
                <p>This content will dim and fade to dark when the modal opens.</p>

                <!-- Trigger Button -->
                <v-btn color="primary" size="large" @click="dialog = true">
                    Open Modal
                </v-btn>
            </div>
            <!-- 
        2. The Dialog Component 
        - :scrim="true" ensures the dark backdrop is active (enabled by default).
        - persistent prevents closing if the user accidentally clicks the dark area.
      -->
            <v-dialog v-model="dialog" width="auto" :scrim="true" persistent>
                <v-card min-width="300" title="Focused Dialog">
                    <v-card-text>
                        The background is now completely dimmed out, keeping focus here.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text="Close" @click="dialog = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
const dialog = ref(false)
</script>
<style>
:deep(.v-overlay__scrim) {
    background: black !important;
    opacity: 0.8 !important;
    /* Adjust darkness from 0 to 1 */
}
</style>