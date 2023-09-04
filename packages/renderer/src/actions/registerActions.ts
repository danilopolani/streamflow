import { LogoTwitch } from '@vicons/ionicons5';
import { Code24Regular } from '@vicons/fluent';
import { h, type Component } from 'vue';
import { type Action } from './Action';
import { Keyboard } from './Keyboard';
import { SetVariable } from './system/SetVariable';
import { Wait } from './Wait';
import { TwitchReply } from './twitch/Reply';
import { ObsMute } from './obs/Mute';
import { ObsUnmute } from './obs/Unmute';

type ActionCategory = {
  name: string
  icon: Component
  children: Action[]
}

export const AllActions: ActionCategory[] = [
  {
    name: 'OBS',
    icon: h('svg', { viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', {
        fill: 'currentColor',
        d: 'M12 24C5.383 24 0 18.617 0 12S5.383 0 12 0s12 5.383 12 12s-5.383 12-12 12zm0-22.891C5.995 1.109 1.11 5.995 1.11 12S5.995 22.89 12 22.89S22.89 18.005 22.89 12c0-6.005-4.885-10.891-10.89-10.891zM6.182 5.99c.352-1.698 1.503-3.229 3.05-3.996c-.269.273-.595.483-.844.78c-1.02 1.1-1.48 2.692-1.199 4.156c.355 2.235 2.455 4.06 4.732 4.028c1.765.079 3.485-.937 4.348-2.468c1.848.063 3.645 1.017 4.7 2.548c.54.799.962 1.736.991 2.711c-.342-1.295-1.202-2.446-2.375-3.095a4.892 4.892 0 0 0-3.772-.425c-1.56.448-2.849 1.723-3.293 3.293c-.377 1.25-.216 2.628.377 3.772c-.825 1.429-2.315 2.449-3.932 2.756c-1.244.261-2.551.059-3.709-.464c1.036.302 2.161.355 3.191-.011a4.913 4.913 0 0 0 3.024-2.935c.556-1.49.345-3.261-.591-4.54c-.7-1.007-1.803-1.717-3.002-1.969c-.38-.068-.764-.098-1.148-.134c-.611-1.231-.834-2.66-.528-3.996l-.02-.011z',
      }),
    ]),
    children: [
      ObsMute,
      ObsUnmute,
    ],
  },
  {
    name: 'System robot',
    icon: Code24Regular,
    children: [
      Keyboard,
      SetVariable,
      Wait,
    ],
  },
  {
    name: 'Twitch',
    icon: LogoTwitch,
    children: [
      TwitchReply,
    ],
  },
];

export function getActionClass(actionKey: string): Action {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AllActions
    .flatMap((category) => category.children)
    .find((action) => action.key === actionKey)!;
}

export function getActionCategory(actionKey: string): ActionCategory {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return AllActions.find((category) => category
    .children
    .some((action) => action.key === actionKey),
  )!;
}
