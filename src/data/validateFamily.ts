import type { FamilyPlan, MemberId } from '../domain/types.ts'

export type FamilyErrors = Partial<Record<MemberId, string>>

const MIN = 8
const MAX = 120

export function validateFamilyPlan(plan: FamilyPlan): FamilyErrors {
  const errors: FamilyErrors = {}

  for (const member of plan.members) {
    const value = member.responsibility.trim()
    if (!value) {
      errors[member.id] = `Add ${member.name}'s responsibility.`
      continue
    }
    if (value.length < MIN) {
      errors[member.id] = 'Write a bit more so the family knows what to do.'
      continue
    }
    if (value.length > MAX) {
      errors[member.id] = `Keep this under ${MAX} characters.`
    }
  }

  return errors
}

export function hasFamilyErrors(errors: FamilyErrors): boolean {
  return Object.keys(errors).length > 0
}
