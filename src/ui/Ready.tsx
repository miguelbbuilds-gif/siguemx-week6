import type { FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type ReadyProps = {
  family: FamilyPlan
  onEdit: () => void
  onHome: () => void
  onStartAct: () => void
  onStartCoordinate: () => void
  onStartAdapt: () => void
}

export function Ready({
  family,
  onEdit,
  onHome,
  onStartAct,
  onStartCoordinate,
  onStartAdapt,
}: ReadyProps) {
  return (
    <section className="ready">
      <h1>Family plan saved</h1>
      <p className="lead">
        ACT, COORDINATE, and ADAPT are ready. ADAPT tests what happens when the
        saved meeting point cannot be used.
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
        <li>
          <strong>Meeting point</strong>
          <span>{family.meetingPoint}</span>
        </li>
      </ul>
      <div className="actions">
        <button type="button" className="primary" onClick={onStartAct}>
          Start ACT rehearsal
        </button>
        <button type="button" className="secondary" onClick={onStartCoordinate}>
          Start COORDINATE rehearsal
        </button>
        <button type="button" className="secondary" onClick={onStartAdapt}>
          Start ADAPT rehearsal
        </button>
        <button type="button" className="text-link" onClick={onEdit}>
          Edit responsibilities
        </button>
        <button type="button" className="text-link" onClick={onHome}>
          Back to welcome
        </button>
      </div>
    </section>
  )
}
