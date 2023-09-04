import type { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub-base';
import { Workflow } from '/@/database/models/Workflow';
import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';
import enqueueWorkflow from '/@/workflows/enqueue';
import { TwitchRewardRedemption, type TwitchRewardRedemptionOptions } from '/@/triggers/twitch/RewardRedemption';

export class OnRewardRedemption {
  async handle(data: EventSubChannelRedemptionAddEvent) {
    const matchingWorkflows = await Workflow.findAll({
      include: [
        {
          model: WorkflowTrigger,
          as: 'triggers',
          where: {
            trigger: TwitchRewardRedemption.key,
          },
        },
      ],
    });

    for (const workflow of matchingWorkflows) {
      for (const trigger of workflow.triggers) {
        if (await this.evaluateTrigger(trigger, data.rewardTitle)) {
          enqueueWorkflow(workflow, trigger, {
            triggerUsername: data.userDisplayName,
            triggerRewardCost: data.rewardCost,
            triggerRewardInput: data.input,
          });
        }
      }
    }
  }

  private async evaluateTrigger(trigger: WorkflowTrigger, rewardName: string) {
    if (trigger.trigger !== TwitchRewardRedemption.key) {
      return false;
    }

    return TwitchRewardRedemption.evaluate({ rewardName }, trigger.options as TwitchRewardRedemptionOptions);
  }
}
