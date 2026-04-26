import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../styles/global.css';
import { App } from './App';
import { registerServiceWorker } from './registerServiceWorker';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerServiceWorker();
