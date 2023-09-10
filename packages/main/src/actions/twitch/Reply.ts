import { actionKey, actionName, type ActionOptions } from '~shared/actions/twitch/reply';
import { Twitch } from '/@/workers/Twitch';
import { compileTemplate } from '/@/helpers';
import { Action } from '../Action';


type PreviousOptions = {
  [key: string]: any
  triggerChannel: string
  triggerUsername: string
  triggerMessageId: string
}

export const TwitchReply = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(previousOptions: PreviousOptions, actionOptions: ActionOptions): Promise<object> {
    const messageText = compileTemplate(actionOptions.text, previousOptions);

    await Twitch.getChatClient()?.say(
      previousOptions.triggerChannel,
      messageText,
      { replyTo: previousOptions.triggerMessageId },
    );

    return previousOptions;
  }
};
