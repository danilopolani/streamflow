import { shell } from 'electron';

export default function openUrl(_event: Electron.IpcMainInvokeEvent, url: string): void {
  shell.openExternal(url);
}
