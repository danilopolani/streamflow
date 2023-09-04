<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import {
  Home24Regular as HomeIcon,
  Settings24Regular as SettingsIcon,
  BranchCompare24Regular as WorkflowsIcon,
} from '@vicons/fluent';

const links = [
  {
    label: 'Home',
    path: '/',
    icon: HomeIcon,
  },
  {
    label: 'Workflows',
    path: '/workflows',
    icon: WorkflowsIcon,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
];
</script>

<template>
  <ul class="mx-3 space-y-4">
    <li v-for="link in links" :key="link.path" class="group">
      <router-link
        :to="link.path"
        active-class="group sidebar-link-active"
        class="block">
        <div class="group-hover:bg-primary group-[.sidebar-link-active]:bg-primary rounded-md w-10 h-10 flex items-center justify-center mx-auto">
          <n-icon :component="link.icon" size="20" />
        </div>

        <p class="text-xs text-center mt-1 opacity-80">{{ link.label }}</p>
      </router-link>
    </li>
  </ul>
</template>
