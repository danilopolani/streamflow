import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/electron';
import { router } from './router';
import Provider from './Provider.vue';
import { useTwitch } from './stores/twitch';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    async beforeSend(event) {
      const twitch = useTwitch();

      event.user = {
        username: twitch.username,
      };

      return event;
    },
  });
}

createApp(Provider)
  .use(router)
  .use(createPinia())
  .mount('#app');
