import { WorkflowLog } from '/@/database/models/WorkflowLog';

export default async function workflowLogList(_event: Electron.IpcMainInvokeEvent): Promise<WorkflowLog[]> {
  const data = await WorkflowLog.findAll({
    include: ['workflow', 'trigger'],
    order: [
      ['createdAt', 'DESC'],
    ],
    limit: 50,
  });

  return data.map((item) => item.toJSON());
}
