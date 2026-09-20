import type { FamilyPlan } from '../domain/types.ts'
import { IntensityNote } from './IntensityNote.tsx'

type ReadyProps = {
  family: FamilyPlan
  onEdit: () => void
  onHome: () => void
  onStartAct: () => void
  onStartCoordinate: () => void
  onStartAdapt: () => void
  allModesDone: boolean
  onReviewLoop: () => void
}

export function Ready({
  family,
  onEdit,
  onHome,
  onStartAct,
  onStartCoordinate,
  onStartAdapt,
  allModesDone,
  onReviewLoop,
}: ReadyProps) {
  return (
    <section className="ready">
      <h1>Plan de la familia listo</h1>
      <p className="lead">
        Siguen tres prácticas: decidir en el momento, decidir cuando están separados,
        y decidir cuando el punto de reunión no se puede usar.
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
          <strong>Punto de reunión</strong>
          <span>{family.meetingPoint}</span>
        </li>
      </ul>
      <div className="actions">
        <button type="button" className="primary" onClick={onStartAct}>
          Empezar: decidir ahora
        </button>
        <button type="button" className="secondary" onClick={onStartCoordinate}>
          Empezar: familia separada
        </button>
        <button type="button" className="secondary" onClick={onStartAdapt}>
          Empezar: el plan no se puede usar
        </button>
        {allModesDone ? (
          <button type="button" className="primary" onClick={onReviewLoop}>
            Ver un hallazgo
          </button>
        ) : (
          <p className="fine-print">
            Completa las tres prácticas una vez para ver un hallazgo y practicar otra vez
            con un cambio.
          </p>
        )}
        <button type="button" className="text-link" onClick={onEdit}>
          Cambiar qué hace cada quien
        </button>
        <button type="button" className="text-link" onClick={onHome}>
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
