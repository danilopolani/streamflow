import { type NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import { store } from '../store';

export default function obsConnectionClosedNotification(
  notification: NotificationApiInjection,
  details?: string,
) {
  // Notify when the connection comes back
  store.shouldNotifyOBSEstablishedConnection = true;

  store.obsRetryingNotification = notification.create({
    title: 'OBS WebSocket',
    type: 'warning',
    description: details,
    content: 'Connection closed. Retrying...',
    duration: 3000,
    onClose: () => {
      store.obsRetryingNotification = undefined;
    },
  });
}
