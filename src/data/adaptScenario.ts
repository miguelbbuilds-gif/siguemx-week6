import type { AdaptChoice } from '../domain/types.ts'

export const ADAPT_SCENARIO = {
  title: 'Otro plan — El punto de reunión no se puede usar',
  prompt: 'El punto de reunión de siempre no se puede usar. ¿Qué debería hacer primero esta familia?',
  blockedReason: 'Ese lugar está cerrado. En esta práctica no sirve como punto de reunión.',
} as const

export const ADAPT_CHOICES: AdaptChoice[] = [
  {
    id: 'keep-meeting-point',
    label: 'Ir igual al punto de reunión de siempre.',
    repeatsFailedPlan: true,
    waitsForInstructions: false,
  },
  {
    id: 'wait-instructions',
    label: 'Esperar a que Mariana diga a dónde ir.',
    repeatsFailedPlan: false,
    waitsForInstructions: true,
  },
  {
    id: 'choose-alternative',
    label: 'Elegir un lugar cercano y abierto y usarlo como nuevo punto de reunión.',
    repeatsFailedPlan: false,
    waitsForInstructions: false,
  },
]
