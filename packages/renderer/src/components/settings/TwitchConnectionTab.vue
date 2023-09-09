<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NIcon, NAlert } from 'naive-ui';
import { store } from '/@/store';
import type { TwitchSettings } from '~shared/TwitchSettings';
import type { WorkerMessage } from '~shared/WorkerMessage';
import { ConnectionStatus, IntegrationConnectionStatus } from '~shared/enums/ConnectionStatus';
import { HTTP_SERVER_PORT } from '~shared/global';
import { twitchGetSettings, twitchDisconnect } from '#preload';

const settings = ref<TwitchSettings>();
const redirectUrl = `http://localhost:${HTTP_SERVER_PORT}/auth/twitch/redirect`;

onMounted(async () => {
  settings.value = await twitchGetSettings();
});

window.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  if (e.data.message === IntegrationConnectionStatus.TwitchConnectionEstablished) {
    settings.value = await twitchGetSettings();
  }
});
</script>

<template>
  <div class="flex h-full w-full items-center justify-between flex-col">
    <n-alert v-if="store.connectionStatus.twitch === ConnectionStatus.Upgradable" type="warning" title="Connection needs upgrade">
      <p class="mb-4">Streamflow now offers more powerful solutions for Twitch, but you need to re-authenticate to let them work correctly.</p>

      <n-button type="warning" tag="a" :href="redirectUrl" target="_blank">
        Fix it
      </n-button>
    </n-alert>

    <div v-if="!settings?.userId" class="my-auto text-center">
      <p class="text-xl text-slate-400 mb-10">No Twitch account linked yet.</p>

      <n-button type="primary" tag="a" :href="redirectUrl" target="_blank">
        Connect
      </n-button>
    </div>

    <template v-else>
      <!-- Fake element to place the welcome back at center -->
      <div v-if="store.connectionStatus.twitch !== ConnectionStatus.Upgradable"></div>
      <div class="flex items-center gap-3 mb-6">
        <img :src="settings.pictureUrl" alt="Profile picture" class="rounded-full w-14 h-14 object-cover" />
        <div>
          <p class="text-slate-400 dark:text-slate-300">Welcome back</p>
          <div class="text-lg flex font-semibold items-center gap-1 -mt-1">
            {{ settings.userName }}

            <n-icon v-if="settings.isPartner" size="18" color="#bf94ff" class="mt-1">
              <svg viewBox="0 0 16 16" aria-label="Verified Partner">
                <path fill-rule="evenodd" d="M12.5 3.5 8 2 3.5 3.5 2 8l1.5 4.5L8 14l4.5-1.5L14 8l-1.5-4.5ZM7 11l4.5-4.5L10 5 7 8 5.5 6.5 4 8l3 3Z" clip-rule="evenodd" />
              </svg>
            </n-icon>
          </div>
        </div>
      </div>

      <n-popconfirm trigger="hover" placement="bottom" @positive-click="twitchDisconnect(); settings = undefined">
        <template #activator>
          <n-button type="error" ghost teriary>
            Disconnect
          </n-button>
        </template>

        Are you sure? Some workflow may not work anymore.
      </n-popconfirm>
    </template>
  </div>
</template>
