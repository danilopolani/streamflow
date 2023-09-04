import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';

export default async function workflowTriggerList(_event: Electron.IpcMainInvokeEvent, workflowId: string): Promise<WorkflowTrigger[]> {
  const data = await WorkflowTrigger.findAll({
    where: {
      workflowId,
    },
    order: [
      ['order', 'ASC'],
    ],
  });

  return data.map((item) => item.get());
}
