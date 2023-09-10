import { actionKey, actionName, type ActionOptions } from '~shared/actions/obs/unmute';
import { compileTemplate } from '/@/helpers';
import { Action } from '../Action';
import { OBSWebSocket } from '/@/workers/OBSWebSocket';

type PreviousOptions = {
  [key: string]: any
}

export const ObsUnmute = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(previousOptions: PreviousOptions, actionOptions: ActionOptions): Promise<object> {
    await OBSWebSocket.unmute(compileTemplate(actionOptions.source, previousOptions));

    return previousOptions;
  }
};
