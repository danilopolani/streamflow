import { app, BrowserWindow, nativeImage, Notification } from 'electron';
import { join } from 'node:path';
import { URL } from 'node:url';
import { get } from './stores/general';
import { notificationIcon } from './images';

let browserWindow: BrowserWindow;
let firstTimeTrayNotificationShown = false;

async function createWindow() {
  browserWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  });

  // Remove menu to avoid also refresh in-app
  browserWindow.removeMenu();

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on('ready-to-show', () => {
    if (process.platform !== 'win32') {
      browserWindow?.show();
    } else if (!get<boolean>('startInTray') || get<boolean>('firstTimeInApp')) {
      browserWindow?.show();
    }

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  // Put app in tray icon mode without exiting it really
  browserWindow.on('close', (ev) => {
    if (process.platform === 'darwin') {
      return;
    }

    ev.preventDefault();
    browserWindow.hide();

    if (get<boolean>('firstTimeInApp') && !firstTimeTrayNotificationShown) {
      firstTimeTrayNotificationShown = true;

      new Notification({
        title: 'App is still running',
        body: 'When closing the app it still runs in your tray. You can right-click on it to close it definitely.',
        icon: nativeImage.createFromDataURL(notificationIcon),
      }).show();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test.
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

export { browserWindow };
