<template>
    <div class="container">
        <div class="bar">
            <canvas ref="charCanvas"></canvas>
        </div>
        <div class="pie">
            <canvas ref="charPie"></canvas>
        </div>
    </div>

</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted } from 'vue';

import * as Utils from '../use/utils.ts'


const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
const charCanvas = ref(null);
const charPie = ref(null);



const data = {
    labels: ['Python', 'Xml', 'Yaml', 'Docx', 'txt'],
    datasets: [
        {
            label: 'Dataset 1',
            data: Utils.numbers(NUMBER_CFG),
            backgroundColor: Object.values(Utils.CHART_COLORS),
            hoverOffset: 10,
        }
    ]
};

onMounted(() => {
    //const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (charCanvas.value) {
        new Chart(charCanvas.value, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: '# of Passes',
                    data: [133, 19, 3, 5, 2, 3, 11],
                    borderWidth: 1
                },
                {
                    label: '# of Failures',
                    data: [13, 59, 32, 1, 9, 30, 101],
                    borderWidth: 1
                }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    };
    if (charPie.value) {
        new Chart(charPie.value, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Element Composition'
                    }
                }
            },
        });
    }
})

</script>

<style>
.container {
    display: flex;
    align-items: stretch;
    gap: 16px;
    width: 100%;
    height: 100%;
    min-height: 360px;
}

.bar {
    position: relative;
    flex: 1;
    height: 100%;
    min-width: 0;
    width: 100%;
}

.pie {
    position: relative;
    flex: 1;
    height: 100%;
    min-width: 0;
    width: 100%;
}

@media (max-width: 700px) {
    .container {
        flex-direction: column;
    }
}
</style>