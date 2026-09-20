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
      <p className="kicker">Comparar las dos veces</p>
      <h1>Qué cambió</h1>
      <IntensityNote compact />
      <div className="finding" data-testid="loop-compare">
        <p data-testid="compare-first">{lines.first}</p>
        <p data-testid="compare-second">{lines.second}</p>
        <p className="fine-print">
          Primera respuesta {formatResponseTime(first.responseMs)} · Segunda respuesta{' '}
          {formatResponseTime(second.responseMs)}
        </p>
        <p className="fine-print">
          Esta comparación es sobre decisiones en la práctica. No garantiza que en un
          sismo de verdad vayan a estar a salvo.
        </p>
      </div>
      <div className="actions">
        <button type="button" className="primary" onClick={onHome}>
          Volver al plan de la familia
        </button>
      </div>
    </section>
  )
}
