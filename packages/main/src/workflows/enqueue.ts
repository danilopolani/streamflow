import { type Workflow } from '/@/database/models/Workflow';
import { type WorkflowTrigger } from '/@/database/models/WorkflowTrigger';
import { WorkflowLog } from '../database/models/WorkflowLog';
import runWorkflow from './run';
import { WorkerAction, WorkflowQueue } from '../workers/WorkflowQueue';

export default async function enqueueWorkflow(workflow: Workflow, trigger: WorkflowTrigger, variables: object): Promise<void> {
  const log = await WorkflowLog.create({
    workflowId: workflow.id,
    triggerId: trigger.id,
    variables,
  });

  if (workflow.shouldRunImmediately) {
    runWorkflow(workflow.id, variables, log.id);
  } else {
    WorkflowQueue.tellWorker(WorkerAction.Enqueue, { logId: log.id });
  }
}
