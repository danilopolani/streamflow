import { type WorkflowTrigger as SharedWorkflowTrigger } from '~shared/models/WorkflowTrigger';
import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';

export default async function workflowTriggerCreate(_event: Electron.IpcMainInvokeEvent, data: Omit<SharedWorkflowTrigger, 'id'>): Promise<WorkflowTrigger> {
  return (await WorkflowTrigger.create(data)).get();
}
