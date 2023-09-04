export abstract class Action {
  public abstract key: string;

  public abstract run(previousOptions: object, actionOptions: object): Promise<object>;
}
