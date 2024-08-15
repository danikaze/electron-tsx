import { contextBridge } from 'electron';
import { nanoid } from 'nanoid';

import { ipcRenderer } from '@/ipc';
import { prod } from '@/utils/test';

/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
console.log(`Message from preload.js ${nanoid()}`);

ipcRenderer.addListener('msg', (ev, data) => console.log(data));

// `window.versions` contain the version of the main 3 techs setup by
// ElectronTSX and it's needed in the <ElectronTsxTestApp>
// but can be removed (or not) once the app is replaced with real one
contextBridge.exposeInMainWorld('versions', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});

// `window.app` contains the "API" provided by the IPC definitions and acts as
// an abstraction layer to call use the ipcRenderer invokations
// (recommended to be moved to other file in a more complex app)
contextBridge.exposeInMainWorld('app', {
  ready: (caller: string) => ipcRenderer.invoke('ready', caller),
  openExternal: (url: string) => ipcRenderer.invoke('openExternal', url),
});

// simple invocation of a function using TypeScript
prod(3, 5);
