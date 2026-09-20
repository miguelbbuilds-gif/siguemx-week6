import type { FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type HomeProps = {
  family: FamilyPlan
  onSetup: () => void
}

export function Home({ family, onSetup }: HomeProps) {
  return (
    <section className="welcome">
      <p className="kicker">Familia de ejemplo</p>
      <h1>Practica las decisiones que tu familia aún no ha ensayado juntas.</h1>
      <p className="lead">
        Un simulacro en la escuela o el trabajo no es lo mismo que decidir en familia
        cuando están separados, alguien necesita ayuda, o el plan de siempre no se puede usar.
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
        Esta es una familia inventada para practicar. No necesitas escribir datos reales.
        Mariana, Elena y Diego no son personas reales.
      </p>
      <button type="button" className="primary" onClick={onSetup}>
        Empezar práctica
      </button>
    </section>
  )
}
