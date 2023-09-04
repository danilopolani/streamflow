import { type Workflow as SharedWorkflow } from '../../../../shared/models/Workflow';
import { Workflow } from '/@/database/models/Workflow';

export default async function workflowCreate(_event: Electron.IpcMainInvokeEvent, data: Omit<SharedWorkflow, 'id'>): Promise<Workflow> {
  return (await Workflow.create(data)).get();
}
