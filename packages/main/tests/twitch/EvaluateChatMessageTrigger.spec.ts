import type { ChatUser } from '@twurple/chat/lib/ChatUser';
import { evaluateCommand, evaluateMessageConstraint, evaluateUserRole } from '../../src/triggers/twitch/ChatMessage';
import type { TriggerOptions } from '../../../shared/triggers/twitch/chatMessage';
import { MessageExprOperator, MinimumUserRole } from '../../../shared/triggers/twitch/chatMessage';
import { describe, it } from 'vitest';

describe.concurrent('user role', () => {
  it('always returns true if the minimum role is Everyone', ({ expect }) => {
    const availableRoles = Object.values(MinimumUserRole).filter((role) => role !== MinimumUserRole.Everyone);

    for (const role of availableRoles) {
      const user = {
        isBroadcaster: role === MinimumUserRole.Streamer,
        isMod: role === MinimumUserRole.Mod,
        isVip: role === MinimumUserRole.Vip,
        isSubscriber: role === MinimumUserRole.Subscriber,
      } as ChatUser;

      expect(evaluateUserRole(user, MinimumUserRole.Everyone)).toBe(true);
    }
  });

  it('returns true only for Broadcaster when the minimum role is Streamer', ({ expect }) => {
    const availableRoles = Object.values(MinimumUserRole).filter((role) => role !== MinimumUserRole.Everyone);
    const allowedRoles = [MinimumUserRole.Streamer];

    for (const role of availableRoles) {
      const user = {
        isBroadcaster: role === MinimumUserRole.Streamer,
        isMod: role === MinimumUserRole.Mod,
        isVip: role === MinimumUserRole.Vip,
        isSubscriber: role === MinimumUserRole.Subscriber,
      } as ChatUser;

      expect(evaluateUserRole(user, MinimumUserRole.Streamer)).toBe(allowedRoles.includes(role));
    }
  });

  it('returns true for Broadcaster and Mod when the minimum role is Mod', ({ expect }) => {
    const availableRoles = Object.values(MinimumUserRole).filter((role) => role !== MinimumUserRole.Everyone);
    const allowedRoles = [MinimumUserRole.Streamer, MinimumUserRole.Mod];

    for (const role of availableRoles) {
      const user = {
        isBroadcaster: role === MinimumUserRole.Streamer,
        isMod: role === MinimumUserRole.Mod,
        isVip: role === MinimumUserRole.Vip,
        isSubscriber: role === MinimumUserRole.Subscriber,
      } as ChatUser;

      expect(evaluateUserRole(user, MinimumUserRole.Mod)).toBe(allowedRoles.includes(role));
    }
  });

  it('returns true for Broadcaster, Mod and Vip when the minimum role is Vip', ({ expect }) => {
    const availableRoles = Object.values(MinimumUserRole).filter((role) => role !== MinimumUserRole.Everyone);
    const allowedRoles = [MinimumUserRole.Streamer, MinimumUserRole.Mod, MinimumUserRole.Vip];

    for (const role of availableRoles) {
      const user = {
        isBroadcaster: role === MinimumUserRole.Streamer,
        isMod: role === MinimumUserRole.Mod,
        isVip: role === MinimumUserRole.Vip,
        isSubscriber: role === MinimumUserRole.Subscriber,
      } as ChatUser;

      expect(evaluateUserRole(user, MinimumUserRole.Vip)).toBe(allowedRoles.includes(role));
    }
  });

  it('returns true for Broadcaster, Mod and Vip when the minimum role is Subscriber', ({ expect }) => {
    const availableRoles = Object.values(MinimumUserRole).filter((role) => role !== MinimumUserRole.Everyone);
    const allowedRoles = [MinimumUserRole.Streamer, MinimumUserRole.Mod, MinimumUserRole.Vip, MinimumUserRole.Subscriber];

    for (const role of availableRoles) {
      const user = {
        isBroadcaster: role === MinimumUserRole.Streamer,
        isMod: role === MinimumUserRole.Mod,
        isVip: role === MinimumUserRole.Vip,
        isSubscriber: role === MinimumUserRole.Subscriber,
      } as ChatUser;

      expect(evaluateUserRole(user, MinimumUserRole.Subscriber)).toBe(allowedRoles.includes(role));
    }
  });
});

describe.concurrent('message constraint', () => {
  it('matches the operator StartsWith', ({ expect }) => {
    const constraint = {
      exprOperator: MessageExprOperator.StartsWith,
      exprValue: '!command',
    } as TriggerOptions['messageConstraints'];

    expect(evaluateMessageConstraint(constraint, 'command')).toBe(false);
    expect(evaluateMessageConstraint(constraint, 'command foo')).toBe(false);
    expect(evaluateMessageConstraint(constraint, '! command')).toBe(false);
    expect(evaluateMessageConstraint(constraint, '! command foo')).toBe(false);
    expect(evaluateMessageConstraint(constraint, 'foo')).toBe(false);
    expect(evaluateMessageConstraint(constraint, '')).toBe(false);

    expect(evaluateMessageConstraint(constraint, '!command')).toBe(true);
    expect(evaluateMessageConstraint(constraint, '!command foo')).toBe(true);
    expect(evaluateMessageConstraint(constraint, '!CommAnD')).toBe(true);
    expect(evaluateMessageConstraint(constraint, '!CommAnD foo')).toBe(true);
  });

  it('matches the operator EndsWith', ({ expect }) => {
    const constraint = {
      exprOperator: MessageExprOperator.EndsWith,
      exprValue: '[end]',
    } as TriggerOptions['messageConstraints'];

    expect(evaluateMessageConstraint(constraint, 'foo')).toBe(false);
    expect(evaluateMessageConstraint(constraint, 'nd]')).toBe(false);
    expect(evaluateMessageConstraint(constraint, '[en')).toBe(false);
    expect(evaluateMessageConstraint(constraint, '')).toBe(false);

    expect(evaluateMessageConstraint(constraint, 'foo[end]')).toBe(true);
    expect(evaluateMessageConstraint(constraint, 'foo [end]')).toBe(true);
    expect(evaluateMessageConstraint(constraint, 'foo[EnD]')).toBe(true);
    expect(evaluateMessageConstraint(constraint, 'foo [EnD]')).toBe(true);
  });

  it('matches the operator Contains', ({ expect }) => {
    const constraint = {
      exprOperator: MessageExprOperator.Contains,
      exprValue: 'greet',
    } as TriggerOptions['messageConstraints'];

    expect(evaluateMessageConstraint(constraint, 'can you gret me')).toBe(false);
  });

  it('matches the operator Equals', ({ expect }) => {
    const constraint = {
      exprOperator: MessageExprOperator.Equals,
      exprValue: '!dice',
    } as TriggerOptions['messageConstraints'];

    expect(evaluateMessageConstraint(constraint, '! dice')).toBe(false);
  });
});

describe.concurrent('command', () => {
  it('matches the command', ({ expect }) => {
    const command = '!dice';

    expect(evaluateCommand(command, '!dice2')).toBe(false);
    expect(evaluateCommand(command, '!!dice')).toBe(false);
    expect(evaluateCommand(command, '!dice')).toBe(true);
    expect(evaluateCommand(command, '!DICE')).toBe(true);
    expect(evaluateCommand(command, '!DIcE')).toBe(true);
    expect(evaluateCommand(command, '!DIcE 123')).toBe(true);
    expect(evaluateCommand(command, '!DIcE 123 foo bar')).toBe(true);
  });
});
