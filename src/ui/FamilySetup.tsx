import { useState } from 'react'
import { DEFAULT_FAMILY } from '../data/family.ts'
import { hasFamilyErrors, validateFamilyPlan } from '../data/validateFamily.ts'
import type { FamilyErrors } from '../data/validateFamily.ts'
import type { FamilyPlan, MemberId } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type FamilySetupProps = {
  family: FamilyPlan
  onSave: (plan: FamilyPlan) => void
  onBack: () => void
}

export function FamilySetup({ family, onSave, onBack }: FamilySetupProps) {
  const [draft, setDraft] = useState<FamilyPlan>(family)
  const [errors, setErrors] = useState<FamilyErrors>({})

  function updateResponsibility(id: MemberId, responsibility: string) {
    setDraft((current) => ({
      ...current,
      members: current.members.map((member) =>
        member.id === id ? { ...member, responsibility } : member,
      ),
    }))
  }

  function updateMeetingPoint(meetingPoint: string) {
    setDraft((current) => ({ ...current, meetingPoint }))
  }

  function handleSave() {
    const nextErrors = validateFamilyPlan(draft)
    setErrors(nextErrors)
    if (hasFamilyErrors(nextErrors)) return
    onSave({
      ...draft,
      meetingPoint: draft.meetingPoint.trim(),
      backupMeetingPoint: (draft.backupMeetingPoint ?? '').trim(),
      members: draft.members.map((member) => ({
        ...member,
        responsibility: member.responsibility.trim(),
      })),
    })
  }

  function handleReset() {
    setDraft(DEFAULT_FAMILY)
    setErrors({})
  }

  return (
    <section className="setup">
      <button type="button" className="text-link" onClick={onBack}>
        Atrás
      </button>
      <h1>Quién hace qué</h1>
      <p className="lead">
        Revisa qué haría cada quien. Los nombres y edades se quedan como familia de
        ejemplo. Esta es una familia inventada para practicar. No necesitas escribir
        datos reales.
      </p>
      <IntensityNote compact />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
      >
        {draft.members.map((member) => {
          const error = errors[member.id]
          const fieldId = `${member.id}-responsibility`
          const errorId = `${member.id}-error`
          return (
            <fieldset key={member.id} className="member-card">
              <legend>
                {member.name}, {member.age}
              </legend>
              <p className="role">{member.role}</p>
              <label htmlFor={fieldId}>Qué hace esta persona</label>
              <textarea
                id={fieldId}
                name={fieldId}
                rows={3}
                value={member.responsibility}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) =>
                  updateResponsibility(member.id, event.target.value)
                }
              />
              {error ? (
                <p id={errorId} className="error" role="alert">
                  {error}
                </p>
              ) : null}
            </fieldset>
          )
        })}
        <fieldset className="member-card">
          <legend>Punto de reunión</legend>
          <label htmlFor="meeting-point">Dónde acordaron verse</label>
          <textarea
            id="meeting-point"
            name="meeting-point"
            rows={2}
            value={draft.meetingPoint}
            aria-invalid={Boolean(errors.meetingPoint)}
            aria-describedby={errors.meetingPoint ? 'meeting-point-error' : undefined}
            onChange={(event) => updateMeetingPoint(event.target.value)}
          />
          {errors.meetingPoint ? (
            <p id="meeting-point-error" className="error" role="alert">
              {errors.meetingPoint}
            </p>
          ) : null}
        </fieldset>
        <div className="actions">
          <button type="submit" className="primary">
            Guardar este plan
          </button>
          <button type="button" className="secondary" onClick={handleReset}>
            Volver al ejemplo
          </button>
        </div>
      </form>
    </section>
  )
}
