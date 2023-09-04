import { keyboard } from '@nut-tree/nut-js';
import { Action } from './Action';
import {
  actionKey,
  actionName,
  type ActionOptions,
  Type as KeyboardType,
} from '../../../shared/actions/keyboard';

export const Keyboard = new class extends Action {
  public key = actionKey;

  public name = actionName;

  async run(_previousOptions: object, actionOptions: ActionOptions): Promise<object> {
    keyboard.config.autoDelayMs = 0;

    if (actionOptions.type === KeyboardType.Text) {
      await keyboard.type(actionOptions.text!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    } else {
      await keyboard.type(...actionOptions.shortcut);
    }

    return _previousOptions;
  }
};
