import { CooldownManager } from '../src/workers/Cooldown';
import { describe, it, expect } from 'vitest';

describe('Cooldown manager', () => {
  it('returns true when a cooldown is set and the time has not passed yet', () => {
    CooldownManager.setCooldown('1', '2', 1);

    expect(CooldownManager.isOnCooldown('1', '2')).toBe(true);
    expect(CooldownManager.isOnCooldown('2', '1')).toBe(false);
    expect(CooldownManager.isOnCooldown('1', '1')).toBe(false);
  });

  it('returns false when a cooldown is set and the time has passed', async () => {
    CooldownManager.setCooldown('1', '2', 1);

    await (new Promise((resolve) => setTimeout(resolve, 1100)));

    expect(CooldownManager.isOnCooldown('1', '2')).toBe(false);
    expect(CooldownManager.isOnCooldown('2', '1')).toBe(false);
    expect(CooldownManager.isOnCooldown('1', '1')).toBe(false);
  });
});
