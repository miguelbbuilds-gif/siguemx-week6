import type { ActChoice } from '../domain/types.ts'

export const ACT_SCENARIO = {
  title: 'ACT — Quick decision',
  prompt: 'What do you do first?',
  situation:
    'It is night. The home shakes and the lights flicker. You cannot see everyone clearly, and you do not know if the shaking will stop.',
} as const

export const ACT_CHOICES: ActChoice[] = [
  {
    id: 'help-elena',
    label: 'Go to Elena and move with her to a safer place inside.',
    assumesElenaWithoutPrompt: true,
  },
  {
    id: 'wait-mariana',
    label: 'Wait for Mariana to say what to do before moving.',
    assumesElenaWithoutPrompt: false,
  },
  {
    id: 'move-self',
    label: 'Move yourself to a safer place inside now.',
    assumesElenaWithoutPrompt: false,
  },
]
