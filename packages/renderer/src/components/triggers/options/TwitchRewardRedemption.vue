<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import { NForm, NFormItem, NAutoComplete, type FormInst, NIcon } from 'naive-ui';
import type { VNodeChild } from 'vue';
import { computed, h, ref } from 'vue';
import { useTwitch } from '/@/stores/twitch';
import { type TriggerOptions } from '~shared/triggers/twitch/rewardRedemption';

const props = defineProps<{ values?: TriggerOptions }>();

const twitch = useTwitch();

const formRef = ref<FormInst>();
const model = ref<TriggerOptions>(props.values || {
  rewardName: '',
});
const showAutocomplete = ref(false);

const options = computed(() => twitch.rewards.map((item) => ({
    label: item.title,
    value: item.title,
  })),
);

const renderLabel = (option: SelectOption): VNodeChild => h('div', { class: 'flex items-center gap-2' }, [
  h('div', {
    class: 'w-6 h-6 flex items-center justify-center rounded-lg',
    style: 'background: ' + twitch.rewards.find((item) => item.title === option.label)?.backgroundColor,
  }, [
    h('img', {
      src: twitch.rewards.find((item) => item.title === option.label)?.imageUrl,
      class: 'w-4 h-4 object-cover',
    }),
  ]),
  h('div', { class: 'py-1' }, [
    option.label as string,
    h('div', { class: 'flex items-center gap-1 -mt-1' }, [
      h(NIcon, { size: '10', class: 'text-slate-400 mt-0.5' }, {
        default: () => h('svg', { viewBox: '0 0 20 20' }, [
          h('path', {
            d: 'M10 6a4 4 0 0 1 4 4h-2a2 2 0 0 0-2-2V6z',
          }),
          h('path', {
            'fill-rule': 'evenodd',
            'clip-rule': 'evenodd',
            d: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0z',
          }),
        ]),
      }),
      h('p', { class: 'text-slate-400 !text-[11px]' }, twitch.rewards.find((item) => item.title === option.label)?.cost),
    ]),
  ]),
]);

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item label="Reward name" path="rewardName">
      <n-auto-complete
        v-model:value="model.rewardName"
        :options="options"
        placeholder="Type to search"
        :get-show="() => showAutocomplete"
        :render-label="renderLabel"
        @click="showAutocomplete = true"
        @blur="showAutocomplete = false" />
    </n-form-item>
  </n-form>
</template>
