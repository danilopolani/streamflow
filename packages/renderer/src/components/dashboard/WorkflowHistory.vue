<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue';
import { NButton, NIcon, NScrollbar, NEllipsis, NTooltip, NDropdown } from 'naive-ui';
import { History24Regular as HistoryIcon } from '@vicons/fluent';
import {
  HourglassOutline as PendingIcon,
  CheckmarkDone as CompletedIcon,
  BanOutline as ErrorIcon,
  EllipsisVerticalOutline as ActionsIcon,
} from '@vicons/ionicons5';
import { formatDateDiff } from '/@/helpers';
import WorkflowVariablesModal from './WorkflowVariablesModal.vue';
import { workflowLogList } from '#preload';
import type { WorkflowLog } from '~shared/models/WorkflowLog';
import { LogQueueSubject } from '~shared/LogQueue';
import type { WorkerMessage } from '~shared/WorkerMessage';

const workflowHistory = ref<WorkflowLog[]>([]);
const showInspectModal = shallowRef(false);
const workflowVariables = shallowRef<object>();

onMounted(async () => {
  workflowHistory.value = await workflowLogList();
});

const actions = [
  {
    label: 'Inspect',
    key: 'inspect',
    props: {
      onClick: () => showInspectModal.value = true,
    },
  },
];

window.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.subject) {
    case LogQueueSubject.LogAdded: {
      workflowHistory.value = [
        JSON.parse(e.data.message!) as WorkflowLog,
        ...workflowHistory.value,
      ].slice(0, 50);

      break;
    }

    case LogQueueSubject.LogProcessed: {
      const workflow = JSON.parse(e.data.message!) as WorkflowLog;
      const workflowIndex = workflowHistory.value.findIndex((item) => item.id === workflow.id);

      if (workflowIndex > -1) {
        workflowHistory.value[workflowIndex] = workflow;
      }

      break;
    }
  }
});
</script>

<template>
  <workflow-variables-modal
    :show="showInspectModal"
    :variables="workflowVariables"
    @close="showInspectModal = false" />

  <div class="bg-slate-200 dark:bg-slate-700/50 rounded pb-2">
    <div class="flex items-center gap-1 p-5">
      <n-icon :size="24" :component="HistoryIcon" />
      <h2 class="text-lg font-semibold whitespace-nowrap">Recent runs</h2>
    </div>

    <p v-if="workflowHistory.length === 0" class="text-slate-400 mt-3 px-4 text-center mb-4">No data yet</p>

    <n-scrollbar v-else class="max-h-[400px] mt-3" trigger="none">
      <transition-group
        id="workflow-history-list"
        tag="ul"
        class="divide-y divide-gray-100 dark:divide-gray-800"
        enter-from-class="-translate-x-[5%] opacity-0"
        enter-active-class="transition duration-500">
        <li v-for="item in workflowHistory" :key="item.id" class="py-3 px-4">
          <div class="flex w-full gap-2">
            <!-- Icon -->
            <n-tooltip trigger="hover" placement="right" :show-arrow="false" to="#workflow-history-list">
              <template #trigger>
                <n-icon v-if="item.ranAt === null" :component="PendingIcon" :size="20" class="text-yellow-500 mt-1" />
                <n-icon v-if="item.ranAt !== null && item.error === null" :component="CompletedIcon" :size="20" class="text-green-500" />
                <n-icon v-if="item.error !== null" :component="ErrorIcon" :size="20" class="text-red-500" />
              </template>

              <p v-if="item.ranAt === null">Pending</p>
              <p v-if="item.ranAt !== null && item.error === null">Ran at {{ new Date(item.ranAt).toLocaleString() }}</p>
              <p v-if="item.error !== null">Error: {{ item.error }}</p>
            </n-tooltip>

            <div>
              <n-ellipsis :tooltip="false" class="text-base">{{ item.workflow.name }}</n-ellipsis>
              <n-tooltip trigger="hover" placement="top-start" :show-arrow="false" to="#workflow-history-list">
                <template #trigger>
                  <p class="text-slate-400 text-xs">{{ formatDateDiff(item.createdAt) }}</p>
                </template>
                {{ new Date(item.createdAt).toLocaleString() }}
              </n-tooltip>
            </div>

            <n-dropdown trigger="click" :options="actions" placement="bottom-end" to="#workflow-history-list">
              <n-button quaternary circle class="!ml-auto" @click="workflowVariables = item.variables">
                <template #icon>
                  <n-icon :component="ActionsIcon" />
                </template>
              </n-button>
            </n-dropdown>
          </div>
        </li>
      </transition-group>
    </n-scrollbar>
  </div>
</template>
