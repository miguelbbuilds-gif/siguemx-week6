import type { FamilyPlan } from '../domain/types.ts'
import { COORDINATE_PLACES } from '../data/coordinateScenario.ts'

type SeparationMapProps = {
  family: FamilyPlan
}

export function SeparationMap({ family }: SeparationMapProps) {
  return (
    <ul className="places" aria-label="Where the family is right now">
      {COORDINATE_PLACES.map((place) => {
        const member = family.members.find((item) => item.id === place.id)
        if (!member) return null
        return (
          <li key={place.id} className={`place place-${place.id}`}>
            <strong>
              {member.name}, {member.age}
            </strong>
            <span className="place-where">{place.place}</span>
            <span>{place.note}</span>
          </li>
        )
      })}
    </ul>
  )
}
