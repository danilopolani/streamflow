export enum Type {
  Value = 'VALUE',
  Lambda = 'LAMBDA',
}

export type ActionOptions = {
  variableName: string
  type: Type
  value?: string
  code?: string
}

export const actionKey = 'SYSTEM.SET_VARIABLE';

export const actionName = 'Set variable';
