import workflowActionList from './list';
import { WorkflowAction } from '/@/database/models/WorkflowAction';

export default async function workflowActionDelete(_event: Electron.IpcMainInvokeEvent, id: string): Promise<WorkflowAction[]> {
  const action = await WorkflowAction.findByPk(id);
  const workflowId = action!.workflowId;

  // If there was an action with our id as previousId, we should update that to scale and use the deleted action previousId on cascade
  const actionWithPreviousId = await WorkflowAction.findOne({
    where: {
      workflowId,
      orderPreviousId: id,
    },
  });

  if (actionWithPreviousId) {
    await actionWithPreviousId.update({ orderPreviousId: action!.orderPreviousId });
  }

  await action!.destroy();

  // Return the fresh list with correct order
  return workflowActionList(_event, workflowId);
}
