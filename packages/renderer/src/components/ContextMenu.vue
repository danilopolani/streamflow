<script lang="ts" setup>
import { NDropdown } from 'naive-ui';
import { useContextMenu } from '/@/contextMenu';
import { storeToRefs } from 'pinia';

const store = useContextMenu();
const { items, isOpen, xPos, yPos } = storeToRefs(store);
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xPos"
    :y="yPos"
    :options="items"
    :show="isOpen"
    :menu-props="() => ({
      class: 'min-w-[150px]',
    })"
    @clickoutside="store.close" />
</template>
