import { Action } from './Action';
import { actionKey, actionName } from '~shared/actions/wait';

export const Wait = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Wait a defined number of seconds';
};
