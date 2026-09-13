<template>
  <div class="h-screen w-full flex flex-col">
    <!-- Navbar / Header -->

    <!-- VueFinder Workspace Container -->
    <main class="flex-1">
      <vue-finder class="viewfinder" id="my_vuefinder" :driver="driver" :features="'advanced'" max-height="100%"
        :config="{
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
          fullScreen: true,
        }" />
    </main>
  </div>


</template>

<script setup lang="ts">
import { RemoteDriver } from 'vuefinder';

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
  name: 'DocsExScripts',
}
</script>
<style scoped>
.viewfinder {
  position: fixed;
  top: 0;
  left: 180px;
  width: 80vw;
  height: 150vh;
  /* 100% of viewport width */
  /* 100% of viewport height */
  object-fit: cover;
  /* Ensures video/images cover the area without distorting */
  z-index: 9999;
  /* Keeps it on top of other elements */
}

.flex-1 {
  left: 180px;
  width: 60vw;
  height: 150vh;
}
</style>