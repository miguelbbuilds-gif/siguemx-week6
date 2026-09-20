export const REHEARSAL_MODES = ['ACT', 'COORDINATE', 'ADAPT'] as const

export type RehearsalMode = (typeof REHEARSAL_MODES)[number]

export type MemberId = 'mariana' | 'elena' | 'diego'

export type FamilyMember = {
  id: MemberId
  name: string
  age: number
  role: string
  responsibility: string
}

export type FamilyPlan = {
  members: FamilyMember[]
}

export type Screen = 'welcome' | 'setup' | 'ready' | 'act'

export type ActChoiceId = 'help-elena' | 'wait-mariana' | 'move-self'

export type ActChoice = {
  id: ActChoiceId
  label: string
  assumesElenaWithoutPrompt: boolean
}

export type ActRecord = {
  choiceId: ActChoiceId
  label: string
  responseMs: number
  assumesElenaWithoutPrompt: boolean
  finding: string
}
