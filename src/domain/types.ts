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

export type Screen = 'welcome' | 'setup' | 'ready'
