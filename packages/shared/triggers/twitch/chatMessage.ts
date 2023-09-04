export enum MessageExprOperator {
  StartsWith = 'STARTS_WITH',
  EndsWith = 'ENDS_WITH',
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
}

export enum MinimumUserRole {
  Streamer = 'STREAMER',
  Mod = 'MOD',
  Vip = 'VIP',
  Subscriber = 'SUBSCRIBER',
  Everyone = 'EVERYONE'
}

export type TriggerOptions = {
  isCommand: boolean
  messageConstraints: {
    exprOperator: MessageExprOperator,
    exprValue: string | null
  }
  minimumUserRole: MinimumUserRole
  cooldown: number
  alias: string[]
}

export const triggerKey = 'TWITCH.CHAT_MESSAGE';

export const triggerName = 'Command / Chat message';
