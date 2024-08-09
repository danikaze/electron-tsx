// import via aliases (@ points to {PROJECT_ROOT}/src)
import { prod } from '@/utils/test';

/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
console.log('Message from renderer.js');
((window as any).app as any).ready('renderer');

prod(3, 5);