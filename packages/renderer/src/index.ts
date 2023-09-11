import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/electron';
import { router } from './router';
import Provider from './Provider.vue';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  });
}

createApp(Provider)
  .use(router)
  .use(createPinia())
  .mount('#app');
