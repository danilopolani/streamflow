<script lang="ts" setup>
import { NButton, NModal, NDivider } from 'naive-ui';
import { shallowRef, watch, defineAsyncComponent, toRaw } from 'vue';
import { flow, camelCase, upperFirst } from 'lodash-es';
import BaseDataForm from './BaseDataForm.vue';
import { type BaseData } from '~shared/actions/baseData';
import { type WorkflowAction } from '~shared/models/WorkflowAction';

const props = defineProps<{
  show: boolean
  action?: WorkflowAction
}>();

const emit = defineEmits<{
  (e: 'save', actionId: string, baseValues: BaseData, optionValues: object): void
  (e: 'close'): void
}>();

const formRef = shallowRef();
const baseDataFormRef = shallowRef();
const actionForm = shallowRef();

watch(() => props.action, () => {
  if (props.action) {
    actionForm.value = defineAsyncComponent(() =>
      // Convert FOO_BAR into FooBar
      import(`./options/${flow(camelCase, upperFirst)(props.action!.action)}.vue`),
    );
  }
});

const submit = async () => {
  try {
    await baseDataFormRef.value.formRef.validate();
    await formRef.value.formRef.validate();
  } catch (err) {
    return;
  }

  const baseValues = toRaw(baseDataFormRef.value.model);
  const optionValues = toRaw(formRef.value.model);

  emit('save', props.action!.id, baseValues, optionValues); // eslint-disable-line @typescript-eslint/no-non-null-assertion
};
</script>

<template>
  <n-modal
    :show="$props.show"
    :show-icon="false"
    preset="dialog"
    title="Edit action"
    transform-origin="center"
    @update:show="(value) => !value ? $emit('close') : null">
    <div class="mb-6"></div>

    <action-form v-if="$props.action" ref="formRef" :values="$props.action.options" />

    <n-divider class="!mt-0 !mb-4">
      Extra
    </n-divider>

    <base-data-form v-if="$props.action" ref="baseDataFormRef" :values="{ title: $props.action.title }" />

    <template #action>
      <n-button type="primary" @click="submit">Save</n-button>
    </template>
  </n-modal>
</template>
