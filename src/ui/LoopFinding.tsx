import { useState } from 'react'
import { planChangePrompt } from '../adaptive/loop.ts'
import type { AdaptiveResult, FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'
import { modeLabel } from './labels.ts'

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
      setError('Escribe con más claridad el primer paso de Diego.')
      setSaved(false)
      return
    }
    if (next === diego.trim()) {
      setError('Cambia esta parte del plan antes de practicar otra vez.')
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
      <p className="kicker">Un hallazgo</p>
      <h1>Qué se vio después de las tres prácticas</h1>
      <IntensityNote compact />
      <div className="finding" data-testid="loop-finding">
        <h2>Punto débil detectado</h2>
        <p>{result.finding}</p>
        {result.sourceMode ? (
          <p className="fine-print">
            Se vio en {modeLabel(result.sourceMode)}: {result.sourceLabel}
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
            <label htmlFor="plan-change">Qué hará Diego ahora</label>
            <textarea
              id="plan-change"
              rows={3}
              value={text}
              onChange={(event) => {
                setSaved(false)
                setText(event.target.value)
              }}
            />
            <p className="fine-print">Ejemplo: {spec.suggested}</p>
            {error ? (
              <p className="error" role="alert">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="fine-print">Cambio guardado. Lugar de respaldo: {spec.backupPlace}.</p>
            ) : null}
            <div className="actions">
              <button type="submit" className="secondary">
                Guardar este cambio
              </button>
            </div>
          </fieldset>
        </form>
      ) : null}
      <div className="actions">
        {canRepeat ? (
          <button type="button" className="primary" onClick={onRehearse}>
            Practicar otra vez
          </button>
        ) : null}
        <button type="button" className="text-link" onClick={onBack}>
          Volver al plan de la familia
        </button>
      </div>
    </section>
  )
}
