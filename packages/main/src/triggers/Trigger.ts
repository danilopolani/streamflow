export abstract class Trigger {
  public abstract key: string;

  public getCooldown(_triggerOptions: object): number {
    return 0;
  }
}
