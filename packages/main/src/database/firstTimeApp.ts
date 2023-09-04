import { Setting } from './models/Setting';
import { SettingName } from '../enums';
import { type GeneralSettings } from '~shared/settings/GeneralSettings';
import { set } from '../stores/general';
import { generalUpdateSettings } from '../ipc/general';

export default async () => {
  const settings = await (Setting<GeneralSettings>).findByPk(SettingName.General);

  await generalUpdateSettings(undefined, {
    startInTray: true,
    openOnStartup: true,
    // Always override our defaults with user customs
    ...settings?.value || {},
  });

  set('firstTimeInApp', settings === null);
  set('startInTray', settings ? settings.value.startInTray : true);
};
