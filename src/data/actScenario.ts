import type { ActChoice } from '../domain/types.ts'

export const ACT_SCENARIO = {
  title: 'Decidir — Qué haces primero',
  prompt: '¿Qué haces primero?',
  situation:
    'Es de noche. La casa se mueve y las luces parpadean. No ves bien a todos, y no sabes si el movimiento va a parar.',
} as const

export const ACT_CHOICES: ActChoice[] = [
  {
    id: 'help-elena',
    label: 'Ir con Elena y moverse con ella a un lugar más seguro dentro de la casa.',
    assumesElenaWithoutPrompt: true,
  },
  {
    id: 'wait-mariana',
    label: 'Esperar a que Mariana diga qué hacer antes de moverse.',
    assumesElenaWithoutPrompt: false,
  },
  {
    id: 'move-self',
    label: 'Moverte tú a un lugar más seguro dentro de la casa, ahora.',
    assumesElenaWithoutPrompt: false,
  },
]
