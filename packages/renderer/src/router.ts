import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '/@/pages/Home.vue';
import Workflows from '/@/pages/Workflows.vue';
import GeneralSettings from './pages/settings/GeneralSettings.vue';
import ObsSettings from './pages/settings/ObsSettings.vue';
import TwitchSettings from './pages/settings/TwitchSettings.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/workflows', component: Workflows },
  {
    path: '/settings',
    redirect: '/settings/general',
    children: [
      { path: '/settings/general', component: GeneralSettings },
      { path: '/settings/obs', component: ObsSettings },
      { path: '/settings/twitch', component: TwitchSettings },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { router };
