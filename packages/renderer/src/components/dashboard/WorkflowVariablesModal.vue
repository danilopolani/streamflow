<script lang="ts" setup>
import { NButton, NModal, NInput } from 'naive-ui';

defineProps<{
  show: boolean
  variables?: object
}>();

defineEmits<{
  (e: 'close'): void
}>();
</script>

<template>
  <n-modal
    :show="$props.show"
    :show-icon="false"
    preset="dialog"
    title="Inspect"
    transform-origin="center"
    @update:show="(value) => !value ? $emit('close') : null">
    <div class="mb-6"></div>

    <n-input
      type="textarea"
      rows="10"
      class="font-mono !text-xs"
      :value="JSON.stringify($props.variables, null, 4)"
      readonly />

    <template #action>
      <n-button type="primary" @click="$emit('close')">Close</n-button>
    </template>
  </n-modal>
</template>
