<script lang="ts" setup>
import {
  Rocket24Regular as RocketIcon,
  Play24Filled as PlayIcon,
  Delete24Regular as DeletIcon,
} from '@vicons/fluent';
import { ref } from 'vue';
import { NIcon, NIconWrapper, NEllipsis, NPopover, NTag, useMessage } from 'naive-ui';
import { useContextMenu, ContextMenu, ContextMenuItem } from '/@/contextMenu';
import { renderIcon } from '/@/helpers';
import { type Workflow } from '../../../../shared/models/Workflow';
import { workflowDelete, workflowRun } from '#preload';

const props = defineProps<{
  item: Workflow
  isActive: boolean
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
      .label('Run')
      .icon(renderIcon(PlayIcon, 'green'))
      .onClick(async () => {
        await workflowRun(props.item.id);
      }),
  )
  .divider()
  .item(
    new ContextMenuItem()
      .label('Delete')
      .icon(renderIcon(DeletIcon, 'red'))
      .onClick(async () => {
        try {
          await workflowDelete(props.item.id);
        } catch (err) {
          toast.error('Error while deleting workflow: ' + err, {
            duration: 5000,
          });

          return;
        }

        toast.success('Workflow deleted successfully');
        emit('delete', props.item.id);
      }),
  );
</script>

<template>
  <div
    :class="{
      '!bg-primary': isActive && item.isDisabled,
      '!bg-accent/80': isActive && !item.isDisabled,
      'bg-slate-700': isSoftSelected,
    }"
    class="p-3 hover:bg-slate-700 cursor-pointer"
    @contextmenu.prevent="isSoftSelected = true; contextMenu.open(contextMenuOptions, () => isSoftSelected = false)">
    <div class="flex place-content-between">
      <n-ellipsis class="max-w-full" :class="{'opacity-40': item.isDisabled}" :tooltip="false">
        {{ item.name }}
      </n-ellipsis>

      <n-popover v-if="item.skipsQueue" trigger="hover">
        <template #trigger>
          <n-icon-wrapper
            :size="24"
            :border-radius="10"
            class="!bg-green-600 !text-white !rounded-full"
            :class="{'opacity-40': item.isDisabled}">
            <n-icon :component="RocketIcon" />
          </n-icon-wrapper>
        </template>
        Runs immediately
      </n-popover>
    </div>

    <n-tag v-if="item.isDisabled" :bordered="false" size="tiny" type="warning" class="mt-1">
      Disabled
    </n-tag>
  </div>
</template>
