import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';

export default async function workflowTriggerDelete(_event: Electron.IpcMainInvokeEvent, id: string): Promise<void> {
  return (await WorkflowTrigger.findByPk(id))?.destroy();
}
