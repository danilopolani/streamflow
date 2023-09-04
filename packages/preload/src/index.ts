import { ipcRenderer } from 'electron';
import type { GeneralSettings } from '~shared/settings/GeneralSettings';
import type { ObsWebSocketSettings, ObsWebSocketConnection } from '~shared/ObsWebSocketSettings';
import type { TwitchSettings } from '~shared/TwitchSettings';
import { type Workflow as SharedWorkflow } from '~shared/models/Workflow';
import { type WorkflowAction as SharedWorkflowAction } from '~shared/models/WorkflowAction';
import { type WorkflowTrigger as SharedWorkflowTrigger } from '~shared/models/WorkflowTrigger';
import { type WorkflowLog as SharedWorkflowLog } from '~shared/models/WorkflowLog';
import { type BaseData as TriggerBaseData } from '~shared/triggers/baseData';
import { type BaseData as ActionBaseData } from '~shared/actions/baseData';

// Proxy messages from main to renderer
ipcRenderer.on('messageToRenderer', (_e, data) => {
  window.postMessage(data, '*');
});

export function openUrl(url: string): void {
  ipcRenderer.invoke('open-url', url);
}

export async function generalGetSettings(): Promise<GeneralSettings | undefined> {
  return ipcRenderer.invoke('general:getSettings');
}

export async function generalUpdateSettings(data: GeneralSettings): Promise<void> {
  return ipcRenderer.invoke('general:updateSettings', data);
}

export async function obsConnect(settings: ObsWebSocketConnection): Promise<string | undefined> {
  return ipcRenderer.invoke('obs:connect', {
    ...settings,
    shouldConnect: true, // Force connection
  } as ObsWebSocketSettings);
}

export async function obsRetryConnection(): Promise<void> {
  const settings = await obsGetSettings();

  if (!settings) {
    return;
  }

  obsConnect(settings);
}

export function obsDisconnect(): void {
  ipcRenderer.invoke('obs:disconnect');
}

export async function obsGetSettings(): Promise<ObsWebSocketSettings | undefined> {
  return (await ipcRenderer.invoke('obs:getSettings')) as ObsWebSocketSettings | undefined;
}

export async function twitchGetSettings(): Promise<TwitchSettings | undefined> {
  return (await ipcRenderer.invoke('twitch:getSettings')) as TwitchSettings | undefined;
}

export function twitchDisconnect(): void {
  ipcRenderer.invoke('twitch:disconnect');
}

export async function workflowCount(): Promise<number> {
  return ipcRenderer.invoke('workflow:count');
}

export async function workflowList(): Promise<SharedWorkflow[]> {
  return ipcRenderer.invoke('workflow:list');
}

export async function workflowCreate(data: Omit<SharedWorkflow, 'id'>): Promise<SharedWorkflow> {
  return ipcRenderer.invoke('workflow:create', data);
}

export async function workflowDelete(id: string): Promise<void> {
  return ipcRenderer.invoke('workflow:delete', id);
}

export async function workflowRun(id: string): Promise<void> {
  return ipcRenderer.invoke('workflow:run', id);
}

export async function workflowActionList(workflowId: string): Promise<SharedWorkflowAction[]> {
  return ipcRenderer.invoke('workflow-action:list', workflowId);
}

export async function workflowActionCreate(data: Omit<SharedWorkflowAction, 'id'>): Promise<SharedWorkflowAction[]> {
  return ipcRenderer.invoke('workflow-action:create', data);
}

export async function workflowActionUpdate(id: string, baseValues: ActionBaseData, optionValues: object): Promise<void> {
  return ipcRenderer.invoke('workflow-action:update', id, baseValues, optionValues);
}

export async function workflowActionDelete(id: string): Promise<SharedWorkflowAction[]> {
  return ipcRenderer.invoke('workflow-action:delete', id);
}

export async function workflowTriggerList(workflowId: string): Promise<SharedWorkflowTrigger[]> {
  return ipcRenderer.invoke('workflow-trigger:list', workflowId);
}

export async function workflowTriggerCreate(data: Omit<SharedWorkflowTrigger, 'id'>): Promise<SharedWorkflowTrigger> {
  return ipcRenderer.invoke('workflow-trigger:create', data);
}

export async function workflowTriggerUpdate(id: string, baseValues: TriggerBaseData, optionValues: object): Promise<void> {
  return ipcRenderer.invoke('workflow-trigger:update', id, baseValues, optionValues);
}

export async function workflowTriggerDelete(id: string): Promise<void> {
  return ipcRenderer.invoke('workflow-trigger:delete', id);
}

export async function workflowLogList(): Promise<SharedWorkflowLog[]> {
  return ipcRenderer.invoke('workflow-log:list');
}

