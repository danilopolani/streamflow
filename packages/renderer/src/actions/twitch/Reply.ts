import { Action } from '../Action';
import { actionKey, actionName } from '~shared/actions/twitch/reply';

export const TwitchReply = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Reply to the trigger message';
};
