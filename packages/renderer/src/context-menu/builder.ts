import type { VNode } from 'vue';
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import { useContextMenu } from '../contextMenu';

export class ContextMenu {
  private _items: DropdownMixedOption[] = [];

  item(value: ContextMenuItem) {
    // @ts-ignore complains about a missing "type" key but not actually required for our scope
    this._items.push(value.toItem());

    return this;
  }

  divider() {
    this._items.push(new ContextMenuDivider().toItem());

    return this;
  }

  items() {
    return this._items;
  }
}

export class ContextMenuItem {
  private _label?: string;
  private _key: string;
  private _icon?: () => VNode;
  private _isDanger = false;
  private _onClick?: () => void;

  constructor() {
    this._key = (Math.random() + 1).toString(36).substring(2); // Random string
  }

  label(value: string) {
    this._label = value;

    return this;
  }

  icon(value: () => VNode) {
    this._icon = value;

    return this;
  }

  danger() {
    this._isDanger = true;

    return this;
  }

  onClick(fn: () => void) {
    this._onClick = fn;

    return this;
  }

  toItem() {
    return {
      label: this._label,
      key: this._key,
      icon: this._icon,
      props: {
        class: this._isDanger ? '!text-red-400' : '',
        onClick: () => {
          const contextMenu = useContextMenu();

          contextMenu.close();

          if (this._onClick) {
            this._onClick();
          }
        },
      },
    };
  }
}

export class ContextMenuDivider {
  toItem() {
    return {
      key: (Math.random() + 1).toString(36).substring(2), // Random string
      type: 'divider',
    };
  }
}
