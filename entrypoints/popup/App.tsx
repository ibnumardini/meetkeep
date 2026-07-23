import { useEffect, useState } from 'react';

const DEFAULT_LABEL = 'MK';

export default function App() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [label, setLabel] = useState(DEFAULT_LABEL);

  useEffect(() => {
    browser.storage.local.get(['analyticsEnabled']).then(({ analyticsEnabled: stored }) => {
      setAnalyticsEnabled(stored !== false);
    });
    browser.storage.local.get(['customLabel']).then(({ customLabel }) => {
      setLabel((customLabel as string) || DEFAULT_LABEL);
    });
  }, []);

  function handleToggleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setAnalyticsEnabled(checked);
    browser.storage.local.set({ analyticsEnabled: checked });
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target.value.trim() || DEFAULT_LABEL).toUpperCase();
    setLabel(value);
    browser.storage.local.set({ customLabel: value });
  }

  return (
    <>
      <div className="header">
        <img src="/icon/48.png" alt="" />
        <span>MeetKeep</span>
      </div>
      <div className="row">
        <label htmlFor="label-input">Timer label</label>
        <input
          type="text"
          id="label-input"
          maxLength={6}
          placeholder="MK"
          value={label}
          onChange={handleLabelChange}
        />
      </div>
      <div className="row">
        <div className="label-group">
          <label htmlFor="analytics-toggle">Send ping analytics</label>
          <a href="https://ibnumardini.github.io/meetkeep/privacy.html" target="_blank" rel="noopener">
            Why?
          </a>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            id="analytics-toggle"
            checked={analyticsEnabled}
            onChange={handleToggleChange}
          />
          <span className="slider"></span>
        </label>
      </div>
    </>
  );
}
