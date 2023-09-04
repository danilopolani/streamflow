<script lang="ts" setup>
import { Delete24Regular as DeletIcon } from '@vicons/fluent';
import { ref } from 'vue';
import { NEllipsis, NTag, NIcon, useMessage } from 'naive-ui';
import { renderIcon } from '/@/helpers';
import { type WorkflowTrigger } from '../../../../shared/models/WorkflowTrigger';
import { getTriggerClass, getTriggerCategory } from '/@/triggers/registerTriggers';
import { useContextMenu, ContextMenu, ContextMenuItem } from '/@/contextMenu';
import { workflowTriggerDelete } from '#preload';

const props = defineProps<{
  item: WorkflowTrigger
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>();

const isSoftSelected = ref(false); // E.g. by right click

const toast = useMessage();
const contextMenu = useContextMenu();

const contextMenuOptions = new ContextMenu()
  .item(
    new ContextMenuItem()
      .label('Delete')
      .icon(renderIcon(DeletIcon, 'red'))
      .onClick(async () => {
        try {
          await workflowTriggerDelete(props.item.id);
        } catch (err) {
          toast.error('Error while deleting trigger: ' + err, {
            duration: 5000,
          });

          return;
        }

        toast.success('Trigger deleted successfully');
        emit('delete', props.item.id);
      }),
  );
</script>

<template>
  <div
    class="p-3 hover:bg-primary/30 flex flex-col place-content-between cursor-pointer"
    :class="{'bg-primary/30': isSoftSelected}"
    @contextmenu.prevent="isSoftSelected = true; contextMenu.open(contextMenuOptions, () => isSoftSelected = false)">
    <div class="flex gap-2">
      <n-icon :component="getTriggerCategory(item.trigger).icon" size="20" class="mt-1" />

      <div>
        <n-ellipsis class="max-w-full" :class="{'opacity-40': item.isDisabled}" :tooltip="false">
          {{ item.title || getTriggerClass(item.trigger).name }}
        </n-ellipsis>

        <div class="flex gap-1 place-items-center">
          <n-tag v-if="item.isDisabled" :bordered="false" size="tiny" type="warning" class="mt-1">
            Disabled
          </n-tag>

          <n-ellipsis class="max-w-full text-xs text-slate-400" :tooltip="false" :class="{'opacity-40': item.isDisabled}">
            {{ getTriggerClass(item.trigger).description }}
          </n-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>
