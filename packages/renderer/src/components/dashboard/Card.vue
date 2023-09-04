<script lang="ts" setup>
import { Settings24Regular as SettingIcon, Warning24Regular as WarningIcon } from '@vicons/fluent';
import { NButton, NIcon } from 'naive-ui';
import { useRouter } from 'vue-router';
import { ConnectionStatus, getStatusColorType, getStatusLabel } from '~shared/enums/ConnectionStatus';

const props = defineProps<{
  title: string
  target: string
  connectionStatus: ConnectionStatus
}>();

const router = useRouter();

const getStatusBackground = () => {
  return {
    [ConnectionStatus.ToConfigure]: 'bg-slate-300',
    [ConnectionStatus.Pending]: 'bg-blue-400',
    [ConnectionStatus.Established]: 'bg-green-500',
    [ConnectionStatus.Upgradable]: 'bg-yellow-500',
    [ConnectionStatus.Failed]: 'bg-red-500',
  }[props.connectionStatus];
};
</script>

<template>
  <div class="bg-slate-200 dark:bg-slate-700/50 rounded p-5">
    <div class="flex gap-3 mb-4">
      <n-icon size="24">
        <slot name="icon"></slot>
      </n-icon>

      <h2 class="text-base font-semibold whitespace-nowrap">{{ $props.title }}</h2>
    </div>

    <n-button
      class="!w-full"
      size="large"
      :type="getStatusColorType($props.connectionStatus)"
      strong
      secondary
      @click="router.push($props.target)">
      <span
        v-if="![ConnectionStatus.ToConfigure, ConnectionStatus.Upgradable].includes($props.connectionStatus)"
        class="inline-block w-2 h-2 bg-opacity-50 rounded-full mr-2 mt-0.5"
        :class="getStatusBackground()">
      </span>
      <n-icon
        v-if="$props.connectionStatus === ConnectionStatus.ToConfigure"
        size="medium"
        class="mr-1"
        :component="SettingIcon" />
      <n-icon
        v-if="$props.connectionStatus === ConnectionStatus.Upgradable"
        size="medium"
        class="mr-1"
        :component="WarningIcon" />
      {{ getStatusLabel($props.connectionStatus) }}
    </n-button>

    <slot />
  </div>
</template>
