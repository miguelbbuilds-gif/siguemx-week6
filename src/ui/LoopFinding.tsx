import { useState } from 'react'
import { planChangePrompt } from '../adaptive/loop.ts'
import type { AdaptiveResult, FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type LoopFindingProps = {
  result: AdaptiveResult
  family: FamilyPlan
  onSavePlan: (plan: FamilyPlan) => void
  onRehearse: () => void
  onBack: () => void
}

export function LoopFinding({
  result,
  family,
  onSavePlan,
  onRehearse,
  onBack,
}: LoopFindingProps) {
  const spec = planChangePrompt(result.weakness)
  const diego = family.members.find((member) => member.id === 'diego')?.responsibility ?? ''
  const [text, setText] = useState(diego)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const canRepeat = result.weakness !== 'none' && saved

  function handleSave() {
    const next = text.trim()
    if (!spec) return
    if (next.length < 8) {
      setError('Write a clearer first step for Diego.')
      setSaved(false)
      return
    }
    if (next === diego.trim()) {
      setError('Change this part of the plan before rehearsing again.')
      setSaved(false)
      return
    }
    setError('')
    onSavePlan({
      ...family,
      backupMeetingPoint: spec.backupPlace,
      members: family.members.map((member) =>
        member.id === 'diego' ? { ...member, responsibility: next } : member,
      ),
    })
    setSaved(true)
  }

  return (
    <section className="loop">
      <p className="kicker">One finding</p>
      <h1>Behavior after ACT, COORDINATE, and ADAPT</h1>
      <IntensityNote compact />
      <div className="finding" data-testid="loop-finding">
        <h2>Detected weakness</h2>
        <p>{result.finding}</p>
        {result.sourceMode ? (
          <p className="fine-print">
            Seen in {result.sourceMode}: {result.sourceLabel}
          </p>
        ) : null}
      </div>
      {spec ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <fieldset className="member-card">
            <legend>{spec.label}</legend>
            <label htmlFor="plan-change">Diego’s updated responsibility</label>
            <textarea
              id="plan-change"
              rows={3}
              value={text}
              onChange={(event) => {
                setSaved(false)
                setText(event.target.value)
              }}
            />
            <p className="fine-print">Example: {spec.suggested}</p>
            {error ? (
              <p className="error" role="alert">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="fine-print">Plan change saved. Backup place: {spec.backupPlace}.</p>
            ) : null}
            <div className="actions">
              <button type="submit" className="secondary">
                Save this plan change
              </button>
            </div>
          </fieldset>
        </form>
      ) : null}
      <div className="actions">
        {canRepeat ? (
          <button type="button" className="primary" onClick={onRehearse}>
            Rehearse again
          </button>
        ) : null}
        <button type="button" className="text-link" onClick={onBack}>
          Back to family plan
        </button>
      </div>
    </section>
  )
}
