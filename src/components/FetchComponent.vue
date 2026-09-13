<template>
    <div class="container">
        <h1>Vue + Flask Connection</h1>

        <!-- GET Section -->
        <button @click="fetchMessage">Get Backend Message</button>
        <p v-if="message">{{ message }}</p>

        <hr />

        <!-- POST Section -->
        <input v-model="username" placeholder="Enter username" />
        <button @click="sendUser">Send to Backend</button>
        <p v-if="postResponse">{{ postResponse }}</p>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const username = ref('')
const postResponse = ref('')

const BACKEND_URL = 'http://192.168.51.5:5000/api'

// NATIVE FETCH: GET Request
async function fetchMessage() {
    try {
        const response = await fetch(`${BACKEND_URL}/data`)
        if (!response.ok) throw new Error('Network response error')

        const data = await response.json()
        message.value = data.message
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

// NATIVE FETCH: POST Request
async function sendUser() {
    try {
        const response = await fetch(`${BACKEND_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tells Flask to expect JSON
            },
            body: JSON.stringify({ username: username.value }) // Must stringify the body
        })

        if (!response.ok) throw new Error('Network response error')

        const data = await response.json()
        postResponse.value = data.message
    } catch (error) {
        console.error('Error sending data:', error)
    }
}

</script>

<script lang="ts">
export default {
    compatConfig: { MODE: 3 },
}
</script>