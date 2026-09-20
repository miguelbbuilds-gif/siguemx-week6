import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ADAPT_CHOICES, ADAPT_SCENARIO } from '../data/adaptScenario.ts'
import { formatResponseTime, recordAdaptDecision } from '../measurement/observe.ts'
import type { AdaptChoice, AdaptRecord, FamilyPlan } from '../domain/types.ts'
import { BlockedMeetingScene } from './BlockedMeetingScene.tsx'
import { IntensityNote } from './IntensityNote.tsx'

type AdaptRehearsalProps = {
  family: FamilyPlan
  paused: boolean
  onLeave: () => void
  onRecord: (record: AdaptRecord) => void
}

export function AdaptRehearsal({ family, paused, onLeave, onRecord }: AdaptRehearsalProps) {
  const startedAt = useRef<number | null>(null)
  const pausedMs = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const [record, setRecord] = useState<AdaptRecord | null>(null)
  const [round, setRound] = useState(0)
  const meetingPoint = family.meetingPoint.trim() || 'el punto de reunión de siempre'

  useLayoutEffect(() => {
    if (record) return
    if (startedAt.current === null) {
      startedAt.current = Date.now()
    }
  }, [record, round])

  useEffect(() => {
    if (record) return
    if (paused) {
      pauseStartedAt.current = Date.now()
      return
    }
    if (pauseStartedAt.current !== null) {
      pausedMs.current += Date.now() - pauseStartedAt.current
      pauseStartedAt.current = null
    }
  }, [paused, record])

  function choose(choice: AdaptChoice) {
    if (record || paused || startedAt.current === null) return
    const next = recordAdaptDecision(
      choice,
      family,
      startedAt.current,
      Date.now(),
      pausedMs.current,
    )
    setRecord(next)
    onRecord(next)
  }

  function retry() {
    startedAt.current = Date.now()
    pausedMs.current = 0
    pauseStartedAt.current = null
    setRecord(null)
    setRound((value) => value + 1)
  }

  return (
    <section className="adapt">
      <p className="kicker">{ADAPT_SCENARIO.title}</p>
      <BlockedMeetingScene meetingPoint={meetingPoint} />
      <p className="lead">
        Plan original: verse en <strong>{meetingPoint}</strong>.{' '}
        {ADAPT_SCENARIO.blockedReason}
      </p>
      <p className="prompt">{ADAPT_SCENARIO.prompt}</p>
      <IntensityNote compact />

      {record ? (
        <div className="finding" data-testid="adapt-finding">
          <h2>Un hallazgo de esta decisión</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="adapt-response-time">
            Decisión: {record.label} · Tiempo de respuesta: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="adapt-alternative">
            Elegiste un lugar que sí se puede usar:{' '}
            {record.choosesWorkableAlternative ? 'sí' : 'no'} · Volviste al punto que ya no
            sirve: {record.repeatsFailedPlan ? 'sí' : 'no'}
          </p>
          <p className="fine-print">
            Comparado con el punto guardado: {meetingPoint}. Coincide con el plan original:{' '}
            {record.matchesOriginalMeetingPlan ? 'sí' : 'no'}.
          </p>
          <p className="fine-print">
            Esto es práctica. No garantiza que en un sismo de verdad vayan a estar a salvo.
          </p>
          <div className="actions">
            <button type="button" className="primary" onClick={retry}>
              Decidir otra vez
            </button>
            <button type="button" className="secondary" onClick={onLeave}>
              Volver al plan de la familia
            </button>
          </div>
        </div>
      ) : (
        <div className="choice-list" role="group" aria-label="Opciones cuando el punto de reunión no se puede usar">
          {ADAPT_CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="choice"
              data-testid={`adapt-choice-${choice.id}`}
              disabled={paused}
              onClick={() => choose(choice)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
