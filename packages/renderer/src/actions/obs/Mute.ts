import { Action } from '../Action';
import { actionKey, actionName } from '~shared/actions/obs/mute';

export const ObsMute = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Mute a OBS source';
};
