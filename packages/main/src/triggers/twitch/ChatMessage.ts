import { Trigger } from '../Trigger';
import {
  MessageExprOperator,
  MinimumUserRole,
  triggerKey,
  triggerName,
  type TriggerOptions,
} from '~shared/triggers/twitch/chatMessage';
import type { ChatMessage, ChatUser } from '@twurple/chat';

type EvaluateArgs = {
  message: ChatMessage;
};

export type TwitchChatMessageOptions = TriggerOptions;

export const TwitchChatMessage = new class extends Trigger {
  public key = triggerKey;
  public name = triggerName;

  async evaluate(args: EvaluateArgs, triggerOptions: TriggerOptions): Promise<boolean> {
    if (!evaluateUserRole(args.message.userInfo, triggerOptions.minimumUserRole)) {
      return false;
    }

    if (triggerOptions.isCommand) {
      return evaluateCommand(triggerOptions.messageConstraints.exprValue!, args.message.text);
    }

    if (triggerOptions.messageConstraints.exprValue) {
      const availableValues = [
        triggerOptions.messageConstraints.exprValue,
        ...triggerOptions.alias.filter((alias) => alias !== ''),
      ];

      const doesMatchMessage = availableValues.some((exprValue) => evaluateMessageConstraint({
        exprOperator: triggerOptions.messageConstraints.exprOperator,
        exprValue,
      }, args.message.text));

      if (!doesMatchMessage) {
        return false;
      }
    }

    return true;
  }

  public getCooldown(triggerOptions: TriggerOptions) {
    return triggerOptions.cooldown;
  }
};

export function evaluateMessageConstraint(expr: TriggerOptions['messageConstraints'], incomingValue: string) {
  switch (expr.exprOperator) {
    case MessageExprOperator.StartsWith: {
      if (!incomingValue.toLocaleLowerCase().startsWith(expr.exprValue!.toLocaleLowerCase())) {
        return false;
      }

      break;
    }
    case MessageExprOperator.EndsWith: {
      if (!incomingValue.toLocaleLowerCase().endsWith(expr.exprValue!.toLocaleLowerCase())) {
        return false;
      }

      break;
    }
    case MessageExprOperator.Equals: {
      if (incomingValue.toLocaleLowerCase() !== expr.exprValue!.toLocaleLowerCase()) {
        return false;
      }

      break;
    }
    case MessageExprOperator.Contains: {
      if (!incomingValue.toLocaleLowerCase().includes(expr.exprValue!.toLocaleLowerCase())) {
        return false;
      }

      break;
    }
  }

  return true;
}

export function evaluateUserRole(user: ChatUser, minimumRole: MinimumUserRole) {
  if (minimumRole === MinimumUserRole.Everyone || user.isBroadcaster) {
    return true;
  }

  // Check for "minimum Mod"
  if (user.isMod && minimumRole === MinimumUserRole.Mod) {
    return true;
  }

  // Check for "minimum Vip"
  if ((user.isMod || user.isVip) && minimumRole === MinimumUserRole.Vip) {
    return true;
  }

  // Check for "minimum Subscriber"
  if ((user.isMod || user.isVip || user.isSubscriber) && minimumRole === MinimumUserRole.Subscriber) {
    return true;
  }

  return false;
}

export function evaluateCommand(command: string, message: string) {
  return message.toLocaleLowerCase() === command.toLocaleLowerCase()
    || message.toLocaleLowerCase().startsWith(command.toLocaleLowerCase() + ' ');
}
