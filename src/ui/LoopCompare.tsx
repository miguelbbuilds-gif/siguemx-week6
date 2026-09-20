import { compareAttempts } from '../adaptive/loop.ts'
import { formatResponseTime } from '../measurement/observe.ts'
import type { BehaviorObservation } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type LoopCompareProps = {
  first: BehaviorObservation
  second: BehaviorObservation
  onHome: () => void
}

export function LoopCompare({ first, second, onHome }: LoopCompareProps) {
  const lines = compareAttempts(first, second)

  return (
    <section className="loop">
      <p className="kicker">Compare attempts</p>
      <h1>What changed</h1>
      <IntensityNote compact />
      <div className="finding" data-testid="loop-compare">
        <p data-testid="compare-first">{lines.first}</p>
        <p data-testid="compare-second">{lines.second}</p>
        <p className="fine-print">
          First response {formatResponseTime(first.responseMs)} · Second response{' '}
          {formatResponseTime(second.responseMs)}
        </p>
        <p className="fine-print">
          This comparison is about decisions in rehearsal. It does not predict real-world
          survival.
        </p>
      </div>
      <div className="actions">
        <button type="button" className="primary" onClick={onHome}>
          Back to family plan
        </button>
      </div>
    </section>
  )
}
