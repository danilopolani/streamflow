import { actionKey, actionName, QueueToMainSubject, type ActionOptions } from '~shared/actions/twitch/reply';
import { Twitch } from '/@/workers/Twitch';
import { compileTemplate, inWorkerContext, tellMain } from '/@/helpers';
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

    const execArgs = [
      previousOptions.triggerChannel,
      messageText,
      { replyTo: previousOptions.triggerMessageId },
    ];

    if (inWorkerContext()) {
      tellMain(QueueToMainSubject, {
        message: JSON.stringify(execArgs),
      });
    } else {
      await this.exec(...execArgs as [string, string, object]);
    }

    return previousOptions;
  }

  async exec(...args: [string, string, object]) {
    return Twitch.getChatClient()?.say(...args);
  }
};
