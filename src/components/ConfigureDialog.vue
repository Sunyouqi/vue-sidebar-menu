<template>
    <Transition name="configure-dialog">
        <div v-if="dialog" class="configure-dialog-shell" role="dialog" aria-modal="true">
            <div class="configure-dialog-backdrop" @click="dialog = false" />
            <v-card class="configure-dialog-card" prepend-icon="mdi-tune-variant" title="Test Configuration">
            <v-card-text>
                <div v-if="node" class="text-body-medium-emphasis mb-4">
                    Configuring <strong>{{ node.name }}</strong>
                    <div class="text-caption">{{ node.path }}</div>
                </div>
                <v-row density="comfortable">
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="First name*" required />
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field hint="example of helper text only on focus" label="Middle name" />
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field hint="example of persistent helper text" label="Last name*" persistent-hint
                            required />
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Email*" required />
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Password*" type="password" required />
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Confirm Password*" type="password" required />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-autocomplete
                            :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                            label="Interests" auto-select-first multiple />
                    </v-col>
                </v-row>

                <small class="text-body-small text-medium-emphasis">*indicates required field</small>
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />

                <v-btn text="Close" variant="plain" @click="dialog = false" />

                <v-btn color="primary" text="Save" variant="tonal" @click="dialog = false" />
            </v-card-actions>
            </v-card>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AutomationNode } from '../features/file-manager/types'

const props = defineProps<{
    modelValue: boolean
    node?: AutomationNode | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
})
</script>