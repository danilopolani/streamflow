<script lang="ts" setup>
import { ref } from 'vue';
import { NScrollbar } from 'naive-ui';
import { type WorkflowAction } from '~shared/models/WorkflowAction';
import AddActionButton from '/@/components/actions/AddActionButton.vue';
import WorkflowActionListItem from '/@/components/actions/ActionListItem.vue';
import EditActionModal from '/@/components/actions/EditActionModal.vue';
import { type BaseData } from '~shared/actions/baseData';

defineProps<{ actions: WorkflowAction[] }>();

defineEmits<{
  (e: 'add', key: string, baseValues: BaseData, optionValues: object, previousId: string|null): void
  (e: 'update', id: string, baseValues: BaseData, optionValues: object): void
  (e: 'delete', id: string): void
}>();

const showEditModal = ref(false);
const currentAction = ref<WorkflowAction>();
</script>

<template>
  <edit-action-modal
    :show="showEditModal"
    :action="currentAction"
    @save="(...args) => ($emit('update', ...args), showEditModal = false)"
    @close="showEditModal = false" />

  <div
    class="w-full h-full"
    :class="{'flex flex-col justify-center': actions.length === 0}">
    <div v-if="actions.length > 0">
      <h2 class="mt-2 mb-4 px-2 font-semibold text-center text-base">Actions</h2>

      <n-scrollbar class="py-1" trigger="none">
        <add-action-button
          type="divider"
          :previous-id="null"
          @select="(...args) => $emit('add', ...args)" />

        <ul>
          <li v-for="(item, index) in actions" :key="item.id">
            <workflow-action-list-item
              :item="item"
              @click="currentAction = item; showEditModal = true"
              @delete="(...args) => $emit('delete', ...args)" />

            <add-action-button
              v-if="index < ($props.actions.length - 1)"
              type="divider"
              :previous-id="item.id"
              @select="(...args) => $emit('add', ...args)" />
          </li>
        </ul>

        <add-action-button
          type="button"
          :previous-id="actions[actions.length - 1].id"
          @select="(...args) => $emit('add', ...args)" />
      </n-scrollbar>
    </div>

    <add-action-button
      v-else
      type="button"
      :previous-id="null"
      @select="(...args) => $emit('add', ...args)" />
  </div>
</template>
