<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NForm, NFormItem, NInput, NButton, NPopconfirm, NAlert, NCollapse, NCollapseItem } from 'naive-ui';
import { store } from '/@/store';
import { obsConnect, obsDisconnect, obsGetSettings } from '#preload';
import { ObsWebSocketSettingsDefaults, type ObsWebSocketConnection, ObsWebSocketSubject } from '~shared/ObsWebSocketSettings';
import { type WorkerMessage } from '~shared/WorkerMessage';

const settings = ref<ObsWebSocketConnection>({
  host: ObsWebSocketSettingsDefaults.host,
  port: ObsWebSocketSettingsDefaults.port,
  password: ObsWebSocketSettingsDefaults.password,
});

// Used to check if the user saved settings before or if they're our defaults
const hasSettings = ref(false);
const errorFeedback = ref<string>();
const connectSuccessFeedback = ref(false);
const disconnectSuccessFeedback = ref(false);
const isObsOpen = ref(true);

window.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  if (e.data.subject === ObsWebSocketSubject.AppStatus) {
    isObsOpen.value = !!Number(e.data.message!);
  }
});

onMounted(async () => {
  const obsWebSocketSettings = await obsGetSettings();

  if (obsWebSocketSettings) {
    hasSettings.value = true;

    settings.value = {
      host: obsWebSocketSettings.host,
      port: obsWebSocketSettings.port,
      password: obsWebSocketSettings.password,
    };
  }
});

const connect = async () => {
  store.shouldNotifyOBSEstablishedConnection = true;
  connectSuccessFeedback.value = false;
  disconnectSuccessFeedback.value = false;

  const error = await obsConnect({ ...settings.value });

  if (!error) {
    hasSettings.value = true;
    connectSuccessFeedback.value = true;
    errorFeedback.value = undefined;
  } else {
    errorFeedback.value = error;
  }
};

const disconnect = async () => {
  obsDisconnect();

  // Reset form
  hasSettings.value = false;
  connectSuccessFeedback.value = false;
  disconnectSuccessFeedback.value = true;
  errorFeedback.value = undefined;

  settings.value = {
    host: ObsWebSocketSettingsDefaults.host,
    port: ObsWebSocketSettingsDefaults.port,
    password: ObsWebSocketSettingsDefaults.password,
  };
};
</script>

<template>
  <n-alert v-if="!isObsOpen" title="OBS Closed" type="error" class="mb-4" :bordered="false">
    It seems that OBS is not open. To connect for the first time be sure it's open before clicking <strong>Connect</strong>.
  </n-alert>

  <n-alert v-if="errorFeedback" title="Connection failed" type="error" class="mb-4" :bordered="false">
    Be sure that OBS is open and WebSockets are enabled (default from <em>OBS Studio 28+</em>).

    <n-collapse
      class="mt-4 bg-red-950/50 p-2 rounded-md"
      style="--n-title-font-weight: 600; --n-title-font-size: 0.75rem"
      arrow-placement="right">
      <n-collapse-item title="View error details">
        <p class="text-xs italic font-mono">{{ errorFeedback }}</p>
      </n-collapse-item>
    </n-collapse>
  </n-alert>

  <n-alert v-if="connectSuccessFeedback" title="Connection established" type="success" class="mb-4" :bordered="false">
    Connection to OBS established. Have a great time!
  </n-alert>

  <n-alert v-if="disconnectSuccessFeedback" type="info" class="mb-4" :bordered="false">
    OBS disconnected.
  </n-alert>

  <n-form @submit="connect">
    <n-form-item label="Host">
      <n-input v-model:value="settings.host" />
    </n-form-item>

    <n-form-item label="Port">
      <n-input v-model:value="settings.port" />
    </n-form-item>

    <n-form-item label="Password">
      <n-input
        v-model:value="settings.password"
        show-password-on="click"
        placeholder="Tools ➝ WebSocket ➝ Show connect info ➝ Server Password"
        type="password" />
    </n-form-item>

    <n-form-item>
      <div class="flex w-full">
        <n-button type="primary" @click="connect">
          Save & Connect
        </n-button>

        <n-popconfirm v-if="hasSettings" trigger="hover" @positive-click="disconnect">
          <template #activator>
            <n-button class="!ml-auto" type="error" ghost teriary>
              Disconnect
            </n-button>
          </template>

          This will reset the configuration values and disconnects OBS.
        </n-popconfirm>
      </div>
    </n-form-item>
  </n-form>
</template>
