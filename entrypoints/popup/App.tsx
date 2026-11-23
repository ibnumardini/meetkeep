import { useEffect, useRef, useState } from 'react';

export const DEFAULT_LABEL = 'MK';
const MAX_LABEL_LENGTH = 6;
const TRAKTEER_URL = 'https://trakteer.id/ibnumardini/tip';
const KOFI_URL = 'https://ko-fi.com/ibnumardini';
const ID_TIMEZONES = new Set(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Pontianak']);

function isIndonesianUser() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  if (langs.some((l) => l.toLowerCase().startsWith('id'))) return true;
  try {
    return ID_TIMEZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return false;
  }
}

type AppProps = {
  initialEnabled?: boolean;
  initialAnalytics?: boolean;
  initialLabel?: string;
  initialError?: string | null;
};

export default function App({
  initialEnabled = true,
  initialAnalytics = true,
  initialLabel = DEFAULT_LABEL,
  initialError = null,
}: AppProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(initialAnalytics);
  const [label, setLabel] = useState(initialLabel);
  const [error, setError] = useState<string | null>(initialError);
  const turnOnBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!enabled) {
      turnOnBtnRef.current?.focus();
    }
  }, [enabled]);

  function setExtensionEnabled(next: boolean) {
    setEnabled(next);
    setError(null);
    browser.storage.local.set({ enabled: next }).catch(() => {
      setError('Could not save extension state.');
    });
  }

  function handleEnabledToggle() {
    setExtensionEnabled(!enabled);
  }

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
  const isIndonesian = isIndonesianUser();
  const supportUrl = isIndonesian ? TRAKTEER_URL : KOFI_URL;
  const supportTitle = isIndonesian ? 'Traktir kopi di Trakteer' : 'Support on Ko-fi';

  return (
    <div className="popup">
      <div className="popup-body" inert={!enabled}>
        <header className="header">
        <div className="brand">
          <span className="brand-mark">
            <img src="/icon/48.png" alt="" width={18} height={18} />
          </span>
          <div className="brand-copy">
            <h1>MeetKeep</h1>
            <p className="brand-sub">Google Meet Timer &amp; Enhancer</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? 'Turn MeetKeep timer off' : 'Turn MeetKeep timer on'}
            title={enabled ? 'Timer ON' : 'Timer OFF'}
            className={`power-btn${enabled ? ' power-btn--on' : ''}`}
            onClick={handleEnabledToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v10" />
              <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
            </svg>
          </button>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn icon-btn--support"
            aria-label={supportTitle}
            title={supportTitle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </a>
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
        </div>
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

      {!enabled && (
        <div className="off-overlay" role="dialog" aria-modal="true" aria-labelledby="off-modal-title">
          <div className="off-modal">
            <h2 id="off-modal-title" className="off-modal-title">
              MeetKeep is off
            </h2>
            <button
              ref={turnOnBtnRef}
              type="button"
              className="btn-turn-on"
              onClick={() => setExtensionEnabled(true)}
            >
              Turn on
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
