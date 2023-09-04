<script lang="ts" setup>
import { Delete24Regular as DeletIcon } from '@vicons/fluent';
import { ref } from 'vue';
import { NEllipsis, NTag, NIcon } from 'naive-ui';
import { renderIcon } from '/@/helpers';
import { type WorkflowAction } from '../../../../shared/models/WorkflowAction';
import { getActionClass, getActionCategory } from '/@/actions/registerActions';
import { useContextMenu, ContextMenu, ContextMenuItem } from '/@/contextMenu';

const props = defineProps<{
  item: WorkflowAction
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>();

const isSoftSelected = ref(false); // E.g. by right click

const contextMenu = useContextMenu();

const contextMenuOptions = new ContextMenu()
  .item(
    new ContextMenuItem()
      .label('Delete')
      .icon(renderIcon(DeletIcon, 'red'))
      .onClick(() => emit('delete', props.item.id)),
  );
</script>

<template>
  <div
    class="p-3 hover:bg-primary/30 flex flex-col place-content-between cursor-pointer"
    :class="{'bg-primary/30': isSoftSelected}"
    @contextmenu.prevent="isSoftSelected = true; contextMenu.open(contextMenuOptions, () => isSoftSelected = false)">
    <div class="flex gap-2">
      <n-icon :component="getActionCategory(item.action).icon" size="20" class="mt-1" />

      <div>
        <n-ellipsis class="max-w-full" :class="{'opacity-40': item.isDisabled}" :tooltip="false">
          {{ item.title || getActionClass(item.action).name }}
        </n-ellipsis>

        <div class="flex gap-1 place-items-center">
          <n-tag v-if="item.isDisabled" :bordered="false" size="tiny" type="warning" class="mt-1">
            Disabled
          </n-tag>

          <n-ellipsis class="max-w-full text-xs text-slate-400" :tooltip="false" :class="{'opacity-40': item.isDisabled}">
            {{ getActionClass(item.action).description }}
          </n-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>
