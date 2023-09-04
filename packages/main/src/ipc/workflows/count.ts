import { Workflow } from '/@/database/models/Workflow';

export default function workflowCount(_event: Electron.IpcMainInvokeEvent): Promise<number> {
  return Workflow.count();
}
