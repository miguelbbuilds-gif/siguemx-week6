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
}

export function AdaptRehearsal({ family, paused, onLeave }: AdaptRehearsalProps) {
  const startedAt = useRef<number | null>(null)
  const pausedMs = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const [record, setRecord] = useState<AdaptRecord | null>(null)
  const [round, setRound] = useState(0)
  const meetingPoint = family.meetingPoint.trim() || 'the original meeting point'

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
    setRecord(
      recordAdaptDecision(choice, family, startedAt.current, Date.now(), pausedMs.current),
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
    <section className="adapt">
      <p className="kicker">{ADAPT_SCENARIO.title}</p>
      <BlockedMeetingScene meetingPoint={meetingPoint} />
      <p className="lead">
        Original meeting plan: meet at <strong>{meetingPoint}</strong>.{' '}
        {ADAPT_SCENARIO.blockedReason}
      </p>
      <p className="prompt">{ADAPT_SCENARIO.prompt}</p>
      <IntensityNote compact />

      {record ? (
        <div className="finding" data-testid="adapt-finding">
          <h2>One behavioral finding</h2>
          <p>{record.finding}</p>
          <p className="fine-print" data-testid="adapt-response-time">
            Decision: {record.label} · Response time: {formatResponseTime(record.responseMs)}
          </p>
          <p className="fine-print" data-testid="adapt-alternative">
            Chose a workable alternative: {record.choosesWorkableAlternative ? 'yes' : 'no'} ·
            Repeated the failed meeting point: {record.repeatsFailedPlan ? 'yes' : 'no'}
          </p>
          <p className="fine-print">
            Compared with saved meeting point: {meetingPoint}. Matched original meeting plan:{' '}
            {record.matchesOriginalMeetingPlan ? 'yes' : 'no'}.
          </p>
          <p className="fine-print">
            This is practice. It does not predict real-world survival.
          </p>
          <div className="actions">
            <button type="button" className="primary" onClick={retry}>
              Make another ADAPT decision
            </button>
            <button type="button" className="secondary" onClick={onLeave}>
              Back to family plan
            </button>
          </div>
        </div>
      ) : (
        <div className="choice-list" role="group" aria-label="ADAPT decision options">
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
