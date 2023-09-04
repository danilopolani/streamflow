import { Action } from '../Action';
import { actionKey, actionName } from '~shared/actions/obs/unmute';

export const ObsUnmute = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Unmute a OBS source';
};
