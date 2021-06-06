'use strict';

/* global __static */

import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  protocol,
  Tray,
} from 'electron';
import { collectors, setup, worker } from './core';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Patch for disabling cors error (web security) // TODO read about if this is recommended in prod
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let tray;
let startRoute;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function openWindowFromTray(route) {
  startRoute = route;
  if (!win) createWindow();
  else if (win.isMinimized()) win.restore();
  else win.focus();
}

function createTray() {
  tray = new Tray(path.join(__static, './assets/icons/32x32.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      click: () => openWindowFromTray('/home'),
      id: 'dashboard',
      label: 'Dashboard',
      type: 'normal',
    },
    {
      click: () => openWindowFromTray('/settings'),
      id: 'settings',
      label: 'Settings',
      type: 'normal',
    },
    {
      label: 'Separator',
      type: 'separator',
    },
    {
      label: 'Quit',
      role: 'quit',
      type: 'normal',
    },
  ]);
  tray.setToolTip('Alto Collectr');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: nativeImage.createFromPath(
      path.join(__static, './assets/icons/64x64.png'),
    ),
    title: 'Alto Collectr',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });
  win.setMenu(null);
  win.on('page-title-updated', event => event.preventDefault());

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => (win = null));
}

app.on('window-all-closed', e => e.preventDefault());
// Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createTray();
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      createWindow();
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => app.quit());
  }
}

// AppSettings
ipcMain.handle('set-start-with-system', (event, value) => {
  const exeName = path.basename(process.execPath);

  app.setLoginItemSettings({
    openAtLogin: value,
    path: process.execPath,
    args: [
      '--processStart',
      `"${exeName}"`,
      '--process-start-args',
      `"--hidden"`,
    ],
  });
});

// Window management
ipcMain.on('start-route', event => {
  const route = startRoute;
  startRoute = null;
  event.returnValue = route;
});

// Info collector setup
worker.once(collectors.infoCollector.handler, false);
ipcMain.on('subscribe-system-information', (event, eventName) => {
  const eventId = collectors.infoCollector.subscribe(data =>
    event.reply(eventName, data),
  );
  event.returnValue = eventId;
});
ipcMain.on('unsubscribe-system-information', (_, id) =>
  collectors.infoCollector.unsubscribe(id),
);

// Usage collector setup
worker.subscribe(collectors.usageCollector.handler, false);
ipcMain.on('subscribe-usage', (event, eventName) => {
  const eventId = collectors.usageCollector.subscribe(data =>
    event.reply(eventName, data),
  );
  event.returnValue = eventId;
});
ipcMain.on('unsubscribe-usage', (_, id) =>
  collectors.usageCollector.unsubscribe(id),
);

// Initialize worker
worker.run();
setup();
