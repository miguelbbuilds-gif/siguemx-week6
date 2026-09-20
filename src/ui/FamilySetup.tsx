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
      members: current.members.map((member) =>
        member.id === id ? { ...member, responsibility } : member,
      ),
    }))
  }

  function handleSave() {
    const nextErrors = validateFamilyPlan(draft)
    setErrors(nextErrors)
    if (hasFamilyErrors(nextErrors)) return
    onSave({
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
        Back
      </button>
      <h1>Family setup</h1>
      <p className="lead">
        Confirm who does what. Names and ages stay as the synthetic demo household.
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
              <label htmlFor={fieldId}>Responsibility</label>
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
        <div className="actions">
          <button type="submit" className="primary">
            Save family plan
          </button>
          <button type="button" className="secondary" onClick={handleReset}>
            Restore demo plan
          </button>
        </div>
      </form>
    </section>
  )
}
