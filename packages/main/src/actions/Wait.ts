import { Action } from './Action';
import { actionKey, actionName, type ActionOptions } from '~shared/actions/wait';

export const Wait = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(previousOptions: object, actionOptions: ActionOptions): Promise<object> {
    await new Promise((f) => setTimeout(f, actionOptions.time * 1000));

    return previousOptions;
  }
};
