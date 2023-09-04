<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AnimalCat24Regular as EmptyIcon } from '@vicons/fluent';
import { orderBy } from 'lodash-es';
import { NScrollbar, NEmpty, NModal, NForm, NFormItem, NInput, NCheckbox, NButton, NIcon, type FormInst, useMessage } from 'naive-ui';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import DefaultLayout from '/@/layouts/DefaultLayout.vue';
import WorkflowListItem from '/@/components/workflows/WorkflowListItem.vue';
import WorkflowTriggersList from '/@/components/triggers/TriggersList.vue';
import WorkflowActionsList from '/@/components/actions/ActionsList.vue';
import { workflowList, workflowCreate, workflowActionList, workflowActionCreate, workflowTriggerList, workflowTriggerCreate, workflowTriggerUpdate, workflowActionUpdate, workflowActionDelete } from '#preload';
import { type Workflow as SharedWorkflow } from '~shared/models/Workflow';
import { type WorkflowAction as SharedWorkflowAction } from '~shared/models/WorkflowAction';
import { type WorkflowTrigger as SharedWorkflowTrigger } from '~shared/models/WorkflowTrigger';
import { type BaseData as TriggerBaseData } from '~shared/triggers/baseData';
import { type BaseData as ActionBaseData } from '~shared/actions/baseData';

const workflows = ref<SharedWorkflow[]>([]);
const activeItem = ref<SharedWorkflow>();
const activeItemTriggers = ref<SharedWorkflowTrigger[]>([]);
const activeItemActions = ref<SharedWorkflowAction[]>([]);

const showCreateFormModal = ref(false);
const createFormRef = ref<FormInst>();
const createFormModel = ref({
  name: '',
  shouldRunImmediately: false,
});

const formValidationRules = {
  name: {
    required: true,
    message: 'Field required',
    trigger: ['input', 'blur'],
  },
};

const toast = useMessage();

onMounted(async () => {
  workflows.value = await workflowList();

  // Automatically select the first workflow
  if (workflows.value.length === 1) {
    selectWorkflow(workflows.value[0]);
  }
});

const createWorkflow = async () => {
  try {
    await createFormRef.value?.validate();
  } catch (e) {
    return;
  }

  const workflow = await workflowCreate({
    ...createFormModel.value,
    isDisabled: false,
  });

  // Empty the form
  createFormModel.value = {
    name: '',
    shouldRunImmediately: false,
  };

  workflows.value.unshift(workflow);

  // Auto select newborn
  activeItem.value = workflow;
  activeItemActions.value = [];
  activeItemTriggers.value = [];

  // Close modal
  showCreateFormModal.value = false;
};

const selectWorkflow = async (workflow: SharedWorkflow) => {
  activeItem.value = workflow;
  activeItemActions.value = await workflowActionList(workflow.id);
  activeItemTriggers.value = await workflowTriggerList(workflow.id);
};

const handleWorkflowDeleted = (id: string) => {
  workflows.value.splice(
    workflows.value.findIndex((item) => item.id === id),
    1,
  );

  activeItem.value = undefined;
  activeItemActions.value = [];
  activeItemTriggers.value = [];
};

const onActionAdded = async (key: string, baseValues: ActionBaseData, optionValues: object, previousId: string|null) => {
  activeItemActions.value = await workflowActionCreate({
    workflowId: activeItem.value!.id,
    orderPreviousId: previousId,
    isDisabled: false,
    title: baseValues.title,
    action: key,
    options: optionValues,
  });
};

const onActionUpdated = async (id: string, baseValues: ActionBaseData, optionValues: object) => {
  try {
    await workflowActionUpdate(id, baseValues, optionValues);
  } catch (err) {
    toast.error('Error while deleting the action: ' + (err as Error).message);

    return;
  }

  toast.success('Action updated');

  const actionIndex = activeItemActions.value.findIndex((item) => item.id === id);

  activeItemActions.value[actionIndex] = {
    ...activeItemActions.value[actionIndex],
    ...baseValues,
    options: optionValues,
  };
};

const onActionDeleted = async (id: string) => {
  workflowActionDelete(id)
    .then((result) => {
      activeItemActions.value = result;
      toast.success('Action deleted successfully');
    })
    .catch((err) => {
      toast.error('Error while deleting action: ' + err, {
        duration: 5000,
      });
    });
};

const onTriggerAdded = async (key: string, baseValues: TriggerBaseData, optionValues: object) => {
  activeItemTriggers.value.push(await workflowTriggerCreate({
    workflowId: activeItem.value!.id, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    isDisabled: false,
    title: baseValues.title,
    order: (orderBy(activeItemTriggers.value, 'order', 'desc')[0]?.order || 0) + 1,
    trigger: key,
    options: optionValues,
  }));
};

const onTriggerUpdated = async (id: string, baseValues: TriggerBaseData, optionValues: object) => {
  try {
    await workflowTriggerUpdate(id, baseValues, optionValues);
  } catch (err) {
    toast.error('Error while deleting the trigger: ' + (err as Error).message);

    return;
  }

  toast.success('Trigger updated');

  const triggerIndex = activeItemTriggers.value.findIndex((item) => item.id === id);

  activeItemTriggers.value[triggerIndex] = {
    ...activeItemTriggers.value[triggerIndex],
    ...baseValues,
    options: optionValues,
  };
};

const onTriggerDeleted = (id: string) => {
  activeItemTriggers.value.splice(
    activeItemTriggers.value.findIndex((item) => item.id === id),
    1,
  );
};
</script>

<template>
  <n-modal
    v-model:show="showCreateFormModal"
    :show-icon="false"
    transform-origin="center"
    preset="dialog"
    title="Create a workflow">
    <n-form ref="createFormRef" :model="createFormModel" :rules="formValidationRules">
      <n-form-item path="name" label="Name">
        <n-input v-model:value="createFormModel.name" />
      </n-form-item>

      <n-form-item path="shouldRunImmediately" class="-mt-6">
        <n-checkbox v-model:checked="createFormModel.shouldRunImmediately">
          Should run immediately?
        </n-checkbox>
      </n-form-item>
      <p class="-mt-6 text-xs text-slate-400 mb-10">If checked, the workflow queue will be skipped and it runs immediately</p>
    </n-form>

    <template #action>
      <n-button type="primary" @click="createWorkflow">Create</n-button>
    </template>
  </n-modal>

  <default-layout>
    <splitpanes class="default-theme max-h-full h-full overflow-hidden">
      <!-- Workflows -->
      <pane min-size="30">
        <div v-if="workflows.length === 0" class="flex h-full w-full justify-center place-items-center">
          <n-empty description="No workflow yet" size="large">
            <template #extra>
              <n-button type="primary" secondary @click="showCreateFormModal = true">
                Create one
              </n-button>
            </template>
          </n-empty>
        </div>

        <div v-else>
          <h2 class="mt-2 mb-4 px-2 font-semibold text-center text-base">Workflows</h2>

          <n-scrollbar class="py-1" trigger="none">
            <ul class="divide-y divide-slate-700">
              <li v-for="item in workflows" :key="item.id" @click="selectWorkflow(item)">
                <workflow-list-item
                  :item="item"
                  :is-active="item.id === activeItem?.id"
                  @delete="handleWorkflowDeleted" />
              </li>
            </ul>

            <div class="text-center mt-4">
              <n-button @click="showCreateFormModal = true">Add workflow</n-button>
            </div>
          </n-scrollbar>
        </div>
      </pane>

      <!-- Triggers & Actions -->
      <pane min-size="30">
        <div v-if="!activeItem" class="flex h-full w-full justify-center place-items-center">
          <n-empty description="Select a workflow first" size="large">
            <template #icon>
              <n-icon :component="EmptyIcon" />
            </template>
          </n-empty>
        </div>

        <splitpanes v-else horizontal class="default-theme max-h-full h-full overflow-hidden">
          <!-- Triggers -->
          <pane min-size="15">
            <workflow-triggers-list
              :triggers="activeItemTriggers"
              @add="onTriggerAdded"
              @update="onTriggerUpdated"
              @delete="onTriggerDeleted" />
          </pane>

          <!-- Actions -->
          <pane size="75" min-size="15">
            <workflow-actions-list
              :actions="activeItemActions"
              @add="onActionAdded"
              @update="onActionUpdated"
              @delete="onActionDeleted" />
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </default-layout>
</template>

<style lang="postcss">
.splitpanes.default-theme .splitpanes__pane {
  background: transparent;
  transition: none;
  @apply rounded;
}

.splitpanes.default-theme > .splitpanes__splitter:hover {
  @apply dark:bg-slate-600;
}

.splitpanes.default-theme > .splitpanes__splitter {
  @apply dark:bg-slate-700 dark:border-0 transition-opacity duration-[50ms];
}

.splitpanes.default-theme .splitpanes__splitter:before,
.splitpanes.default-theme .splitpanes__splitter:after {
  @apply dark:bg-slate-400;
}

.splitpanes.default-theme .splitpanes__splitter:hover:before,
.splitpanes.default-theme .splitpanes__splitter:hover:after,
.splitpanes.default-theme.splitpanes--dragging .splitpanes__splitter:before,
.splitpanes.default-theme.splitpanes--dragging .splitpanes__splitter:after {
  @apply dark:bg-slate-200;
}

.splitpanes.default-theme.splitpanes--dragging .splitpanes__splitter {
  @apply opacity-30;
}
</style>
