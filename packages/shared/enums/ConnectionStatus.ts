import { type Type } from 'naive-ui/es/button/src/interface';

export enum ConnectionStatus {
  ToConfigure,
  Pending,
  Established,
  Upgradable,
  Failed
}

export enum IntegrationConnectionStatus {
  ObsConnectionToConfigure = 'OBS_CONNECTION_TO_CONFIGURE',
  ObsConnectionFailed = 'OBS_CONNECTION_FAILED',
  ObsConnectionClosed = 'OBS_CONNECTION_CLOSED',
  ObsConnectionEstablished = 'OBS_CONNECTION_ESTABLISHED',
  TwitchConnectionToConfigure = 'TWITCH_CONNECTION_TO_CONFIGURE',
  TwitchConnectionFailed = 'TWITCH_CONNECTION_FAILED',
  TwitchConnectionEstablished = 'TWITCH_CONNECTION_ESTABLISHED',
  TwitchConnectionEstablishedUpgradable = 'TWITCH_CONNECTION_ESTABLISHED_UPGRADABLE',
}

export function getStatusColorType(status: ConnectionStatus): Type {
  return {
    [ConnectionStatus.ToConfigure]: 'default',
    [ConnectionStatus.Pending]: 'info',
    [ConnectionStatus.Established]: 'success',
    [ConnectionStatus.Upgradable]: 'warning',
    [ConnectionStatus.Failed]: 'error',
  }[status] as Type;
}

export function getStatusLabel(status: ConnectionStatus): string {
  return {
    [ConnectionStatus.ToConfigure]: 'To configure',
    [ConnectionStatus.Pending]: 'Pending',
    [ConnectionStatus.Established]: 'Connected',
    [ConnectionStatus.Upgradable]: 'Needs upgrade',
    [ConnectionStatus.Failed]: 'Connection failed',
  }[status];
}
