<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue';

const links = [
  {
    label: 'General',
    path: '/settings/general',
  },{
    label: 'OBS',
    path: '/settings/obs',
  },
  {
    label: 'Twitch',
    path: '/settings/twitch',
  },
];
</script>

<template>
  <default-layout title="Settings">
    <div class="flex w-full h-full mx-auto">
      <aside class="w-1/4 bg-slate-300 dark:bg-slate-900 p-3 rounded-l-md">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          active-class="bg-primary hover:!bg-accent"
          class="py-2 px-4 rounded-md block hover:bg-accent/30 mb-1">
          {{ link.label }}
        </router-link>
      </aside>
      <main class="flex-1 py-5 px-10">
        <slot />
      </main>
    </div>
  </default-layout>
</template>
