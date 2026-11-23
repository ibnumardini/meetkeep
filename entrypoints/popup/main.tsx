import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { DEFAULT_LABEL } from './App';

async function mount() {
  let initialEnabled = true;
  let initialAnalytics = true;
  let initialLabel = DEFAULT_LABEL;
  let initialError: string | null = null;

  try {
    const { enabled, analyticsEnabled, customLabel } = await browser.storage.local.get([
      'enabled',
      'analyticsEnabled',
      'customLabel',
    ]);
    initialEnabled = enabled !== false;
    initialAnalytics = analyticsEnabled !== false;
    initialLabel = (customLabel as string) || DEFAULT_LABEL;
  } catch {
    initialError = 'Could not load saved settings.';
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App
        initialEnabled={initialEnabled}
        initialAnalytics={initialAnalytics}
        initialLabel={initialLabel}
        initialError={initialError}
      />
    </React.StrictMode>
  );
}

mount();
