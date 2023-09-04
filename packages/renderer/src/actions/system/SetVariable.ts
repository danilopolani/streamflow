import { Action } from '../Action';
import { actionKey, actionName } from '~shared/actions/system/setVariable';

export const SetVariable = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Set a variable from a value or lambda call';
};
