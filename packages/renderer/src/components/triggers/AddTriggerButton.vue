<script lang="ts" setup>
import { NDropdown, NButton, NIcon, NModal, NDivider } from 'naive-ui';
import { FlashOutline as TriggerIcon } from '@vicons/ionicons5';
import { ref,shallowRef,  watch, defineAsyncComponent, toRaw } from 'vue';
import { flow, camelCase, upperFirst } from 'lodash-es';
import { AllTriggers } from '../../triggers/registerTriggers';
import { renderIcon } from '/@/helpers';
import BaseDataForm from './BaseDataForm.vue';
import { type BaseData } from '~shared/triggers/baseData';

const emit = defineEmits<{
  (e: 'select', key: string, baseValues: BaseData, optionValues: object): void
}>();

const showActionOptionsModal = ref(false);
const triggerKey = ref<string>();
const formRef = ref();
const baseDataFormRef = ref();

const dropdownOptions = AllTriggers.map((trigger) => ({
  label: trigger.name,
  key: trigger.name.toLowerCase(),
  icon: renderIcon(trigger.icon),
  children: trigger.children.map((child) => ({
    label: child.name,
    key: child.key,
  })),
}));

const actionForm = shallowRef();

watch(triggerKey, () => {
  if (triggerKey.value) {
    actionForm.value = defineAsyncComponent(() =>
      // Convert FOO_BAR into FooBar
      import(`./options/${flow(camelCase, upperFirst)(triggerKey.value)}.vue`),
    );
  }
});

const handleSelect = (key: string) => {
  showActionOptionsModal.value = true;
  triggerKey.value = key;
};

const submit = async () => {
  try {
    await baseDataFormRef.value.formRef.validate();
    await formRef.value.formRef.validate();
  } catch (err) {
    return;
  }

  const baseValues = toRaw(baseDataFormRef.value.model);
  const optionValues = toRaw(formRef.value.model);

  emit('select', triggerKey.value!, baseValues, optionValues); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  showActionOptionsModal.value = false;
  triggerKey.value = undefined;
};
</script>

<template>
  <n-modal
    v-model:show="showActionOptionsModal"
    :show-icon="false"
    preset="dialog"
    title="Add trigger"
    transform-origin="center">
    <div class="mb-6"></div>

    <action-form ref="formRef" />

    <n-divider class="!mt-0 !mb-4">
      Extra
    </n-divider>

    <base-data-form ref="baseDataFormRef" />

    <template #action>
      <n-button type="primary" @click="submit">Add</n-button>
    </template>
  </n-modal>

  <div class="mt-3 mb-5 text-center">
    <n-dropdown
      :options="dropdownOptions"
      placement="bottom-start"
      trigger="click"
      @select="handleSelect">
      <n-button>
        <template #icon>
          <n-icon :component="TriggerIcon" />
        </template>
        Add trigger
      </n-button>
    </n-dropdown>
  </div>
</template>
