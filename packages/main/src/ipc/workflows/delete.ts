import { Workflow } from '/@/database/models/Workflow';

export default async function workflowDelete(_event: Electron.IpcMainInvokeEvent, id: string): Promise<void> {
  await (await Workflow.findByPk(id))?.destroy();
}
