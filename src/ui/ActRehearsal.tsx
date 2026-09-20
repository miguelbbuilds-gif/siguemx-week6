import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ACT_CHOICES, ACT_SCENARIO } from '../data/actScenario.ts'
import { formatResponseTime, recordActDecision } from '../measurement/observe.ts'
import type { ActChoice, ActRecord } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'
import { NightHomeScene } from './NightHomeScene.tsx'

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
      <NightHomeScene />
      <p className="lead">{ACT_SCENARIO.situation}</p>
      <p className="prompt">{ACT_SCENARIO.prompt}</p>
      <IntensityNote compact />

      {record ? (
        <div className="finding" data-testid="act-finding">
          <h2>One behavioral finding</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="act-response-time">
            Decision: {record.label} · Response time: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="act-elena">
            Responsibility for Elena without prompting:{' '}
            {record.assumesElenaWithoutPrompt ? 'yes' : 'no'}
          </p>
          <p className="fine-print">
            This is practice. It does not predict real-world survival.
          </p>
          <div className="actions">
            <button type="button" className="primary" onClick={retry}>
              Make another ACT decision
            </button>
            <button type="button" className="secondary" onClick={onLeave}>
              Back to family plan
            </button>
          </div>
        </div>
      ) : (
        <div className="choice-list" role="group" aria-label="ACT decision options">
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
      )}
    </section>
  )
}
