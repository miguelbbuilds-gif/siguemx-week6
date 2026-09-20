import type { FamilyPlan, MemberId } from '../domain/types.ts'

export type FamilyErrors = Partial<Record<MemberId | 'meetingPoint', string>>

const MIN = 8
const MAX = 120

export function validateFamilyPlan(plan: FamilyPlan): FamilyErrors {
  const errors: FamilyErrors = {}

  for (const member of plan.members) {
    const value = member.responsibility.trim()
    if (!value) {
      errors[member.id] = `Escribe qué hace ${member.name} en un sismo.`
      continue
    }
    if (value.length < MIN) {
      errors[member.id] = 'Escribe un poco más para que la familia sepa qué hacer.'
      continue
    }
    if (value.length > MAX) {
      errors[member.id] = `Deja esto en menos de ${MAX} letras.`
    }
  }

  const meetingPoint = plan.meetingPoint.trim()
  if (!meetingPoint) {
    errors.meetingPoint = 'Escribe el punto de reunión de la familia.'
  } else if (meetingPoint.length < 3) {
    errors.meetingPoint = 'Nombra el lugar con más claridad.'
  } else if (meetingPoint.length > MAX) {
    errors.meetingPoint = `Deja esto en menos de ${MAX} letras.`
  }

  return errors
}

export function hasFamilyErrors(errors: FamilyErrors): boolean {
  return Object.keys(errors).length > 0
}
