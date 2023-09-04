import { h } from 'vue';
import { NButton } from 'naive-ui';
import { type Router } from 'vue-router';
import { type NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import { obsRetryConnection } from '#preload';
import { store } from '../store';

export default function obsConnectionFailedNotification(
  notification: NotificationApiInjection,
  router: Router,
  details?: string,
) {
  // Always reset the condition, for example if a connection fails after retrying it
  store.shouldNotifyOBSEstablishedConnection = false;

  const n = notification.create({
    title: 'OBS WebSocket',
    type: 'error',
    description: details,
    content: 'Connection to OBS WebSocket failed. Double check for settings or be sure OBS is open.',
    meta: () => h(
      NButton,
      {
        strong: true,
        secondary: true,
        type: 'warning',
        onClick: () => {
          n.destroy();

          store.shouldNotifyOBSEstablishedConnection = true;
          obsRetryConnection();
        },
      },
      {
        default: () => 'Retry',
      },
    ),
    action: () => h(
      NButton,
      {
        strong: true,
        secondary: true,
        type: 'success',
        onClick: () => {
          n.destroy();
          router.push('/settings/obs');
        },
      },
      {
        default: () => 'Fix it',
      },
    ),
  });
}
