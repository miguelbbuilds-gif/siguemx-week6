import { REHEARSAL_MODES } from '../domain/modes.ts'
import type { RehearsalMode } from '../domain/types.ts'
import { modeLabel } from './labels.ts'

type AppChromeProps = {
  currentMode?: RehearsalMode | null
  note?: string
  onStop: () => void
}

export function AppChrome({ currentMode = null, note, onStop }: AppChromeProps) {
  const status =
    note ??
    (currentMode ? `Práctica: ${modeLabel(currentMode)}` : 'Aún no empieza la práctica')

  return (
    <header className="chrome">
      <div className="chrome-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ⌂
          </span>
          <div>
            <p className="brand-name">SigueMX</p>
            <p className="brand-sub">Practica antes de que pase</p>
          </div>
        </div>
        <button type="button" className="stop" onClick={onStop}>
          DETENER
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
            <span className="progress-label">{modeLabel(mode)}</span>
          </li>
        ))}
      </ol>
      <p className="progress-note">{status}</p>
    </header>
  )
}
