import { Workflow } from '/@/database/models/Workflow';

export default async function workflowList(_event: Electron.IpcMainInvokeEvent): Promise<Workflow[]> {
  const data = await Workflow.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  return data.map((item) => item.get());
}
