import { useState } from 'react';

export const DEFAULT_LABEL = 'MK';
const MAX_LABEL_LENGTH = 6;

type AppProps = {
  initialAnalytics?: boolean;
  initialLabel?: string;
  initialError?: string | null;
};

export default function App({
  initialAnalytics = true,
  initialLabel = DEFAULT_LABEL,
  initialError = null,
}: AppProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(initialAnalytics);
  const [label, setLabel] = useState(initialLabel);
  const [error, setError] = useState<string | null>(initialError);

  function handleToggleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setAnalyticsEnabled(checked);
    setError(null);
    browser.storage.local.set({ analyticsEnabled: checked }).catch(() => {
      setError('Could not save analytics setting.');
    });
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toUpperCase();
    setLabel(raw);
    setError(null);
    const stored = raw.trim() || DEFAULT_LABEL;
    browser.storage.local.set({ customLabel: stored }).catch(() => {
      setError('Could not save timer label.');
    });
  }

  function handleLabelBlur() {
    if (!label.trim()) {
      setLabel(DEFAULT_LABEL);
    }
  }

  const displayLabel = label.trim() || DEFAULT_LABEL;
  const remaining = MAX_LABEL_LENGTH - label.length;
  const counterText = label.length === 0 ? `max ${MAX_LABEL_LENGTH}` : `${remaining} left`;

  return (
    <div className="popup">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">
            <img src="/icon/48.png" alt="" width={18} height={18} />
          </span>
          <h1>MeetKeep</h1>
        </div>
        <a
          href="https://ibnumardini.github.io/meetkeep/"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          aria-label="Open MeetKeep website"
          title="MeetKeep website"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </a>
      </header>

      <main className="content">
        {error && (
          <p className="status-error" role="alert">
            {error}
          </p>
        )}

        <section className="card card--featured" aria-labelledby="label-heading">
          <div className="card-heading">
            <div className="card-top">
              <label id="label-heading" htmlFor="label-input" className="card-title">
                Timer label
              </label>
              <div className="preview-pill" aria-hidden="true">
                <span className="preview-label">{displayLabel}</span>
                <span className="preview-time">00:00:00</span>
              </div>
            </div>
            <p className="card-desc">Shown beside the Meet timer</p>
          </div>

          <div className="input-wrap">
            <input
              type="text"
              id="label-input"
              className="label-input"
              maxLength={MAX_LABEL_LENGTH}
              placeholder={DEFAULT_LABEL}
              value={label}
              aria-describedby="label-counter"
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
            />
            <span
              id="label-counter"
              className={`input-counter${remaining === 0 ? ' input-counter--limit' : ''}`}
              aria-live="polite"
            >
              {counterText}
            </span>
          </div>
        </section>

        <section className="card card--surface" aria-labelledby="analytics-heading">
          <div className="setting-row">
            <div className="setting-copy">
              <label id="analytics-heading" htmlFor="analytics-toggle" className="card-title">
                Send ping analytics
              </label>
              <p className="card-desc">Anonymous daily usage ping</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                id="analytics-toggle"
                checked={analyticsEnabled}
                onChange={handleToggleChange}
              />
              <span className="slider" aria-hidden="true" />
            </label>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} MeetKeep</span>
        <a
          href="https://ibnumardini.github.io/meetkeep/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
