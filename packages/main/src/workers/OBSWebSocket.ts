const { default: OBSWebSocketLib } = require('obs-websocket-js');
import { desktopCapturer } from 'electron';
import type OBSWebSocketType from 'obs-websocket-js';
import { log } from '/@/logger';
import { Setting } from '../database/models/Setting';
import { SettingName } from '../enums';
import { inWorkerContext, tellRenderer } from '../helpers';
import { IntegrationConnectionStatus } from '~shared/enums/ConnectionStatus';
import { ObsWebSocketSubject, type ObsWebSocketSettings } from '~shared/ObsWebSocketSettings';

export const OBSWebSocket = new class {
  private obs: OBSWebSocketType;
  private isDisconncting = false;
  private isObsOpen = false;
  private isConnected = false;
  private settings?: Setting<ObsWebSocketSettings>;

  constructor() {
    this.obs = new OBSWebSocketLib();
  }

  async init() {
    this.settings = (await this.getSettings()) || undefined;

    if (!this.settings) {
      tellRenderer({
        subject: ObsWebSocketSubject.Connection,
        message: IntegrationConnectionStatus.ObsConnectionToConfigure,
        details: 'Connection needs configuration',
      });
    }

    // Refresh app status check from time to time
    setInterval(() => this.verifyObsOpen(), 1000);
  }

  /**
   * Connect OBS WebSocket.
   */
  async connect(shouldNotifyError = true): Promise<string | undefined> {
    this.settings = (await this.getSettings()) || undefined;

    if (!this.settings) {
      tellRenderer({
        subject: ObsWebSocketSubject.Connection,
        message: IntegrationConnectionStatus.ObsConnectionToConfigure,
        details: 'Connection needs configuration',
      });

      return;
    }

    try {
      await this.obs.connect(`ws://${this.settings.value.host}:${this.settings.value.port}`, this.settings.value.password);

      log.info('%c[OBS WebSocket] %cConnection established', 'color: blue', 'color: unset');

      this.listenObsEvents();

      this.isConnected = true;

      tellRenderer({
        subject: ObsWebSocketSubject.Connection,
        message: IntegrationConnectionStatus.ObsConnectionEstablished,
      });
    } catch (err) {
      log.error('%c[OBS WebSocket] %cConnection failed: ' + err, 'color: blue', 'color: unset');

      this.isConnected = false;

      if (this.isObsOpen && shouldNotifyError) {
        tellRenderer({
          subject: ObsWebSocketSubject.Connection,
          message: IntegrationConnectionStatus.ObsConnectionFailed,
          details: (err as Error).message,
          shouldNotify: true,
        });
      }

      return (err as Error).message;
    }

    this.refreshSources();
  }

  /**
   * Disconnect OBS WebSocket.
   */
  disconnect() {
    this.isDisconncting = true;

    this.obs.disconnect();

    tellRenderer({
      subject: ObsWebSocketSubject.Connection,
      message: IntegrationConnectionStatus.ObsConnectionToConfigure,
      details: 'Disconnected by user',
    });
  }

  async mute(source: string) {
    await this.obs.call('SetInputMute', { inputName: source, inputMuted: true });
  }

  async unmute(source: string) {
    await this.obs.call('SetInputMute', { inputName: source, inputMuted: false });
  }

  async getSettings() {
    return (Setting<ObsWebSocketSettings>).findByPk(SettingName.ObsAuth);
  }

  private async verifyObsOpen() {
    // Avoid issues when this file is minified in actual workers such as WorkflowQueue
    if (inWorkerContext()) {
      return;
    }

    // If connection is open, app is open too 100%
    if (this.isConnected) {
      return;
    }

    const res = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    const isOpen = res.find((item) => item.name.toLocaleLowerCase().includes('obs')) !== undefined;

    // If app was closed and now is open, retrying connection
    if (!this.isObsOpen && isOpen && this.settings) {
      this.connect();
    }

    this.isObsOpen = isOpen;

    tellRenderer({
      subject: ObsWebSocketSubject.AppStatus,
      message: Number(this.isObsOpen).toString(),
    });
  }

  private async refreshSources() {
    const { inputs } = await this.obs.call('GetInputList');

    tellRenderer({
      subject: ObsWebSocketSubject.Sources,
      message: JSON.stringify(inputs),
    });
  }

  /**
   * Listent to OBS events.
   */
  private listenObsEvents(): void {
    // Listen to connection closed
    this.obs.once('ConnectionClosed', (e) => {
      // Do nothing if user just wants to disconnect
      if (this.isDisconncting) {
        this.isDisconncting = false;

        return;
      }

      this.isConnected = false;

      log.warn('%c[OBS WebSocket] %cConnection closed: ' + e.message, 'color: blue', 'color: unset');

      tellRenderer({
        subject: ObsWebSocketSubject.Connection,
        message: IntegrationConnectionStatus.ObsConnectionClosed,
        details: e.message,
        shouldNotify: true,
      });
    });

    this.obs.on('InputCreated', this.refreshSources.bind(this));
    this.obs.on('InputRemoved', this.refreshSources.bind(this));
    this.obs.on('InputNameChanged', this.refreshSources.bind(this));
  }
};
