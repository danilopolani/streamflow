<script lang="ts" setup>
import { ref } from 'vue';
import { NScrollbar } from 'naive-ui';
import { type WorkflowTrigger } from '~shared/models/WorkflowTrigger';
import AddTriggerButton from '/@/components/triggers/AddTriggerButton.vue';
import WorkflowTriggerListItem from '/@/components/triggers/TriggerListItem.vue';
import EditTriggerModal from '/@/components/triggers/EditTriggerModal.vue';
import { type BaseData } from '~shared/triggers/baseData';

defineProps<{ triggers: WorkflowTrigger[] }>();

defineEmits<{
  (e: 'add', key: string, baseValues: BaseData, optionValues: object): void
  (e: 'update', id: string, baseValues: BaseData, optionValues: object): void
  (e: 'delete', id: string): void
}>();

const showEditModal = ref(false);
const currentTrigger = ref<WorkflowTrigger>();
</script>

<template>
  <edit-trigger-modal
    :show="showEditModal"
    :trigger="currentTrigger"
    @save="(...args) => ($emit('update', ...args), showEditModal = false)"
    @close="showEditModal = false" />

  <div
    class="w-full h-full"
    :class="{'flex flex-col justify-center': triggers.length === 0}">
    <div v-if="triggers.length > 0">
      <h2 class="mt-2 mb-4 px-2 font-semibold text-center text-base">Triggers</h2>

      <n-scrollbar class="py-1" trigger="none">
        <ul>
          <li v-for="item in triggers" :key="item.id">
            <workflow-trigger-list-item
              :item="item"
              @click="currentTrigger = item; showEditModal = true"
              @delete="(...args) => $emit('delete', ...args)" />
          </li>
        </ul>

        <add-trigger-button @select="(...args) => $emit('add', ...args)" />
      </n-scrollbar>
    </div>

    <add-trigger-button v-else @select="(...args) => $emit('add', ...args)" />
  </div>
</template>
