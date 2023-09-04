<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NTable,
  type FormInst,
} from 'naive-ui';
import { ref } from 'vue';
import { type ActionOptions } from '~shared/actions/twitch/reply';

const props = defineProps<{ values?: ActionOptions }>();

const formRef = ref<FormInst>();
const model = ref<ActionOptions>(props.values || {
  text: '',
});

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item
      label="Message"
      path="text"
      :rule="{
        required: true,
        trigger: ['blur', 'input'],
        message: 'Please write something',
      }">
      <div class="w-full">
        <n-input v-model:value="model.text" placeholder="Write something to reply" />
      </div>
    </n-form-item>
  </n-form>

  <p class="mb-4 text-sm">You can use any previous variable wrapped in curly brackets and they will be replaced. These are the variables you can use specifically from a <strong>Twitch Command / Chat message</strong> trigger:</p>

  <n-table class="mb-4" striped>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><kbd>{triggerUsername}</kbd></td>
        <td>The triggerer user name</td>
      </tr>
      <tr>
        <td><kbd>{arg1}</kbd></td>
        <td>The first argument after the command</td>
      </tr>
      <tr>
        <td><kbd>{arg2}</kbd></td>
        <td>The first argument after the command</td>
      </tr>
      <tr>
        <td><kbd>{arg3}</kbd></td>
        <td>The first argument after the command</td>
      </tr>
      <tr>
        <td><kbd>{args}</kbd></td>
        <td>Everything after the command name</td>
      </tr>
    </tbody>
  </n-table>
</template>

