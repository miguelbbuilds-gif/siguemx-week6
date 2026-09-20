import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { COORDINATE_CHOICES, COORDINATE_SCENARIO } from '../data/coordinateScenario.ts'
import {
  formatResponseTime,
  readPlanSignals,
  recordCoordinateDecision,
} from '../measurement/observe.ts'
import type { CoordinateChoice, CoordinateRecord, FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'
import { SeparationMap } from './SeparationMap.tsx'

type CoordinateRehearsalProps = {
  family: FamilyPlan
  paused: boolean
  onLeave: () => void
  onRecord: (record: CoordinateRecord) => void
}

export function CoordinateRehearsal({
  family,
  paused,
  onLeave,
  onRecord,
}: CoordinateRehearsalProps) {
  const startedAt = useRef<number | null>(null)
  const pausedMs = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const [record, setRecord] = useState<CoordinateRecord | null>(null)
  const [round, setRound] = useState(0)
  const signals = readPlanSignals(family)

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

  function choose(choice: CoordinateChoice) {
    if (record || paused || startedAt.current === null) return
    const next = recordCoordinateDecision(
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
    <section className="coordinate">
      <p className="kicker">{COORDINATE_SCENARIO.title}</p>
      <SeparationMap family={family} />
      <p className="lead">{COORDINATE_SCENARIO.situation}</p>
      <p className="prompt">{COORDINATE_SCENARIO.prompt}</p>
      <IntensityNote compact />

      {record ? (
        <div className="finding" data-testid="coordinate-finding">
          <h2>Un hallazgo de esta decisión</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="coordinate-response-time">
            Decisión: {record.label} · Tiempo de respuesta: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="coordinate-reliance">
            Dependió de Mariana: {record.reliesOnMariana ? 'sí' : 'no'} · Coincidió con el plan:{' '}
            {record.matchesPlan ? 'sí' : 'no'}
          </p>
          <p className="fine-print">
            Plan escrito de Diego:{' '}
            {family.members.find((member) => member.id === 'diego')?.responsibility}
          </p>
          <p className="fine-print">
            Señales del plan: esperar a Mariana {signals.waitsForMariana ? 'sí' : 'no'}; Diego actúa
            si ella no está {signals.diegoActsIfMarianaAbsent ? 'sí' : 'no'}.
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
        <div className="choice-list" role="group" aria-label="Opciones cuando la familia está separada">
          {COORDINATE_CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="choice"
              data-testid={`coordinate-choice-${choice.id}`}
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
