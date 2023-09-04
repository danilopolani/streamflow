export const CooldownManager = new class {
  private cooldowns = new Map<string, { cooldown: number; frozenAt: number }>();

  isOnCooldown(workflowId: string, targetId: string) {
    const cooldown = this.cooldowns.get(this.composeKey(workflowId, targetId));

    if (!cooldown) {
      return false;
    }

    return (new Date().getTime() / 1000) <= cooldown.frozenAt + cooldown.cooldown;
  }

  setCooldown(workflowId: string, targetId: string, cooldown: number) {
    this.cooldowns.set(
      this.composeKey(workflowId, targetId),
      {
        frozenAt: new Date().getTime() / 1000,
        cooldown,
      },
    );
  }

  private composeKey(workflowId: string, targetId: string) {
    return workflowId + ':' + targetId;
  }
};
