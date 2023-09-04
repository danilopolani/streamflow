import { type UtilityProcess, utilityProcess, app } from 'electron';
import * as path from 'node:path';
import { browserWindow } from '../mainWindow';
import { type WorkerMessage } from '../../../shared/WorkerMessage';
import { inWorkerContext } from '../helpers';

export type MainMessage = {
  action: string
  args?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default abstract class Worker<T> {
  protected abstract workerFile: string;

  protected options?: T = {} as T;

  protected worker?: UtilityProcess = undefined;

  /**
   * Spawn a worker of the current class.
   */
  spawn(options?: T): void {
    const argv = ['--work'];

    if (options) {
      for (const [key, value] of Object.entries(options as object)) {
        argv.push(`--${key}=${value}`);
      }
    }

    this.worker = utilityProcess.fork(
      path.join(__dirname, this.workerFile + '.cjs'),
      argv,
      {
        env: {
          DB_BASEPATH: app.getPath('userData'),
        },
      },
    );

    this.listenEventsAsMain();
  }

  /**
   * Detect whether the current instance is a worker.
   */
  isWorker(): boolean {
    if (!inWorkerContext()) {
      return false;
    }

    // Populate options from argv
    process.argv.slice(3).map((value: string) => {
      const [argName, argValue] = value.replace('--', '').split('=');

      // @ts-ignore
      this.options[argName] = this.formatArgValue(argValue);
    });

    return true;
  }

  /**
   * Format an arg value as its type.
   */
  private formatArgValue(value: string) {
    if (value === 'false') {
      return false;
    }

    if (value === 'true') {
      return true;
    }

    return value;
  }

  /**
   * Send a message to the worker.
   */
  tellWorker(action: string, args?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.worker?.postMessage({
      action,
      args,
    });
  }

  tellMain(subject: string, extra?: Partial<Omit<WorkerMessage, 'subject'>>) {
    process.parentPort.postMessage({
      subject,
      ...extra,
    } as WorkerMessage);
  }

  tellMainWithNotification(subject: string, extra?: Partial<Omit<WorkerMessage, 'subject' | 'forwardToRenderer' | 'shouldNotify'>>) {
    this.tellMain(subject, {
      ...extra,
      forwardToRenderer: true,
      shouldNotify: true,
    });
  }

  tellMainForRenderer(subject: string, extra?: Partial<Omit<WorkerMessage, 'subject' | 'forwardToRenderer'>>) {
    this.tellMain(subject, {
      ...extra,
      forwardToRenderer: true,
    });
  }

  /**
   * Listen events as a worker from the main process.
   */
  protected listenEventsAsWorker(): void {
    process.parentPort.on('message', (e) => {
      this.handleMessageAsWorker(e.data as MainMessage);
    });
  }

  /**
   * Listen events as main process from the worker.
   */
  protected listenEventsAsMain(): void {
    this.worker?.on('message', (e: WorkerMessage) => {
      if (e.forwardToRenderer) {
        browserWindow.webContents.send('messageToRenderer', e);
      }

      this.handleMessageAsMain(e);
    });
  }

  protected async handleMessageAsMain(_e: WorkerMessage): Promise<void> {
    return;
  }

  protected async handleMessageAsWorker(_e: MainMessage): Promise<void> {
    return;
  }
}
