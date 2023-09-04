<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NSelect,
  NInput,
  NPopover,
  type SelectOption,
  type FormInst,
} from 'naive-ui';
import { ref } from 'vue';
import { Key } from '../../../enums/nut-key';
import { Type, type ActionOptions } from '~shared/actions/keyboard';

const props = defineProps<{ values?: ActionOptions }>();

const formRef = ref<FormInst>();
const model = ref<ActionOptions>(props.values || {
  type: Type.Text,
  text: '',
  shortcut: [],
});

const keysOptions: SelectOption[] = (Object.keys(Key) as (keyof typeof Key)[]).map((key) => ({
  label: key,
  value: Key[key],
}));

const typeOptions: SelectOption[] = [
  {
    label: 'Text',
    value: Type.Text,
  },
  {
    label: 'Shortcut',
    value: Type.Shortcut,
  },
];

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item
      label="Type"
      path="type"
      :rule="{
        required: true,
        trigger: ['blur', 'change'],
        message: 'Please select a value',
      }">
      <div class="w-full">
        <n-select v-model:value="model.type" placeholder="Type" :options="typeOptions" />

        <n-popover trigger="click">
          <template #trigger>
            <span class="text-xs underline text-slate-400 cursor-pointer mt-1">What's the difference?</span>
          </template>

          <ul>
            <li><strong class="text-primary">Text</strong> is a free text, such as a phrase</li>
            <li><strong class="text-primary">Shortcut</strong> is a combination of keys, such as Alt+F4</li>
          </ul>
        </n-popover>
      </div>
    </n-form-item>

    <n-form-item
      v-if="model.type === Type.Text"
      label="Text"
      path="text"
      :rule="{
        required: true,
        trigger: ['blur', 'input'],
        message: 'Please choose something to type',
      }">
      <n-input v-model:value="model.text" placeholder="Text here" />
    </n-form-item>

    <n-form-item
      v-else
      label="Shortcut"
      path="shortcut"
      :rule="{
        required: true,
        type: 'array',
        trigger: ['blur', 'change'],
        message: 'Please choose at least a key',
      }">
      <n-select
        v-model:value="model.shortcut"
        multiple
        filterable
        placeholder="Select the keys"
        :options="keysOptions" />
    </n-form-item>
  </n-form>
</template>

