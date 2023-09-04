import { Workflow } from '/@/database/models/Workflow';
import { type  Action } from '../actions/Action';
import actionsMap from '/@/actions/registerActions';
import { WorkflowLog } from '../database/models/WorkflowLog';
import { sort } from '../ipc/actions/list';

export default async function runWorkflow(workflowId: string, initialOptions?: object, workflowLog?: number | WorkflowLog): Promise<void> {
  let log: WorkflowLog | null = null;

  const workflow = await Workflow.findByPk(workflowId, {
    include: ['actions'],
  });

  if (typeof workflowLog !== 'number' && typeof workflowLog !== 'undefined') {
    log = workflowLog;
  } else if (typeof workflowLog === 'number') {
    log = await WorkflowLog.findByPk(workflowLog);
  }

  if (!workflow) {
    return;
  }

  let workflowOptions = {
    ...initialOptions || {},
    ...workflow.options || {},
  };

  const workflowActions = sort(workflow.actions);

  try {
    for (const action of workflowActions) {
      // @ts-ignore
      const resolvedAction: Action = actionsMap[action.action];

      // Merge options returned by the action into the "carrying" object
      workflowOptions = {
        ...workflowOptions,
        ...(await resolvedAction.run(workflowOptions, action.options || {})),
      };
    }
  } catch (err) {
    await log?.update('error', err);
  } finally {
    await log?.update({ ranAt: new Date() });
  }
}
