import { contextBridge } from 'electron';

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
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

console.log(`Message from preload.js`);

ipcRenderer.addListener('msg', (ev, data) => console.log(data));

contextBridge.exposeInMainWorld('app', {
  ready: (caller) => ipcRenderer.invoke('ready', caller),
});

prod(3, 5);
