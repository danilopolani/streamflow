import { type NotificationReactive } from 'naive-ui';
import { reactive } from 'vue';
import { ConnectionStatus } from '../../shared/enums/ConnectionStatus';

type StoreType = {
  shouldNotifyOBSEstablishedConnection: boolean
  shouldNotifyTwitchEstablishedConnection: boolean
  obsRetryingNotification?: NotificationReactive
  connectionStatus: ConnectionStatusType
}

type ConnectionStatusType = {
  obsWebSocket: ConnectionStatus
  twitch: ConnectionStatus
}

export const store = reactive<StoreType>({
  shouldNotifyOBSEstablishedConnection: false,
  shouldNotifyTwitchEstablishedConnection: false,
  obsRetryingNotification: undefined,
  connectionStatus: {
    obsWebSocket: ConnectionStatus.Pending,
    twitch: ConnectionStatus.Pending,
  },
});
