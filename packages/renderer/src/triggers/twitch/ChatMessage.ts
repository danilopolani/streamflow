import { Trigger } from '../Trigger';
import { triggerKey, triggerName } from '~shared/triggers/twitch/chatMessage';

export const TwitchChatMessage = new class extends Trigger {
  public key = triggerKey;

  public name = triggerName;

  public description = 'New message or command in your channel chat';
};
