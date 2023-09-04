import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Provider from '/@/Provider.vue';
import { router } from './router';

createApp(Provider)
  .use(router)
  .use(createPinia())
  .mount('#app');
