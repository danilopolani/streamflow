<script lang="ts" setup>
import { useNotification, NButton, NModal } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { type Router, useRouter } from 'vue-router';
import { type WorkerMessage } from '../../shared/WorkerMessage';
import {
  ConnectionStatus,
  IntegrationConnectionStatus,
  getStatusColorType,
  getStatusLabel,
} from '../../shared/enums/ConnectionStatus';
import obsConnectionFailedNotification from './notifications/obs-connection-failed';
import obsConnectionClosedNotification from './notifications/obs-connection-closed';
import twitchConnectionFailedNotification from './notifications/twitch-connection-failed';
import { store } from './store';
import { useObs } from './stores/obs';
import { useTwitch } from './stores/twitch';
import ContextMenu from '/@/components/ContextMenu.vue';
import { ObsWebSocketSubject } from '~shared/ObsWebSocketSettings';
import { TwitchSubject } from '~shared/TwitchSettings';
import { FIRST_TIME_APP_SUBJECT } from '~shared/global';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
let router: Router;
const showFirstTimeModal = ref(false);

onMounted(() => {
  const notification = useNotification();
  router = useRouter();
  const obs = useObs();
  const twitch = useTwitch();

  window.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
    switch (e.data.subject) {
      case ObsWebSocketSubject.Sources: {
        obs.loadSources(JSON.parse(e.data.message!));

        break;
      }
      case TwitchSubject.Rewards: {
        twitch.$patch({
          rewards: JSON.parse(e.data.message!),
        });

        break;
      }
      case FIRST_TIME_APP_SUBJECT: {
        showFirstTimeModal.value = true;

        break;
      }
    }

    switch (e.data.message) {
      case IntegrationConnectionStatus.ObsConnectionToConfigure:
        store.connectionStatus.obsWebSocket = ConnectionStatus.ToConfigure;
        break;

      case IntegrationConnectionStatus.ObsConnectionFailed:
        store.connectionStatus.obsWebSocket = ConnectionStatus.Failed;

        if (e.data.shouldNotify) {
          obsConnectionFailedNotification(notification, router, e.data.details);
        }
        break;

      case IntegrationConnectionStatus.ObsConnectionEstablished:
        store.connectionStatus.obsWebSocket = ConnectionStatus.Established;
        break;

      case IntegrationConnectionStatus.ObsConnectionClosed:
        store.connectionStatus.obsWebSocket = ConnectionStatus.Pending;

        obsConnectionClosedNotification(notification, e.data.details);
        break;

      case IntegrationConnectionStatus.TwitchConnectionToConfigure:
        store.connectionStatus.twitch = ConnectionStatus.ToConfigure;
        break;

      case IntegrationConnectionStatus.TwitchConnectionFailed:
        store.connectionStatus.twitch = ConnectionStatus.Failed;

        if (e.data.shouldNotify) {
          twitchConnectionFailedNotification(notification, router, e.data.details);
        }
        break;

      case IntegrationConnectionStatus.TwitchConnectionEstablished: {
        store.connectionStatus.twitch = ConnectionStatus.Established;

        twitch.$patch({
          username: JSON.parse(e.data.details!).username,
        });

        break;
      }

      case IntegrationConnectionStatus.TwitchConnectionEstablishedUpgradable: {
        store.connectionStatus.twitch = ConnectionStatus.Upgradable;

        twitch.$patch({
          username: JSON.parse(e.data.details!).username,
        });

        break;
      }
    }
  });
});
</script>

<template>
  <context-menu />

  <n-modal
    :show="showFirstTimeModal"
    :show-icon="false"
    preset="dialog"
    title="First time?"
    transform-origin="center">
    <div class="mb-6"></div>

    <div class="!text-base">
      <p class="mb-4">Welcome to <strong class="text-primary">Streamflow</strong>, the open-source toolkit for streamers!</p>
      <p class="mb-2">Just a few things before getting started; you can change these behaviours in the app <strong>Settings</strong>.</p>
      <ol class="list-disc pl-8">
        <li>When you <strong>close the app</strong>, it will run in the background. You can force-close it in the tray icons</li>
        <li>By default the app will <strong>open with your computer start up</strong> in the tray icon, so you don't open it manually!</li>
      </ol>
    </div>

    <template #action>
      <n-button type="primary" @click="showFirstTimeModal = false">Got it</n-button>
    </template>
  </n-modal>

  <main id="router-content">
    <router-view></router-view>
  </main>

  <footer class="px-2 text-right text-xs bg-slate-300 border-t text-slate-500 dark:bg-slate-900 dark:text-slate-400 dark:border-t-slate-700">
    <div class="flex w-full">
      <n-button
        class="min-h-full !h-auto !rounded-none !mr-1"
        :class="{'!bg-slate-600': store.connectionStatus.obsWebSocket === ConnectionStatus.ToConfigure}"
        size="tiny"
        :type="getStatusColorType(store.connectionStatus.obsWebSocket)"
        strong
        secondary
        @click="router.push('/settings/obs')">
        OBS <span class="lowercase ml-1">{{ getStatusLabel(store.connectionStatus.obsWebSocket) }}</span>
      </n-button>

      <n-button
        class="min-h-full !h-auto !rounded-none"
        :class="{'!bg-slate-600': store.connectionStatus.twitch === ConnectionStatus.ToConfigure}"
        size="tiny"
        :type="getStatusColorType(store.connectionStatus.twitch)"
        strong
        secondary
        @click="router.push('/settings/twitch')">
        Twitch <span class="lowercase ml-1">{{ getStatusLabel(store.connectionStatus.twitch) }}</span>
      </n-button>

      <p class="ml-auto py-1">Streamflow {{ APP_VERSION }}</p>
    </div>
  </footer>
</template>

<style lang="postcss">
html,
body {
  @apply bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50 overflow-hidden;
}

html,
body,
#app,
#app > .n-config-provider {
  @apply h-screen max-h-screen;
}

#app > .n-config-provider {
  @apply flex flex-col;
}

#app > .n-config-provider > #router-content {
  @apply flex-1 overflow-auto;
}

.n-dialog.n-modal {
  min-width: 600px;
}
</style>
