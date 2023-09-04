import Worker, { type MainMessage } from './Worker';
import { initDatabase } from '../database';
import { WorkflowLog } from '../database/models/WorkflowLog';
import runWorkflow from '../workflows/run';
import { TwitchReply } from '../actions/twitch/Reply';
import { ObsMute } from '../actions/obs/Mute';
import type { WorkerMessage } from '~shared/WorkerMessage';
import { QueueToMainSubject as TwitchReplySubject } from '~shared/actions/twitch/reply';
import { QueueToMainSubject as ObsMuteSubject } from '~shared/actions/obs/mute';
import { QueueToMainSubject as ObsUnmuteSubject } from '~shared/actions/obs/unmute';
import { LogQueueSubject } from '~shared/LogQueue';
import { ObsUnmute } from '../actions/obs/Unmute';

export enum WorkerAction {
  Enqueue = 'ENQUEUE',
}

export const WorkflowQueue = new class extends Worker<WorkerOptions | undefined> {
  protected workerFile = 'WorkflowQueue';
  private queues: Map<string, WorkflowLog[]> = new Map();
  private waiting: Set<string> = new Set(); // We store here the loop waiting for the job to finish

  constructor() {
    super();

    if (this.isWorker()) {
      this.init();
      this.listenEventsAsWorker();
    }
  }

  async init() {
    await initDatabase(false);

    const pendingJobs = await WorkflowLog.findAll({
      where: { ranAt: null },
      include: ['workflow', 'trigger'],
    });

    for (const pendingJob of pendingJobs) {
      this.enqueue(pendingJob);
    }
  }

  /**
   * Listen events as a worker from the main process.
   */
  protected async handleMessageAsWorker(e: MainMessage) {
    switch (e.action) {
      case WorkerAction.Enqueue: {
        const log = await WorkflowLog.findOne({
          where: { ranAt: null, id: e.args?.logId },
          include: ['workflow', 'trigger'],
        });

        if (log) {
          this.enqueue(log);

          this.tellMainForRenderer(LogQueueSubject.LogAdded, {
            message: JSON.stringify(log.toJSON()),
          });
        }

        break;
      }
    }
  }

  /**
   * Listen events as main process from the worker.
   */
  protected async handleMessageAsMain(e: WorkerMessage) {
    switch (e.subject) {
      case TwitchReplySubject: {
        TwitchReply.exec(...JSON.parse(e.message!) as [string, string, object]);
        break;
      }
      case ObsMuteSubject: {
        ObsMute.exec(e.message as string);
        break;
      }
      case ObsUnmuteSubject: {
        ObsUnmute.exec(e.message as string);
        break;
      }
    }
  }

  private enqueue(job: WorkflowLog) {
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
        await runWorkflow(pendingJob.workflow.id, pendingJob.variables, pendingJob.id);

        this.waiting.delete(workflowId);

        this.tellMainForRenderer(LogQueueSubject.LogProcessed, {
          message: JSON.stringify((await pendingJob.reload()).toJSON()),
        });
      }
    });
  }
};
