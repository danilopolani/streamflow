<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NSelect, NPopover, type FormInst } from 'naive-ui';
import { type ActionOptions, Type } from '~shared/actions/system/setVariable';

const props = defineProps<{ values?: ActionOptions }>();

const formRef = ref<FormInst>();
const model = ref<ActionOptions>(props.values || {
  variableName: '',
  type: Type.Value,
  value: undefined,
  code: undefined,
});

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <div class="flex gap-2">
      <n-form-item
        label="Variable name"
        path="variableName"
        class="w-2/3"
        :rule="{
          required: true,
          trigger: ['blur', 'input'],
        }">
        <div class="w-full">
          <n-input
            v-model:value="model.variableName"
            :allow-input="(value: string) => !value || /^[a-z0-9]+$/i.test(value)"
            placeholder="Ex: myVariable" />
        </div>
      </n-form-item>

      <n-form-item
        label="Type"
        path="type"
        class="flex-1"
        :show-require-mark="false"
        :rule="{
          required: true,
          trigger: ['blur', 'change'],
          message: 'Please select a value',
        }">
        <n-select v-model:value="model.type" :options="[{ label: 'Value', value: Type.Value }, { label: 'Lambda', value: Type.Lambda }]" />
      </n-form-item>
    </div>

    <div class="flex w-full justify-end -mt-4 mb-4">
      <n-popover trigger="click" :arrow-point-to-center="false">
        <template #trigger>
          <span class="text-xs underline text-slate-400 cursor-pointer">What's the difference?</span>
        </template>

        <ul>
          <li><strong class="text-primary">Value</strong> accepts a string for basic data</li>
          <li><strong class="text-primary">Lambda</strong> accepts a JS code to evaluate for complex scenarios</li>
        </ul>
      </n-popover>
    </div>

    <div v-if="model.type === Type.Lambda">
      <n-form-item
        label="Code (JS)"
        path="code"
        :rule="{
          required: model.type === Type.Lambda,
          trigger: ['blur', 'input'],
        }">
        <div class="w-full">
          <n-input
            v-model:value="model.code"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
            placeholder="Will be available to subsequent actions" />
        </div>
      </n-form-item>

      <p class="mb-4 text-sm">
        The code <strong>must NOT</strong> return anything, but just execute the returning code.<br>
        For example, to generate a random d6 you will write <code class="bg-slate-900 text-slate-50 text-xs py-1 px-2 rounded-md">Math.floor(Math.random() * 6) + 1</code>
      </p>
    </div>

    <n-form-item
      v-if="model.type === Type.Value"
      label="Value"
      path="value"
      :rule="{
        required: model.type === Type.Value,
        trigger: ['blur', 'input'],
      }">
      <div class="w-full">
        <n-input v-model:value="model.value" placeholder="Will be available to subsequent actions" />
      </div>
    </n-form-item>
  </n-form>
</template>

