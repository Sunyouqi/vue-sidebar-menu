<template>
    <Transition name="configure-dialog">
        <div v-if="dialog" class="configure-dialog-shell" role="dialog" aria-modal="true">
            <div class="configure-dialog-backdrop" @click="dialog = false" />
            <v-card class="configure-dialog-card" prepend-icon="mdi-tune-variant" title="Test Configuration">
                <v-card-text class="configure-dialog-fields">
                    <div v-if="node" class="text-body-medium-emphasis">
                        Configuring <strong>{{ node.name }}</strong>
                        <div class="text-caption">{{ node.path }}</div>
                    </div>
                    <v-row density="comfortable">
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="输入形式: .../env/*.enx" label="Network Topology(.enx)*" required />
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="输入形式: .../spirent/*.xml" label="Spirent TestCenter配置文件(.xml)*"
                                required />
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="输入形式: .../testcase/test_*.py" label="测试脚本路径*" required />
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="输入形式: .../report/*.docx" label="输出报告路径*" type="text" required />
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="输入形式: test_*" label="测试用例名称*" type="text" required />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-select :items="dataset" label="项目名称*" required />
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
const dataset = ['泰尔认证测试(CTTL_certification)', '抖音测试', '滴滴测试', '百度测试', '字节测试']
</script>