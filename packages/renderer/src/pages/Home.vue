<script lang="ts" setup>
import { store } from '../store';
import DefaultLayout from '/@/layouts/DefaultLayout.vue';
import DashboardCard from '/@/components/dashboard/Card.vue';
import DashboardObsCard from '/@/components/dashboard/ObsCard.vue';
import WorkflowHistory from '/@/components/dashboard/WorkflowHistory.vue';
</script>

<template>
  <default-layout>
    <main class="p-4">
      <section class="grid grid-cols-3 gap-4">
        <dashboard-obs-card />

        <dashboard-card title="Twitch" target="/settings/twitch" :connection-status="store.connectionStatus.twitch">
          <template #icon>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
          </template>
        </dashboard-card>
      </section>

      <section class="mt-4 grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <workflow-history />
        </div>
      </section>
    </main>
  </default-layout>
</template>
