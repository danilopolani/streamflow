import { actionKey, actionName, QueueToMainSubject, type ActionOptions } from '~shared/actions/obs/mute';
import { compileTemplate, inWorkerContext, tellMain } from '/@/helpers';
import { Action } from '../Action';
import { OBSWebSocket } from '/@/workers/OBSWebSocket';

type PreviousOptions = {
  [key: string]: any
}

export const ObsMute = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(previousOptions: PreviousOptions, actionOptions: ActionOptions): Promise<object> {
    const source = compileTemplate(actionOptions.source, previousOptions);

    if (inWorkerContext()) {
      tellMain(QueueToMainSubject, {
        message: source,
      });
    } else {
      await this.exec(source);
    }

    return previousOptions;
  }

  async exec(source: string) {
    return OBSWebSocket.mute(source);
  }
};
