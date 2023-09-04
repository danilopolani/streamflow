import { OBSWebSocket } from '/@/workers/OBSWebSocket';
import { Setting } from '/@/database/models/Setting';
import { SettingName } from '/@/enums';

export default async function obsDisconnect() {
  await (await Setting.findByPk(SettingName.ObsAuth))?.destroy();

  OBSWebSocket.disconnect();
}
