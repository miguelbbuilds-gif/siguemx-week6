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
    label: 'Wait until Mariana can say what to do.',
  },
  {
    id: 'follow-backup',
    label: 'Diego follows the backup meeting plan without waiting for Mariana.',
  },
  {
    id: 'original-point',
    label: 'Continue to the original meeting point anyway.',
  },
]

export function repeatScenario(
  variation: VariationId,
  meetingPoint: string,
  backupPlace: string,
): RepeatScenario {
  if (variation === 'elena-without-coordinator') {
    return {
      title: 'Repeat — Elena without the coordinator',
      situation: `Mariana is unreachable. Elena may need a first step. The family cannot wait for the usual coordinator.`,
      prompt: 'What should happen first?',
      choices: [
        { id: 'help-elena', label: 'Someone goes to Elena without waiting for Mariana.' },
        { id: 'wait-mariana', label: 'Wait until Mariana can coordinate.' },
        { id: 'follow-backup', label: 'Use the backup meeting plan and include Elena in it.' },
      ],
    }
  }

  if (variation === 'blocked-with-backup') {
    return {
      title: 'Repeat — Backup meeting place',
      situation: `${meetingPoint} is still unavailable. The family now has a backup: ${backupPlace}.`,
      prompt: 'What should this family do first?',
      choices: SHARED_CHOICES,
    }
  }

  return {
    title: 'Repeat — Coordinator unreachable and meeting point blocked',
    situation: `Mariana cannot be reached. ${meetingPoint} is unavailable. Diego has a backup plan: ${backupPlace}.`,
    prompt: 'Should Diego follow the agreed backup plan?',
    choices: SHARED_CHOICES,
  }
}
