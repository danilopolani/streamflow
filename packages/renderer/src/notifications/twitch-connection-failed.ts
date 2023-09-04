import { h } from 'vue';
import { NButton } from 'naive-ui';
import { type Router } from 'vue-router';
import { type NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import { store } from '../store';

export default function twitchConnectionFailedNotification(
  notification: NotificationApiInjection,
  router: Router,
  details?: string,
) {
  // Always reset the condition, for example if a connection fails after retrying it
  store.shouldNotifyTwitchEstablishedConnection = false;

  const n = notification.create({
    title: 'Twitch',
    type: 'error',
    description: details,
    content: 'Connection to Twitch failed. Try to disconnect and reconnect your account.',
    action: () => h(
      NButton,
      {
        strong: true,
        secondary: true,
        type: 'success',
        onClick: () => {
          n.destroy();
          router.push('/settings/twitch');
        },
      },
      {
        default: () => 'Fix it',
      },
    ),
  });
}
