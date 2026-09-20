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
}

export function CoordinateRehearsal({
  family,
  paused,
  onLeave,
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
    setRecord(
      recordCoordinateDecision(choice, family, startedAt.current, Date.now(), pausedMs.current),
    )
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
          <h2>One behavioral finding</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="coordinate-response-time">
            Decision: {record.label} · Response time: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="coordinate-reliance">
            Relied on Mariana: {record.reliesOnMariana ? 'yes' : 'no'} · Matched saved plan:{' '}
            {record.matchesPlan ? 'yes' : 'no'}
          </p>
          <p className="fine-print">
            Saved Diego plan: {family.members.find((member) => member.id === 'diego')?.responsibility}
          </p>
          <p className="fine-print">
            Plan signals: wait for Mariana {signals.waitsForMariana ? 'yes' : 'no'}; Diego acts if
            she is absent {signals.diegoActsIfMarianaAbsent ? 'yes' : 'no'}.
          </p>
          <p className="fine-print">
            This is practice. It does not predict real-world survival.
          </p>
          <div className="actions">
            <button type="button" className="primary" onClick={retry}>
              Make another COORDINATE decision
            </button>
            <button type="button" className="secondary" onClick={onLeave}>
              Back to family plan
            </button>
          </div>
        </div>
      ) : (
        <div className="choice-list" role="group" aria-label="COORDINATE decision options">
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
