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
  meetingPoint: string
  backupMeetingPoint: string
}

export type Screen =
  | 'welcome'
  | 'setup'
  | 'ready'
  | 'act'
  | 'coordinate'
  | 'adapt'
  | 'loop-finding'
  | 'loop-repeat'
  | 'loop-compare'

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

export type CoordinateChoiceId = 'follow-plan' | 'wait-mariana' | 'diego-to-elena'

export type CoordinateChoice = {
  id: CoordinateChoiceId
  label: string
  reliesOnMariana: boolean
}

export type PlanSignals = {
  waitsForMariana: boolean
  diegoHelpsElena: boolean
  diegoActsIfMarianaAbsent: boolean
}

export type CoordinateRecord = {
  choiceId: CoordinateChoiceId
  label: string
  responseMs: number
  reliesOnMariana: boolean
  matchesPlan: boolean
  finding: string
}

export type AdaptChoiceId = 'keep-meeting-point' | 'wait-instructions' | 'choose-alternative'

export type AdaptChoice = {
  id: AdaptChoiceId
  label: string
  repeatsFailedPlan: boolean
  waitsForInstructions: boolean
}

export type AdaptRecord = {
  choiceId: AdaptChoiceId
  label: string
  responseMs: number
  repeatsFailedPlan: boolean
  choosesWorkableAlternative: boolean
  matchesOriginalMeetingPlan: boolean
  finding: string
}

export type WeaknessId =
  | 'depends-on-coordinator'
  | 'repeats-failed-plan'
  | 'skips-elena'
  | 'none'

export type VariationId =
  | 'unreachable-and-blocked'
  | 'blocked-with-backup'
  | 'elena-without-coordinator'
  | 'none'

export type BehaviorObservation = {
  mode: RehearsalMode
  attempt: 1 | 2
  decisionId: string
  decisionLabel: string
  responseMs: number
  responsibilityWithoutPrompting: boolean | null
  planConsistency: boolean | null
  adaptation: boolean | null
  detectedWeakness: WeaknessId
}

export type RepeatChoiceId = 'wait-mariana' | 'follow-backup' | 'original-point' | 'help-elena'

export type RepeatChoice = {
  id: RepeatChoiceId
  label: string
}

export type RepeatRecord = {
  choiceId: RepeatChoiceId
  label: string
  responseMs: number
  finding: string
}

export type AdaptiveResult = {
  weakness: WeaknessId
  variation: VariationId
  finding: string
  sourceMode: RehearsalMode | null
  sourceLabel: string
}
