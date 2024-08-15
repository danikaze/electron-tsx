import { createRoot } from 'react-dom/client';

// import packages with only esm exports
import { nanoid } from 'nanoid';

// import via aliases (@ points to {PROJECT_ROOT}/src)
import { prod } from '@/utils/test';
import { ElectronTsxTestApp } from '@/components/electron-tsx-test';

/**
 * This file is loaded via the <script> tag in the index.html file (injected
 * automatically by webpack) and will be executed in the renderer process for
 * that window. No Node.js APIs are available in this process because
 * `nodeIntegration` is turned off and `contextIsolation` is turned on.
 * Use the contextBridge API in `preload.js` to expose Node.js functionality
 * from the main process.
 */

console.log(`Message from renderer.js ${nanoid()}`);
window.app.ready('renderer');

prod(3, 5);

const containerId = 'app-root';
const container = document.getElementById(containerId);
if (!container) {
  throw new Error(`#${containerId} not found in the html!`);
}

const root = createRoot(container);
root.render(<ElectronTsxTestApp />);
