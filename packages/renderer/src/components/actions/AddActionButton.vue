<script lang="ts" setup>
import { NDropdown, NButton, NIcon, NDivider, NModal } from 'naive-ui';
import {
  BotAdd24Regular as BotAddIcon,
  AddCircle24Regular as AddIcon,
} from '@vicons/fluent';
import { ref,shallowRef,  watch, defineAsyncComponent, toRaw } from 'vue';
import { flow, camelCase, upperFirst } from 'lodash-es';
import { AllActions } from '../../actions/registerActions';
import { renderIcon } from '/@/helpers';
import BaseDataForm from './BaseDataForm.vue';
import { type BaseData } from '~shared/actions/baseData';

const props = defineProps<{
  type: 'button' | 'divider',
  previousId: string|null
}>();

const emit = defineEmits<{
  (e: 'select', key: string, baseValues: BaseData, optionValues: object, previousId: string|null): void
}>();

const showActionOptionsModal = ref(false);
const actionKey = ref<string>();
const formRef = ref();
const baseDataFormRef = ref();

const dropdownOptions = AllActions.map((action) => ({
  label: action.name,
  key: action.name.toLowerCase(),
  icon: renderIcon(action.icon),
  children: action.children.map((child) => ({
    label: child.name,
    key: child.key,
  })),
}));

const actionForm = shallowRef();

watch(actionKey, () => {
  if (actionKey.value) {
    actionForm.value = defineAsyncComponent(() =>
      // Convert FOO_BAR into FooBar
      import(`./options/${flow(camelCase, upperFirst)(actionKey.value)}.vue`),
    );
  }
});

const handleSelect = (key: string) => {
  showActionOptionsModal.value = true;
  actionKey.value = key;
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

  emit('select', actionKey.value!, baseValues, optionValues, props.previousId); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  showActionOptionsModal.value = false;
  actionKey.value = undefined;
};
</script>

<template>
  <n-modal
    v-model:show="showActionOptionsModal"
    :show-icon="false"
    preset="dialog"
    title="Add action"
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

  <div v-if="$props.type === 'button'" class="mt-3 mb-5 text-center">
    <n-dropdown
      :options="dropdownOptions"
      placement="bottom-start"
      trigger="click"
      @select="handleSelect">
      <n-button>
        <template #icon>
          <n-icon :component="BotAddIcon" />
        </template>
        Add action
      </n-button>
    </n-dropdown>
  </div>

  <n-divider v-if="$props.type === 'divider'" class="!my-0">
    <n-dropdown
      :options="dropdownOptions"
      placement="bottom-start"
      trigger="click"
      @select="handleSelect">
      <n-icon :component="AddIcon" class="cursor-pointer text-green-300" />
    </n-dropdown>
  </n-divider>
</template>
