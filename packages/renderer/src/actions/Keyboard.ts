import { Action } from './Action';
import {
  actionKey,
  actionName,
} from '../../../shared/actions/keyboard';

export const Keyboard = new class extends Action {
  public key = actionKey;

  public name = actionName;

  public description = 'Emulate keyboard typing or a shortcut';
};
