import type { FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type HomeProps = {
  family: FamilyPlan
  onSetup: () => void
}

export function Home({ family, onSetup }: HomeProps) {
  return (
    <section className="welcome">
      <p className="kicker">Synthetic demo family</p>
      <h1>Practice the decisions your family hasn’t rehearsed.</h1>
      <p className="lead">
        Institutional drills are not the same as deciding together when you are
        separated, someone needs help, or the expected plan fails.
      </p>
      <IntensityNote />
      <ul className="family-preview">
        {family.members.map((member) => (
          <li key={member.id}>
            <strong>
              {member.name}, {member.age}
            </strong>
            <span>{member.role}</span>
          </li>
        ))}
      </ul>
      <p className="fine-print">
        Mariana, Elena, and Diego are invented names for demonstration. They are not
        real people.
      </p>
      <button type="button" className="primary" onClick={onSetup}>
        Set up this family
      </button>
    </section>
  )
}
