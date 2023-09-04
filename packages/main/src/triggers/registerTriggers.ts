import { triggerKey as twitchChatMessageTriggerKey } from '~shared/triggers/twitch/chatMessage';
import { triggerKey as twitchRewardRedemptionTriggerKey } from '~shared/triggers/twitch/rewardRedemption';
import { TwitchChatMessage } from './twitch/ChatMessage';
import { TwitchRewardRedemption } from './twitch/RewardRedemption';

export default {
  [twitchChatMessageTriggerKey]: TwitchChatMessage,
  [twitchRewardRedemptionTriggerKey]: TwitchRewardRedemption,
};
