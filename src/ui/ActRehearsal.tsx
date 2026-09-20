import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ACT_CHOICES, ACT_SCENARIO } from '../data/actScenario.ts'
import { formatResponseTime, recordActDecision } from '../measurement/observe.ts'
import type { ActChoice, ActRecord } from '../domain/types.ts'
import { FamilyScene3D } from './FamilyScene3D.tsx'
import { IntensityNote } from './IntensityNote.tsx'
import { VoiceActInput } from './VoiceActInput.tsx'

type ActRehearsalProps = {
  paused: boolean
  onLeave: () => void
  onRecord: (record: ActRecord) => void
}

export function ActRehearsal({ paused, onLeave, onRecord }: ActRehearsalProps) {
  const startedAt = useRef<number | null>(null)
  const pausedMs = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const [record, setRecord] = useState<ActRecord | null>(null)
  const [round, setRound] = useState(0)

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

  function choose(choice: ActChoice) {
    if (record || paused || startedAt.current === null) return
    const next = recordActDecision(choice, startedAt.current, Date.now(), pausedMs.current)
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
    <section className="act">
      <p className="kicker">{ACT_SCENARIO.title}</p>
      <FamilyScene3D
        mode="act-night"
        decisionId={record?.choiceId ?? null}
        paused={paused}
        caption="Cuarto de práctica · figuras simples · no son personas reales"
      />
      <p className="lead">{ACT_SCENARIO.situation}</p>
      <p className="prompt">{ACT_SCENARIO.prompt}</p>
      <IntensityNote compact />

      {record ? (
        <div className="finding" data-testid="act-finding">
          <h2>Un hallazgo de esta decisión</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="act-response-time">
            Decisión: {record.label} · Tiempo de respuesta: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="act-elena">
            Se hizo cargo de Elena sin que se lo pidieran:{' '}
            {record.assumesElenaWithoutPrompt ? 'sí' : 'no'}
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
        <>
          <div className="choice-list" role="group" aria-label="Opciones para decidir ahora">
            {ACT_CHOICES.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className="choice"
                data-testid={`act-choice-${choice.id}`}
                disabled={paused}
                onClick={() => choose(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <VoiceActInput disabled={paused} onConfirm={choose} />
        </>
      )}
    </section>
  )
}
