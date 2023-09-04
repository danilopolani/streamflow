import { actionKey as keyboardActionKey } from '~shared/actions/keyboard';
import { actionKey as waitActionKey } from '~shared/actions/wait';
import { actionKey as setVariableActionKey } from '~shared/actions/system/setVariable';
import { actionKey as twitchReplyActionKey } from '~shared/actions/twitch/reply';
import { actionKey as obsMuteActionKey } from '~shared/actions/obs/mute';
import { actionKey as obsUnmuteActionKey } from '~shared/actions/obs/unmute';
import { Keyboard } from './Keyboard';
import { Wait } from './Wait';
import { SetVariable } from './system/SetVariable';
import { TwitchReply } from './twitch/Reply';
import { ObsMute } from './obs/Mute';
import { ObsUnmute } from './obs/Unmute';

export default {
  // System
  [keyboardActionKey]: Keyboard,
  [setVariableActionKey]: SetVariable,
  [waitActionKey]: Wait,

  // Twitch
  [twitchReplyActionKey]: TwitchReply,

  // OBS
  [obsMuteActionKey]: ObsMute,
  [obsUnmuteActionKey]: ObsUnmute,
};
