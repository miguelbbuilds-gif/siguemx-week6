import type { RepeatChoice, VariationId } from '../domain/types.ts'

export type RepeatScenario = {
  title: string
  situation: string
  prompt: string
  choices: RepeatChoice[]
}

const SHARED_CHOICES: RepeatChoice[] = [
  {
    id: 'wait-mariana',
    label: 'Esperar a que Mariana pueda decir qué hacer.',
  },
  {
    id: 'follow-backup',
    label: 'Diego sigue el punto de reunión de respaldo, sin esperar a Mariana.',
  },
  {
    id: 'original-point',
    label: 'Ir igual al punto de reunión de siempre.',
  },
]

export function repeatScenario(
  variation: VariationId,
  meetingPoint: string,
  backupPlace: string,
): RepeatScenario {
  if (variation === 'elena-without-coordinator') {
    return {
      title: 'Otra vez — Elena sin quien normalmente organiza',
      situation:
        'No se puede hablar con Mariana. Elena puede necesitar un primer paso. La familia no puede esperar a quien normalmente organiza.',
      prompt: '¿Qué debería pasar primero?',
      choices: [
        { id: 'help-elena', label: 'Alguien va con Elena sin esperar a Mariana.' },
        { id: 'wait-mariana', label: 'Esperar a que Mariana pueda organizar.' },
        { id: 'follow-backup', label: 'Usar el punto de reunión de respaldo e incluir a Elena.' },
      ],
    }
  }

  if (variation === 'blocked-with-backup') {
    return {
      title: 'Otra vez — Punto de reunión de respaldo',
      situation: `${meetingPoint} sigue sin poder usarse. Ahora la familia tiene un respaldo: ${backupPlace}.`,
      prompt: '¿Qué debería hacer primero esta familia?',
      choices: SHARED_CHOICES,
    }
  }

  return {
    title: 'Otra vez — No hay forma de hablar con Mariana y el punto de reunión está cerrado',
    situation: `No se puede hablar con Mariana. ${meetingPoint} no se puede usar. Diego tiene un plan de respaldo: ${backupPlace}.`,
    prompt: '¿Debería Diego seguir el punto de reunión de respaldo?',
    choices: SHARED_CHOICES,
  }
}
