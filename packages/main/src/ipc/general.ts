import { app } from 'electron';
import { type GeneralSettings } from '~shared/settings/GeneralSettings';
import { Setting } from '/@/database/models/Setting';
import { SettingName } from '/@/enums';

export async function generalGetSettings(): Promise<GeneralSettings | undefined> {
  return (await (Setting<GeneralSettings>).findByPk(SettingName.General))?.value;
}

export async function generalUpdateSettings(_event: Electron.IpcMainInvokeEvent|undefined, data: GeneralSettings): Promise<void> {
  await Setting.upsert({
    name: SettingName.General,
    value: data,
  });

  app.setLoginItemSettings({
    openAtLogin: data.openOnStartup,
  });
}
