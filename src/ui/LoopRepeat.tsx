import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { findingForRepeat, recordRepeatDecision } from '../adaptive/loop.ts'
import { repeatScenario } from '../data/repeatScenario.ts'
import { formatResponseTime } from '../measurement/observe.ts'
import type { RepeatChoice, RepeatRecord, VariationId } from '../domain/types.ts'
import { FamilyScene3D } from './FamilyScene3D.tsx'
import { IntensityNote } from './IntensityNote.tsx'

type LoopRepeatProps = {
  variation: VariationId
  meetingPoint: string
  backupPlace: string
  paused: boolean
  onResolved: (record: RepeatRecord) => void
  onCompare: () => void
}

export function LoopRepeat({
  variation,
  meetingPoint,
  backupPlace,
  paused,
  onResolved,
  onCompare,
}: LoopRepeatProps) {
  const scenario = repeatScenario(variation, meetingPoint, backupPlace)
  const startedAt = useRef<number | null>(null)
  const pausedMs = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const [record, setRecord] = useState<RepeatRecord | null>(null)

  useLayoutEffect(() => {
    if (startedAt.current === null) {
      startedAt.current = Date.now()
    }
  }, [])

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

  function choose(choice: RepeatChoice) {
    if (record || paused || startedAt.current === null) return
    const next = recordRepeatDecision(
      choice,
      backupPlace,
      startedAt.current,
      Date.now(),
      pausedMs.current,
    )
    setRecord(next)
    onResolved(next)
  }

  return (
    <section className="loop-repeat">
      <p className="kicker">{scenario.title}</p>
      <FamilyScene3D
        mode={variation === 'none' ? 'act-night' : variation}
        decisionId={record?.choiceId ?? null}
        paused={paused}
        caption="Práctica distinta · la misma familia, otras condiciones"
      />
      <p className="lead">{scenario.situation}</p>
      <p className="prompt">{scenario.prompt}</p>
      <IntensityNote compact />
      {record ? (
        <div className="finding" data-testid="repeat-finding">
          <h2>Un hallazgo de esta decisión</h2>
          <p>{findingForRepeat({ id: record.choiceId, label: record.label }, backupPlace)}</p>
          <p className="fine-print" data-testid="repeat-response-time">
            Decisión: {record.label} · Tiempo de respuesta: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print">
            Esto es práctica. No garantiza que en un sismo de verdad vayan a estar a salvo.
          </p>
          <div className="actions">
            <button type="button" className="primary" onClick={onCompare}>
              Comparar las dos veces
            </button>
          </div>
        </div>
      ) : (
        <div className="choice-list" role="group" aria-label="Opciones de la segunda práctica">
          {scenario.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="choice"
              data-testid={`repeat-choice-${choice.id}`}
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
