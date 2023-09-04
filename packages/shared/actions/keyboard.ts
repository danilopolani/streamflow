export enum Type {
  Text = 'TEXT',
  Shortcut = 'SHORTCUT',
}

export type ActionOptions = {
  type: Type
  text?: string
  shortcut: string[]
}

export const actionKey = 'KEYBOARD';

export const actionName = 'Keyboard';
