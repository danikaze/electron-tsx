// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import { TypedBrowserWindow } from 'types/electron-typed-ipc';

import { ipcMain } from '@/ipc';
import { IpcEvents } from '@/ipc/events';
import { prod } from '@/utils/test';

declare const ENTRY_POINT_PRELOAD: string;
declare const ENTRY_POINT_HTML: string;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: ENTRY_POINT_PRELOAD,
    },
  }) as TypedBrowserWindow<IpcEvents>;

  // and load the index.html of the app.
  mainWindow.loadFile(ENTRY_POINT_HTML);

  console.log(`Message from main.js`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  ipcMain.handle('ready', (ev, what) => {
    console.log(`Ready via IPC (${what})`);
    const reply = 'MSG via IPC';
    console.log(`  - sending: ${reply}`);
    ev.sender.send('msg', reply);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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