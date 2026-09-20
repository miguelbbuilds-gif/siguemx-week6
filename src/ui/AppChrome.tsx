import { REHEARSAL_MODES } from '../domain/modes.ts'
import type { RehearsalMode } from '../domain/types.ts'

type AppChromeProps = {
  currentMode?: RehearsalMode | null
  note?: string
  onStop: () => void
}

export function AppChrome({ currentMode = null, note, onStop }: AppChromeProps) {
  const status =
    note ??
    (currentMode ? `${currentMode} rehearsal` : 'Family setup · rehearsals not started')

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
      <ol className="progress" aria-label={status}>
        {REHEARSAL_MODES.map((mode, index) => (
          <li
            key={mode}
            className={
              mode === currentMode ? 'progress-step is-active' : 'progress-step'
            }
          >
            {index > 0 ? <span className="progress-line" aria-hidden="true" /> : null}
            <span className="progress-dot" aria-hidden="true" />
            <span className="progress-label">{mode}</span>
          </li>
        ))}
      </ol>
      <p className="progress-note">{status}</p>
    </header>
  )
}
