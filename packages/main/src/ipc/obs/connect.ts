import { OBSWebSocket } from '/@/workers/OBSWebSocket';
import { Setting } from '/@/database/models/Setting';
import { SettingName } from '/@/enums';
import type { ObsWebSocketSettings } from '~shared/ObsWebSocketSettings';

export default async function obsConnect(_event: Electron.IpcMainInvokeEvent, settings: ObsWebSocketSettings) {
  await Setting.upsert({
    name: SettingName.ObsAuth,
    value: settings,
  });

  const error = await OBSWebSocket.connect(false);

  if (error) {
    await (await Setting.findByPk(SettingName.ObsAuth))?.destroy();
  }

  return error;
}
