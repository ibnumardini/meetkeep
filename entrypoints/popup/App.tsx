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
        <a
          href="https://ibnumardini.github.io/meetkeep/"
          target="_blank"
          rel="noopener"
          className="header-link"
          title="MeetKeep website"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </a>
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
        <label htmlFor="analytics-toggle">Send ping analytics</label>
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
      <div className="footer">
        <span>© {new Date().getFullYear()} MeetKeep</span>
        <a href="https://ibnumardini.github.io/meetkeep/privacy.html" target="_blank" rel="noopener">
          Privacy Policy
        </a>
      </div>
    </>
  );
}
