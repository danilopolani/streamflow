import { LogoTwitch } from '@vicons/ionicons5';
import { type Component } from 'vue';
import { type Trigger } from './Trigger';
import { TwitchChatMessage } from './twitch/ChatMessage';
import { TwitchRewardRedemption } from './twitch/RewardRedemption';

type TriggerCategory = {
  name: string
  icon: Component
  children: Trigger[]
}

export const AllTriggers: TriggerCategory[] = [
  {
    name: 'Twitch',
    icon: LogoTwitch,
    children: [
      TwitchChatMessage,
      TwitchRewardRedemption,
    ],
  },
];

export function getTriggerClass(triggerKey: string): Trigger {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AllTriggers
    .flatMap((category) => category.children)
    .find((trigger) => trigger.key === triggerKey)!;
}

export function getTriggerCategory(triggerKey: string): TriggerCategory {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AllTriggers.find((category) => category
    .children
    .some((trigger) => trigger.key === triggerKey),
  )!;
}
