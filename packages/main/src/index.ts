import { Menu, Tray, app, nativeImage } from 'electron';
import * as dotenv from 'dotenv';
import './logger'; // Include it pretty soon to override console functions
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

// Needed to load secret env outside the VITE process
dotenv.config({
  path: import.meta.env.DEV ? './.env.local' : undefined,
});

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
  .then(async () => await firstTimeApp())
  .then(handleIpc)
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e))
  .then(() => {
    if (process.platform === 'win32') {
      app.setAppUserModelId('Streamflow');
    }

    const appIcon = new Tray(nativeImage.createFromDataURL(trayIcon));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Quit', click: () => (browserWindow.destroy(), app.quit()) },
    ]);

    appIcon.on('click', () => browserWindow.show());
    appIcon.setContextMenu(contextMenu);
  })
  .then(() => initDatabase())
  .then(() => HttpServer.init())
  .then(() => WorkflowQueue.spawn())
  .then(() => Twitch.init(process.env.TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET!).connect())
  .then(() => OBSWebSocket);

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(module => {
      const autoUpdater = module.autoUpdater || (module.default.autoUpdater as typeof module['autoUpdater']);
      return autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(e => console.error('Failed check updates:', e));
}
