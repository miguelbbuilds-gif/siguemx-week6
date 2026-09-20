import type { CoordinateChoice, FamilyPlan, MemberId } from '../domain/types.ts'

export const COORDINATE_SCENARIO = {
  title: 'Separados — La familia no está junta',
  prompt: 'Mariana no puede organizar. ¿Qué debería hacer primero esta familia?',
  situation:
    'El piso se mueve y la familia está en distintos lugares. Mariana está en el trabajo y no contestan. Elena está en casa. Diego está en la escuela.',
} as const

export const COORDINATE_PLACES: { id: MemberId; place: string; note: string }[] = [
  { id: 'mariana', place: 'Trabajo', note: 'Normalmente organiza · no se le puede hablar' },
  { id: 'elena', place: 'Casa', note: 'Puede necesitar ayuda' },
  { id: 'diego', place: 'Escuela', note: 'Tiene que actuar sin Mariana' },
]

export const COORDINATE_CHOICES: CoordinateChoice[] = [
  {
    id: 'follow-plan',
    label: 'Seguir el plan de la familia ahora. No esperar a Mariana.',
    reliesOnMariana: false,
  },
  {
    id: 'wait-mariana',
    label: 'Seguir intentando hablar con Mariana antes de que alguien más actúe.',
    reliesOnMariana: true,
  },
  {
    id: 'diego-to-elena',
    label: 'Que Diego salga de la escuela y vaya con Elena, aunque el plan diga otra cosa.',
    reliesOnMariana: false,
  },
]

export function memberText(plan: FamilyPlan, id: MemberId): string {
  return plan.members.find((member) => member.id === id)?.responsibility ?? ''
}
