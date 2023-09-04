import { Action } from '../Action';
import { actionKey, actionName, Type, type ActionOptions } from '~shared/actions/system/setVariable';
import { execLambda } from '/@/helpers';
import { log } from '/@/logger';

export const SetVariable = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(previousOptions: object, actionOptions: ActionOptions): Promise<object> {
    if (actionOptions.type === Type.Value) {
      return {
        ...previousOptions,
        [actionOptions.variableName]: actionOptions.value,
      };
    }

    let result;

    try {
      result = await execLambda(actionOptions.code!);
    } catch (err) {
      log.error('%cCannot exec Lambda ' + err, 'color: red');

      return previousOptions;
    }

    if (typeof result === 'undefined' || result === 'undefined' || !result) {
      return previousOptions;
    }

    return {
      ...previousOptions,
      [actionOptions.variableName]: result,
    };
  }
};
