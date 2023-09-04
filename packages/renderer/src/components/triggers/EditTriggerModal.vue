<script lang="ts" setup>
import { NButton, NModal, NDivider } from 'naive-ui';
import { shallowRef, watch, defineAsyncComponent, toRaw } from 'vue';
import { flow, camelCase, upperFirst } from 'lodash-es';
import BaseDataForm from './BaseDataForm.vue';
import { type BaseData } from '~shared/triggers/baseData';
import { type WorkflowTrigger } from '~shared/models/WorkflowTrigger';

const props = defineProps<{
  show: boolean
  trigger?: WorkflowTrigger
}>();

const emit = defineEmits<{
  (e: 'save', triggerId: string, baseValues: BaseData, optionValues: object): void
  (e: 'close'): void
}>();

const formRef = shallowRef();
const baseDataFormRef = shallowRef();
const actionForm = shallowRef();

watch(() => props.trigger, () => {
  if (props.trigger) {
    actionForm.value = defineAsyncComponent(() =>
      // Convert FOO_BAR into FooBar
      import(`./options/${flow(camelCase, upperFirst)(props.trigger!.trigger)}.vue`),
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

  emit('save', props.trigger!.id, baseValues, optionValues); // eslint-disable-line @typescript-eslint/no-non-null-assertion
};
</script>

<template>
  <n-modal
    :show="$props.show"
    :show-icon="false"
    preset="dialog"
    title="Edit trigger"
    transform-origin="center"
    @update:show="(value) => !value ? $emit('close') : null">
    <div class="mb-6"></div>

    <action-form v-if="$props.trigger" ref="formRef" :values="$props.trigger.options" />

    <n-divider class="!mt-0 !mb-4">
      Extra
    </n-divider>

    <base-data-form v-if="$props.trigger" ref="baseDataFormRef" :values="{ title: $props.trigger.title }" />

    <template #action>
      <n-button type="primary" @click="submit">Save</n-button>
    </template>
  </n-modal>
</template>
