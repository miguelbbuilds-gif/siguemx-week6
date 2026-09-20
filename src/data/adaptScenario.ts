import type { AdaptChoice } from '../domain/types.ts'

export const ADAPT_SCENARIO = {
  title: 'ADAPT — Meeting point unavailable',
  prompt: 'The original meeting point cannot be used. What should this family do first?',
  blockedReason: 'That place is blocked. It is not a usable meeting point in this rehearsal.',
} as const

export const ADAPT_CHOICES: AdaptChoice[] = [
  {
    id: 'keep-meeting-point',
    label: 'Keep going to the original meeting point anyway.',
    repeatsFailedPlan: true,
    waitsForInstructions: false,
  },
  {
    id: 'wait-instructions',
    label: 'Wait for Mariana to say where to go next.',
    repeatsFailedPlan: false,
    waitsForInstructions: true,
  },
  {
    id: 'choose-alternative',
    label: 'Pick a nearby open place and treat that as the new meeting point.',
    repeatsFailedPlan: false,
    waitsForInstructions: false,
  },
]
