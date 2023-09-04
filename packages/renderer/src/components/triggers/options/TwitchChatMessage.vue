<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NSelect,
  NInput,
  NInputNumber,
  NCheckbox,
  NIcon,
  type FormInst,
  type SelectOption,
} from 'naive-ui';
import { Add as AddIcon } from '@vicons/ionicons5';
import { Delete24Regular as DeleteIcon } from '@vicons/fluent';
import { ref, watch } from 'vue';
import { capitalize } from 'lodash-es';
import { MessageExprOperator } from '~shared/triggers/twitch/chatMessage';
import { type TriggerOptions, MinimumUserRole } from '~shared/triggers/twitch/chatMessage';

const props = defineProps<{ values?: TriggerOptions }>();

const formRef = ref<FormInst>();
const model = ref<TriggerOptions>(props.values || {
  isCommand: false,
  messageConstraints: {
    exprOperator: MessageExprOperator.StartsWith,
    exprValue: null,
  },
  minimumUserRole: MinimumUserRole.Everyone,
  cooldown: 0,
  alias: [''],
});

const exprOperators: SelectOption[] = [
  {
    label: 'Starts with',
    value: MessageExprOperator.StartsWith,
  },
  {
    label: 'Ends with',
    value: MessageExprOperator.EndsWith,
  },
  {
    label: 'Contains',
    value: MessageExprOperator.Contains,
  },
  {
    label: 'Equals',
    value: MessageExprOperator.Equals,
  },
];

const roles: SelectOption[] = Object.values(MinimumUserRole).map((role) => ({
  label: capitalize(role.toLocaleLowerCase()),
  value: role,
}));

watch(() => model.value.isCommand, (value) => {
  model.value.alias = [''];

  if (value) {
    model.value.messageConstraints.exprOperator = MessageExprOperator.StartsWith;
  }
});

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-checkbox v-model:checked="model.isCommand">
      It's a command
    </n-checkbox>

    <div class="flex gap-2">
      <n-form-item v-if="!model.isCommand" path="messageConstraints.exprOperator" class="w-1/3">
        <n-select v-model:value="model.messageConstraints.exprOperator" :options="exprOperators" />
      </n-form-item>

      <n-form-item path="messageConstraints.exprValue" class="flex-1">
        <n-input v-model:value="model.messageConstraints.exprValue" :placeholder="model.isCommand ? 'Ex: !mycommand' : 'Ex: greet me'" />
      </n-form-item>
    </div>
    <p class="text-xs text-slate-400 -mt-4 mb-6">Leave it empty to catch all the messages</p>

    <div class="flex gap-2">
      <n-form-item
        label="Minimum user role"
        path="minimumUserRole"
        class="w-2/3"
        :rule="{
          required: true,
          trigger: ['blur', 'change'],
          message: 'Please select a value',
        }">
        <n-select v-model:value="model.minimumUserRole" :options="roles" />
      </n-form-item>

      <n-form-item label="Cooldown (in seconds)" path="cooldown" class="w-1/2">
        <n-input-number v-model:value="model.cooldown" placeholder="5" />
      </n-form-item>
    </div>
    <p class="text-xs text-slate-400 -mt-4 mb-6">It will pick the selected role and everything above</p>

    <!-- Alias -->
    <div v-if="model.isCommand" class="mb-6">
      <p class="mb-2">Command alias</p>

      <div class="flex items-center gap-2">
        <n-input v-model:value="model.alias[0]" placeholder="!alias" class="flex-1" />
        <n-icon :component="AddIcon" size="20" class="cursor-pointer" @click="model.alias.push('')" />
      </div>

      <!-- Additional alias -->
      <div v-for="(_, i) of model.alias.slice(1)" :key="i" class="flex items-center mt-2 gap-2">
        <n-input v-model:value="model.alias[i+1]" :placeholder="`!alias${i+2}`" class="flex-1" />
        <n-icon :component="DeleteIcon" size="20" class="cursor-pointer text-red-500" @click="model.alias.splice(i+1, 1)" />
        <n-icon :component="AddIcon" size="20" class="cursor-pointer" @click="model.alias.push('')" />
      </div>
    </div>
  </n-form>
</template>

