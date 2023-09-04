<script lang="ts" setup>
import { computed, ref } from 'vue';
import { NForm, NFormItem, NAutoComplete, type FormInst } from 'naive-ui';
import { uniq } from 'lodash-es';
import { useObs } from '/@/stores/obs';
import { type ActionOptions } from '~shared/actions/obs/unmute';

const props = defineProps<{ values?: ActionOptions }>();

const obs = useObs();

const formRef = ref<FormInst>();
const model = ref<ActionOptions>(props.values || {
  source: '',
});
const showAutocomplete = ref(false);

const options = computed(() => uniq([
  model.value.source,
  ...obs.sources,
].filter((item) => item)));

defineExpose({ formRef, model });
</script>

<template>
  <n-form ref="formRef" :model="model" @submit.prevent>
    <n-form-item
      label="Source"
      path="source"
      :rule="{
        required: true,
        trigger: ['blur', 'input'],
        message: 'Please choose a value',
      }">
      <n-auto-complete
        v-model:value="model.source"
        :options="options"
        placeholder="Type to search"
        :get-show="() => showAutocomplete"
        @click="showAutocomplete = true"
        @blur="showAutocomplete = false" />
    </n-form-item>
  </n-form>

  <p class="mb-4 text-sm">You can use an already defined variable as value, for example <code class="bg-slate-900 text-slate-50 text-xs py-1 px-2 rounded-md">{micSourceName}</code>.</p>
</template>

