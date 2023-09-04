import { type WorkflowAction as SharedWorkflowAction } from '../../../../shared/models/WorkflowAction';
import workflowActionList from './list';
import { WorkflowAction } from '/@/database/models/WorkflowAction';

export default async function workflowActionCreate(_event: Electron.IpcMainInvokeEvent, data: Omit<SharedWorkflowAction, 'id'>): Promise<WorkflowAction[]> {
  // If there's already an action with the same previousId, we should update that to being *after* our new action
  const actionWithSamePreviousId = await WorkflowAction.findOne({
    where: {
      workflowId: data.workflowId,
      orderPreviousId: data.orderPreviousId,
    },
  });

  const newAction = await WorkflowAction.create(data);

  if (actionWithSamePreviousId) {
    await actionWithSamePreviousId.update({ orderPreviousId: newAction.id });
  }

  // Return the fresh list with correct order
  return workflowActionList(_event, data.workflowId);
}
