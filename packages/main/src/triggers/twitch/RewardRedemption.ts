import { Trigger } from '../Trigger';
import { triggerKey, triggerName, type TriggerOptions } from '~shared/triggers/twitch/rewardRedemption';

type EvaluateArgs = {
  rewardName: string;
};

export type TwitchRewardRedemptionOptions = TriggerOptions;

export const TwitchRewardRedemption = new class extends Trigger {
  public key = triggerKey;
  public name = triggerName;

  async evaluate(args: EvaluateArgs, triggerOptions: TriggerOptions): Promise<boolean> {
    return args.rewardName.toLocaleLowerCase() === triggerOptions.rewardName.toLocaleLowerCase();
  }
};
