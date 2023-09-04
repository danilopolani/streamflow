import { type TwitchSettings } from '~shared/TwitchSettings';
import { Setting } from '/@/database/models/Setting';
import { SettingName } from '/@/enums';
import { Twitch } from '../workers/Twitch';

export async function twitchGetSettings(): Promise<TwitchSettings | undefined> {
  return (await (Setting<TwitchSettings>).findByPk(SettingName.TwitchAuth))?.value;
}

export async function twitchDisconnect() {
  Twitch.disconnect();
}
