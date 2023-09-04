import { type ObsWebSocketSettings } from '~shared/ObsWebSocketSettings';
import { Setting } from '/@/database/models/Setting';
import { SettingName } from '/@/enums';

export default async function obsGetSettings(): Promise<ObsWebSocketSettings | undefined> {
  return (await (Setting<ObsWebSocketSettings>).findByPk(SettingName.ObsAuth))?.value;
}
