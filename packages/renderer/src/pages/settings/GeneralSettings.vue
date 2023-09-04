<script lang="ts" setup>
import { ref, watch, onMounted, toRaw } from 'vue';
import { NForm, NCheckbox, NAlert } from 'naive-ui';
import SettingsLayout from '/@/layouts/SettingsLayout.vue';
import { type GeneralSettings } from '~shared/settings/GeneralSettings';
import { generalGetSettings, generalUpdateSettings } from '#preload';

const showUpdatedSettingsAlert = ref(false);
const fetched = ref(false);

const model = ref<GeneralSettings>({
  startInTray: true,
  openOnStartup: true,
});

onMounted(async () => {
  const settings = await generalGetSettings();

  if (settings) {
    model.value = settings;
  }
});

watch(() => model.value, async () => {
  if (!fetched.value) {
    fetched.value = true;
    return;
  }

  await generalUpdateSettings(toRaw(model.value));

  showUpdatedSettingsAlert.value = true;

  setTimeout(() => showUpdatedSettingsAlert.value = false, 1500);
}, { deep: true });
</script>

<template>
  <settings-layout>
    <n-alert v-show="showUpdatedSettingsAlert" type="success" class="mb-4 transition-all duration-100" :bordered="false">
      Settings saved!
    </n-alert>

    <h2 class="font-semibold text-xl mb-6">Startup</h2>
    <n-form v-if="fetched" ref="formRef" :model="model" @submit.prevent>
      <div class="space-y-3">
        <div>
          <n-checkbox v-model:checked="model.startInTray" label="Start app hidden in tray" />
        </div>
        <div>
          <n-checkbox v-model:checked="model.openOnStartup" label="Open on computer startup" />
        </div>
      </div>
    </n-form>
  </settings-layout>
</template>
