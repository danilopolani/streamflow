import { Trigger } from '../Trigger';
import { triggerKey, triggerName } from '~shared/triggers/twitch/rewardRedemption';

export const TwitchRewardRedemption = new class extends Trigger {
  public key = triggerKey;

  public name = triggerName;

  public description = 'Channel point reward redemption';
};
