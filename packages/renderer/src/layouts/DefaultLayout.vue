<script lang="ts" setup>
import NavigationSidebar from '/@/components/NavigationSidebar.vue';
</script>

<template>
  <div class="flex h-full max-h-full">
    <div class="flex-none h-full max-h-full pt-4">
      <a href="https://www.streamflow.app" target="_blank">
        <img src="../../assets/logo.svg" class="w-8 mx-auto mb-20" />
      </a>

      <navigation-sidebar />
    </div>
    <div class="flex-1 h-[calc(100% - 0.25rem)] my-1 mr-1 rounded bg-slate-100 dark:bg-slate-800">
      <slot />
    </div>
  </div>
</template>
