import { RefreshingAuthProvider, exchangeCode } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { callTwitchApi } from '@twurple/api-call';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import type { HelixUserData } from '@twurple/api/lib/interfaces/endpoints/user.external';
import type { WorkerMessage } from '~shared/WorkerMessage';
import { IntegrationConnectionStatus } from '~shared/enums/ConnectionStatus';
import type { Reward } from '~shared/TwitchSettings';
import { TwitchSubject, type TwitchSettings } from '~shared/TwitchSettings';
import { Setting } from '../database/models/Setting';
import { SettingName } from '../enums';
import { tellRenderer } from '../helpers';
import { OnMessage } from '../events/twitch/OnMessage';
import { log } from '../logger';
import { OnRewardRedemption } from '../events/twitch/OnRewardRedemption';

enum Subject {
  Connection = 'TWITCH_CONNECTION',
}

export const Twitch = new class {
  private authProvider?: RefreshingAuthProvider;
  private apiClient?: ApiClient;
  private settings?: Setting<TwitchSettings>;
  private chatClient?: ChatClient;
  private eventSubClient?: EventSubWsListener;

  init(clientId: string, clientSecret: string) {
    this.authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
    });

    this.apiClient = new ApiClient({ authProvider: this.authProvider });

    return this;
  }

  /**
   * Get the required Twitch scopes to let the app work.
   */
  getScopes() {
    return ['chat:read', 'chat:edit', 'channel:read:redemptions'];
  }

  /**
   * Get the current chat client.
   */
  getChatClient() {
    return this.chatClient;
  }

  /**
   * Finalize a OAuth Authorization flow and save the data in the DB.
   */
  async finalizeAuth(code: string, redirectUri: string) {
    const tokenData = await exchangeCode(
      process.env.TWITCH_CLIENT_ID!,
      process.env.TWITCH_CLIENT_SECRET!,
      code,
      redirectUri,
    );

    const currentUser = await callTwitchApi<{ data: HelixUserData[] }>(
      { url: 'users' },
      process.env.TWITCH_CLIENT_ID!,
      tokenData.accessToken,
    );

    Setting.upsert({
      name: SettingName.TwitchAuth,
      value: {
        ...tokenData,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken!,
        userId: currentUser.data[0].id,
        userName: currentUser.data[0].display_name,
        pictureUrl: currentUser.data[0].profile_image_url,
        isPartner: currentUser.data[0].broadcaster_type === 'partner',
        scopes: this.getScopes(),
      } satisfies TwitchSettings,
    });

    this.connect();
  }

  /**
   * Connect to Twitch.
   */
  async connect() {
    this.settings = (await this.getSettings()) || undefined;

    if (!this.settings) {
      tellRenderer({
        subject: Subject.Connection,
        message: IntegrationConnectionStatus.TwitchConnectionToConfigure,
        details: 'Connection needs configuration',
      } as WorkerMessage);

      return;
    }

    this.authProvider?.onRefresh(async (_userId, tokenData) =>
      this.settings?.update('value', {
        ...this.settings.value,
        ...tokenData,
      }),
    );

    try {
      this.authProvider?.addUser(this.settings.value.userId, this.settings.value, ['chat']);

      const user = await this.apiClient?.users.getUserById(this.settings.value.userId);

      // Update some data as it might have changed
      this.settings.update('value', {
        ...this.settings.value,
        userName: user!.displayName,
        pictureUrl: user!.profilePictureUrl,
        isPartner: user!.broadcasterType === 'partner',
      });

      // New scopes have been added
      if ([...this.settings.value.scopes].sort().toString() !== [...this.getScopes()].sort().toString()) {
        log.info('%c[Twitch] %cConnection established but needs upgrade', 'color: magenta', 'color: unset');

        tellRenderer({
          subject: Subject.Connection,
          message: IntegrationConnectionStatus.TwitchConnectionEstablishedUpgradable,
        });
      } else {
        log.info('%c[Twitch] %cConnection established', 'color: magenta', 'color: unset');

        tellRenderer({
          subject: Subject.Connection,
          message: IntegrationConnectionStatus.TwitchConnectionEstablished,
        });
      }
    } catch (e) {
      log.error('%c[Twitch] %cConnection failed: ' + (e as Error).message, 'color: magenta', 'color: unset');

      tellRenderer({
        subject: Subject.Connection,
        message: IntegrationConnectionStatus.TwitchConnectionFailed,
        details: (e as Error).message,
        shouldNotify: true,
      });

      return;
    }

    this.refreshRewards();
    this.connectBot();
    this.connectEventSub();
  }

  /**
   * Disconnect Twitch.
   */
  disconnect() {
    this.settings?.destroy();
    this.chatClient?.quit();
    this.chatClient = undefined;
    this.eventSubClient?.stop();
    this.eventSubClient = undefined;

    tellRenderer({
      subject: Subject.Connection,
      message: IntegrationConnectionStatus.TwitchConnectionToConfigure,
      details: 'Disconnected by user',
    });
  }

  connectBot() {
    if (!this.settings || !this.authProvider) {
      return;
    }

    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      channels: [this.settings.value.userName],
    });

    this.chatClient.connect();

    this.chatClient.onAuthenticationSuccess(() => log.info('%c[Twitch] %cBot connected', 'color: magenta', 'color: unset'));
    this.chatClient.onAuthenticationFailure((err) => log.error('%c[Twitch] %cBot connection failed: ' + err, 'color: magenta', 'color: unset'));

    this.chatClient.onMessage((channel, user, text, message) => new OnMessage(this.chatClient!).handle(channel, user, text, message));
  }

  connectEventSub() {
    if (!this.settings || !this.authProvider || !this.apiClient) {
      return;
    }

    this.eventSubClient = new EventSubWsListener({
      apiClient: this.apiClient,
    });

    this.eventSubClient.start();

    this.eventSubClient.onChannelRedemptionAdd(this.settings.value.userId, (data) => new OnRewardRedemption().handle(data));

    this.eventSubClient.onChannelRewardAdd(this.settings.value.userId, this.refreshRewards.bind(this));
    this.eventSubClient.onChannelRewardUpdate(this.settings.value.userId, this.refreshRewards.bind(this));
    this.eventSubClient.onChannelRewardRemove(this.settings.value.userId, this.refreshRewards.bind(this));
  }

  async getSettings() {
    return (Setting<TwitchSettings>).findByPk(SettingName.TwitchAuth);
  }

  private async refreshRewards() {
    if (!this.apiClient || !this.settings) {
      return;
    }

    try {
      const rewards = await this.apiClient.channelPoints.getCustomRewards(this.settings.value.userId);

      tellRenderer({
        subject: TwitchSubject.Rewards,
        message: JSON.stringify(rewards.map((item) => ({
          title: item.title,
          cost: item.cost,
          imageUrl: item.getImageUrl(1),
          backgroundColor: item.backgroundColor,
        } as Reward))),
      });
    } catch (_err) {
      // Ignore it, we don't care tbh
    }
  }
};
