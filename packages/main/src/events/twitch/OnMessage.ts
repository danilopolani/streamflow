import type { ChatClient } from '@twurple/chat';
import type { ChatMessage } from '@twurple/chat/lib/commands/ChatMessage';
import { Workflow } from '/@/database/models/Workflow';
import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';
import { TwitchChatMessage, type TwitchChatMessageOptions } from '/@/triggers/twitch/ChatMessage';
import { CooldownManager } from '/@/workers/Cooldown';
import enqueueWorkflow from '/@/workflows/enqueue';
import { log } from '/@/logger';

export class OnMessage {
  constructor(public readonly chatClient: ChatClient) {}

  async handle(channel: string, _user: string, _text: string, message: ChatMessage) {
    const matchingWorkflows = await Workflow.findAll({
      include: [
        {
          model: WorkflowTrigger,
          as: 'triggers',
          where: {
            trigger: TwitchChatMessage.key,
          },
        },
      ],
    });

    for (const workflow of matchingWorkflows) {
      for (const trigger of workflow.triggers) {
        if (await this.evaluateTrigger(trigger, message)) {
          const triggerCooldown = TwitchChatMessage.getCooldown(trigger.options as TwitchChatMessageOptions);

          if (triggerCooldown > 0 && CooldownManager.isOnCooldown(workflow.id, trigger.id)) {
            log.silly('%cSkipping workflow ' + workflow.name + ' because on cooldown', 'color: yellow');

            continue;
          }

          enqueueWorkflow(workflow, trigger, {
            triggerChannel: channel,
            triggerUsername: message.userInfo.userName,
            triggerMessageId: message.id,
          });

          // Set workflow on cooldown
          if (triggerCooldown > 0) {
            CooldownManager.setCooldown(workflow.id, trigger.id, triggerCooldown);
          }
        }
      }
    }
  }

  private async evaluateTrigger(trigger: WorkflowTrigger, message: ChatMessage) {
    if (trigger.trigger !== TwitchChatMessage.key) {
      return false;
    }

    return TwitchChatMessage.evaluate({ message }, trigger.options as TwitchChatMessageOptions);
  }
}
