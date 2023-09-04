<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  type FormInst,
} from 'naive-ui';
import { ref } from 'vue';
import type { BaseData } from '~shared/triggers/baseData';

const props = defineProps<{ values?: BaseData }>();

const formRef = ref<FormInst>();
const model = ref<BaseData>(props.values || {
  title: null,
});

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item label="Trigger title" path="title">
      <n-input v-model:value="model.title" placeholder="Ex: greet message in chat" />
    </n-form-item>

    <p class="text-xs text-slate-400 -mt-4 mb-6">An optional title to better identify the trigger</p>
  </n-form>
</template>
