import { REHEARSAL_MODES } from '../domain/modes.ts'

type AppChromeProps = {
  onStop: () => void
}

export function AppChrome({ onStop }: AppChromeProps) {
  return (
    <header className="chrome">
      <div className="chrome-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ⌂
          </span>
          <div>
            <p className="brand-name">SigueMX</p>
            <p className="brand-sub">Rehearse Before Reality</p>
          </div>
        </div>
        <button type="button" className="stop" onClick={onStop}>
          STOP
        </button>
      </div>
      <ol className="progress" aria-label="Rehearsal modes. Not started yet.">
        {REHEARSAL_MODES.map((mode, index) => (
          <li key={mode} className="progress-step">
            {index > 0 ? <span className="progress-line" aria-hidden="true" /> : null}
            <span className="progress-dot" aria-hidden="true" />
            <span className="progress-label">{mode}</span>
          </li>
        ))}
      </ol>
      <p className="progress-note">Family setup · rehearsals not started</p>
    </header>
  )
}
