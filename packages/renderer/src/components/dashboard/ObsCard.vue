<script lang="ts" setup>
import { ref } from 'vue';
import { store } from '/@/store';
import DashboardCard from './Card.vue';
import { type WorkerMessage } from '~shared/WorkerMessage';
import { ObsWebSocketSubject } from '~shared/ObsWebSocketSettings';

const isObsOpen = ref(true);

window.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  if (e.data.subject === ObsWebSocketSubject.AppStatus) {
    isObsOpen.value = !!Number(e.data.message!);
  }
});
</script>

<template>
  <dashboard-card title="OBS WebSocket" target="/settings/obs" :connection-status="store.connectionStatus.obsWebSocket">
    <template #icon>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 24C5.383 24 0 18.617 0 12S5.383 0 12 0s12 5.383 12 12s-5.383 12-12 12zm0-22.891C5.995 1.109 1.11 5.995 1.11 12S5.995 22.89 12 22.89S22.89 18.005 22.89 12c0-6.005-4.885-10.891-10.89-10.891zM6.182 5.99c.352-1.698 1.503-3.229 3.05-3.996c-.269.273-.595.483-.844.78c-1.02 1.1-1.48 2.692-1.199 4.156c.355 2.235 2.455 4.06 4.732 4.028c1.765.079 3.485-.937 4.348-2.468c1.848.063 3.645 1.017 4.7 2.548c.54.799.962 1.736.991 2.711c-.342-1.295-1.202-2.446-2.375-3.095a4.892 4.892 0 0 0-3.772-.425c-1.56.448-2.849 1.723-3.293 3.293c-.377 1.25-.216 2.628.377 3.772c-.825 1.429-2.315 2.449-3.932 2.756c-1.244.261-2.551.059-3.709-.464c1.036.302 2.161.355 3.191-.011a4.913 4.913 0 0 0 3.024-2.935c.556-1.49.345-3.261-.591-4.54c-.7-1.007-1.803-1.717-3.002-1.969c-.38-.068-.764-.098-1.148-.134c-.611-1.231-.834-2.66-.528-3.996l-.02-.011z" />
      </svg>
    </template>

    <div v-if="!isObsOpen" class="bg-red-700 px-2 py-0.5 text-[10px] tracking-widest uppercase rounded mt-4 text-center text-slate-300">
      OBS is closed
    </div>
  </dashboard-card>
</template>
