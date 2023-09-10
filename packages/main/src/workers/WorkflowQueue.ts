import { WorkflowLog } from '../database/models/WorkflowLog';
import runWorkflow from '../workflows/run';
import { LogQueueSubject } from '~shared/LogQueue';
import { tellRenderer } from '../helpers';
import { log } from '../logger';

export const WorkflowQueue = new class {
  private queues: Map<string, WorkflowLog[]> = new Map();
  private waiting: Set<string> = new Set(); // We store here the loop waiting for the job to finish

  async init() {
    const pendingJobs = await WorkflowLog.findAll({
      where: { ranAt: null },
      include: ['workflow', 'trigger'],
    });

    for (const pendingJob of pendingJobs) {
      this.enqueue(pendingJob);
    }
  }

  async enqueue(job: WorkflowLog) {
    job = await job.reload({
      include: ['workflow', 'trigger'],
    });

    tellRenderer({
      subject: LogQueueSubject.LogAdded,
      message: JSON.stringify(job.toJSON()),
    });

    if (!this.queues.has(job.workflow.id)) {
      this.queues.set(job.workflow.id, []);
      this.processQueue(job.workflow.id);
    }

    this.queues.get(job.workflow.id)!.push(job);
  }

  private processQueue(workflowId: string) {
    setInterval(async () => {
      if (this.waiting.has(workflowId)) {
        return;
      }

      const pendingJob = this.queues.get(workflowId)?.shift();

      if (pendingJob) {
        this.waiting.add(workflowId);

        await pendingJob.update({ ranAt: Date.now() });

        // Make it non-blocking
        runWorkflow(pendingJob.workflow.id, pendingJob.variables, pendingJob.id)
          .then(async () => {
            this.waiting.delete(workflowId);

            tellRenderer({
              subject: LogQueueSubject.LogProcessed,
              message: JSON.stringify((await pendingJob.reload()).toJSON()),
            });
          })
          .catch((err) => {
            log.error('[Queue] Error running workflow ' + workflowId + ': ' + err);
          });
      }
    });
  }
};
