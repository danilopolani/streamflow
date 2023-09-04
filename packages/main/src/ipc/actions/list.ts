import { WorkflowAction } from '/@/database/models/WorkflowAction';

export default async function workflowActionList(_event: Electron.IpcMainInvokeEvent, workflowId: string): Promise<WorkflowAction[]> {
  const data = await WorkflowAction.findAll({
    where: {
      workflowId,
    },
  });

  return sort(data.map((item) => item.get()));
}

export const sort = (data: WorkflowAction[]) => {
  // Create a queue to store the items that have not yet been sorted.
  const result = data.splice(data.findIndex((item) => item.orderPreviousId === null), 1);

  for (const item of data) {
    const previousIdIndex = result.findIndex((previous) => previous.id === item.orderPreviousId);

    if (previousIdIndex > -1) {
      result.splice(previousIdIndex + 1, 0, item);
    } else {
      result.push(item);
    }
  }

  return result;
};
