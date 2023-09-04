<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NInputNumber, NFormItem, type FormInst } from 'naive-ui';
import { type ActionOptions } from '~shared/actions/wait';

const props = defineProps<{ values?: ActionOptions }>();

const formRef = ref<FormInst>();
const model = ref<ActionOptions>(props.values || {
  time: 3,
});

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item
      label="Seconds"
      path="time"
      :rule="{
        required: true,
        type: 'number',
        trigger: ['blur', 'input'],
        message: 'Choose a value',
      }">
      <div class="w-full">
        <n-input-number v-model:value="model.time" :min="0" />
      </div>
    </n-form-item>
  </n-form>
</template>

