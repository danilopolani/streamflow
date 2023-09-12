import { Menu, Tray, app, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as Sentry from '@sentry/electron';
import { log } from './logger'; // Include it pretty soon to override console functions
import { handleIpc } from './ipc';
import { browserWindow, restoreOrCreateWindow } from '/@/mainWindow';
import { OBSWebSocket } from './workers/OBSWebSocket';
import { initDatabase } from './database';
import firstTimeApp from './database/firstTimeApp';
import { HttpServer } from './HttpServer';
import './securityRestrictions';
import { Twitch } from './workers/Twitch';
import { WorkflowQueue } from './workers/WorkflowQueue';
import { trayIcon } from './images';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    async beforeSend(event) {
      try {
        const twitchSettings = await Twitch.getSettings();

        event.user = {
          username: twitchSettings?.value.userName,
        };
      } catch (_err) {
        // Pass
      }

      return event;
    },
  });
}

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(() => initDatabase())
  .then(firstTimeApp)
  .then(handleIpc)
  .then(restoreOrCreateWindow)
  .catch((err) => console.error('Failed create window:', (err as Error).message))
  .then(async () => {
    // Set icon tray
    if (process.platform === 'win32') {
      app.setAppUserModelId('Streamflow');
    }

    const appIcon = new Tray(nativeImage.createFromDataURL(trayIcon));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Quit', click: () => (browserWindow.destroy(), app.quit()) },
    ]);

    appIcon.on('click', () => browserWindow.show());
    appIcon.setContextMenu(contextMenu);
    appIcon.setToolTip('Streamflow');

    // Init services
    HttpServer.init();
    WorkflowQueue.init();
    Twitch.init(process.env.TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET!).connect();
    OBSWebSocket;

    // Auto updater
    if (import.meta.env.PROD) {
      autoUpdater.logger = log;

      try {
        await autoUpdater.checkForUpdatesAndNotify();
      } catch (err) {
        console.error('Unable to fetch updates:', (err as Error).toString());
      }
    }
  });
