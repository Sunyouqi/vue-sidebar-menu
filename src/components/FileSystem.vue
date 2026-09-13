<template>
    <div class="h-screen w-full flex flex-col">
        <!-- Navbar / Header -->
        <header class="h-16 bg-gray-800 text-white">Header</header>

        <!-- VueFinder Workspace Container -->
        <main class="flex-1 min-h-0 min-w-0 overflow-auto p-4">
            <vue-finder class="viewfinder" id="my_vuefinder" :driver="driver" :locale="currentLocale"
                :features="'simple'" max-height="100%" :config="{
                    initialPath: 'local://public',
                    persist: true,
                    view: 'list',
                    theme: 'valorite',
                    maxFileSize: '10mb',
                    showTreeView: true,
                    showHiddenFiles: false,
                    metricUnits: true,
                    showThumbnails: true,
                    loadingIndicator: 'linear',
                    fullScreen: false,
                    gridIconSize: '1mb',
                    listIconSize: '1mb',
                    showFilePreview: true,
                }" />
        </main>
    </div>


</template>

<script setup lang="ts">
import { RemoteDriver } from 'vuefinder';

import VueFinder from 'vuefinder' // Example plugin import
import { ref } from 'vue';


const currentLocale = ref('en');

// Change language dynamically
/*const switchLanguage = (lang) => {
    currentLocale.value = lang; // Interface updates immediately
};*/
const driver = new RemoteDriver({
    baseURL: '/api',
    url: {
        list: '/files',
        upload: '/upload',
        delete: '/delete',
        rename: '/rename',
        archive: '/archive',
        unarchive: '/unarchive',
        createFile: '/create-file',
        createFolder: '/create-folder',
        search: '/search',
        preview: '/preview',
        copy: '/copy',
        move: '/move',
        save: '/save',
        download: '/download',
    },
});
</script>
<script lang="ts">
export default {
    compatConfig: { MODE: 3 },
}
</script>
<style scoped>
.viewfinder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    /* 100% of viewport width */
    height: 100vh;
    /* 100% of viewport height */
    object-fit: cover;
    /* Ensures video/images cover the area without distorting */
    z-index: 9999;
    /* Keeps it on top of other elements */
}
</style>