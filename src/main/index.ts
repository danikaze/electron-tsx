// Modules to control application life and create native browser window
import { app, BrowserWindow, shell } from 'electron';
import { nanoid } from 'nanoid';

import type { TypedBrowserWindow } from 'types/electron-typed-ipc.d.ts';

import { enableDebugTools } from './enable-debug-tools';
import { ipcMain } from '@/ipc';
import { IpcEvents } from '@/ipc/events';
import { prod } from '@/utils/test';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: APP_ICON_PNG_PATH,
    webPreferences: {
      preload: ENTRY_POINT_PRELOAD,
    },
  }) as TypedBrowserWindow<IpcEvents>;

  // and load the index.html of the app.
  console.log({ENTRY_POINT_HTML: ENTRY_POINT_HTML});
  mainWindow.loadURL(ENTRY_POINT_HTML);


  console.log(`Message from main.js ${nanoid()}`);

  ipcMain.handle('ready', (ev, what) => {
    console.log(`Ready via IPC (${what})`);
    const reply = 'MSG via IPC';
    console.log(`  - sending: ${reply}`);
    ev.sender.send('msg', reply);
  });

  ipcMain.handle('openExternal', (ev, url) => {
    shell.openExternal(url);
  })

  // if not removed, on Mac gives an error while trying to register another
  // handler to the same channel, when opening the window again as it's not
  // really closed unless done on Cmd + Q
  mainWindow.on('close', () => ipcMain.removeHandler('ready'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  enableDebugTools()
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

prod(3, 5);