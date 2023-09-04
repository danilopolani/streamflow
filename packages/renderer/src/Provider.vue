<script lang="ts" setup>
import {
	NConfigProvider,
	NMessageProvider,
	NDialogProvider,
	NNotificationProvider,
	NLoadingBarProvider,
	type GlobalThemeOverrides,
  useOsTheme,
  darkTheme,
} from 'naive-ui';
import App from './App.vue';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#B087F4',
    primaryColorHover: '#a473f2',
    primaryColorPressed: '#9b65f1',
  },
  Button: {
    textColorPrimary: '#fff',
    textColorHoverPrimary: '#fff',
    textColorFocusPrimary: '#fff',
    textColorPressedPrimary: '#fff',
  },
};

const theme = useOsTheme().value === 'dark' ? darkTheme : null;
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <App />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
