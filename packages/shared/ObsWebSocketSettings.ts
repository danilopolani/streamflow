export type ObsWebSocketSettings = {
  host: string
  port: string
  password: string
}

export type ObsWebSocketConnection = Pick<ObsWebSocketSettings, 'host' | 'port' | 'password'>;

export const ObsWebSocketSettingsDefaults: ObsWebSocketSettings = {
  host: '127.0.0.1',
  port: '4455',
  password: '',
};

export enum ObsWebSocketSubject {
  Connection = 'OBS_CONNECTION',
  AppStatus = 'OBS_APP_STATUS',
  Sources = 'OBS_SOURCES',
}
