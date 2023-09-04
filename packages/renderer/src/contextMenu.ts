import { useMouse } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import type { ContextMenu } from './context-menu/builder';

export * from './context-menu/builder';

export const useContextMenu = defineStore('contextmenu', () => {
  const isOpen = ref(false);
  const items = ref<DropdownMixedOption[]>([]);
  const xPos = ref(0);
  const yPos = ref(0);
  const onCloseCallback = ref<(() => void)>();

  const mouse = useMouse({ touch: false });

  watch(isOpen, (value) => {
    if (!value && onCloseCallback.value) {
      onCloseCallback.value();
    }
  });

  const open = (menu: ContextMenu, onClose?: (() => void)) => {
    // @ts-ignore
    items.value = menu.items();
    xPos.value = mouse.x.value;
    yPos.value = mouse.y.value;
    isOpen.value = true;
    onCloseCallback.value = onClose;
  };

  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, xPos, yPos, items, open, close };
});
