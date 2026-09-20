import type { CoordinateChoice, FamilyPlan, MemberId } from '../domain/types.ts'

export const COORDINATE_SCENARIO = {
  title: 'COORDINATE — Separated family',
  prompt: 'Mariana cannot coordinate. What should this family do first?',
  situation:
    'The ground shakes while the family is apart. Mariana is at work and cannot be reached. Elena is at home. Diego is at school.',
} as const

export const COORDINATE_PLACES: { id: MemberId; place: string; note: string }[] = [
  { id: 'mariana', place: 'Work', note: 'Coordinator · unreachable' },
  { id: 'elena', place: 'Home', note: 'May need assistance' },
  { id: 'diego', place: 'School', note: 'Must act without Mariana' },
]

export const COORDINATE_CHOICES: CoordinateChoice[] = [
  {
    id: 'follow-plan',
    label: 'Follow the saved family plan now. Do not wait for Mariana.',
    reliesOnMariana: false,
  },
  {
    id: 'wait-mariana',
    label: 'Keep trying to reach Mariana before anyone else acts.',
    reliesOnMariana: true,
  },
  {
    id: 'diego-to-elena',
    label: 'Have Diego leave school and go to Elena, even if the plan says something else.',
    reliesOnMariana: false,
  },
]

export function memberText(plan: FamilyPlan, id: MemberId): string {
  return plan.members.find((member) => member.id === id)?.responsibility ?? ''
}
