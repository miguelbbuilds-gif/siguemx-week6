import type { FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type ReadyProps = {
  family: FamilyPlan
  onEdit: () => void
  onHome: () => void
}

export function Ready({ family, onEdit, onHome }: ReadyProps) {
  return (
    <section className="ready">
      <h1>Family plan saved</h1>
      <p className="lead">
        ACT, COORDINATE, and ADAPT are next. Those rehearsals are not in this
        milestone.
      </p>
      <IntensityNote compact />
      <ul className="plan-list">
        {family.members.map((member) => (
          <li key={member.id}>
            <strong>
              {member.name}, {member.age}
            </strong>
            <span>{member.responsibility}</span>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button type="button" className="secondary" onClick={onEdit}>
          Edit responsibilities
        </button>
        <button type="button" className="text-link" onClick={onHome}>
          Back to welcome
        </button>
      </div>
    </section>
  )
}
