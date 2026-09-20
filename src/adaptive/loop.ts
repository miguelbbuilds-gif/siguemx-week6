import type {
  ActRecord,
  AdaptRecord,
  AdaptiveResult,
  BehaviorObservation,
  CoordinateRecord,
  RepeatChoice,
  RepeatRecord,
  RehearsalMode,
  VariationId,
  WeaknessId,
} from '../domain/types.ts'
import { measureResponseMs } from '../measurement/observe.ts'

export function observationFromAct(record: ActRecord, attempt: 1 | 2 = 1): BehaviorObservation {
  const detectedWeakness: WeaknessId =
    record.choiceId === 'wait-mariana'
      ? 'depends-on-coordinator'
      : record.choiceId === 'move-self'
        ? 'skips-elena'
        : 'none'

  return {
    mode: 'ACT',
    attempt,
    decisionId: record.choiceId,
    decisionLabel: record.label,
    responseMs: record.responseMs,
    responsibilityWithoutPrompting: record.assumesElenaWithoutPrompt,
    planConsistency: null,
    adaptation: null,
    detectedWeakness,
  }
}

export function observationFromCoordinate(
  record: CoordinateRecord,
  attempt: 1 | 2 = 1,
): BehaviorObservation {
  const detectedWeakness: WeaknessId = record.reliesOnMariana
    ? 'depends-on-coordinator'
    : 'none'

  return {
    mode: 'COORDINATE',
    attempt,
    decisionId: record.choiceId,
    decisionLabel: record.label,
    responseMs: record.responseMs,
    responsibilityWithoutPrompting: null,
    planConsistency: record.matchesPlan,
    adaptation: null,
    detectedWeakness,
  }
}

export function observationFromAdapt(
  record: AdaptRecord,
  attempt: 1 | 2 = 1,
): BehaviorObservation {
  const detectedWeakness: WeaknessId = record.choiceId === 'wait-instructions'
    ? 'depends-on-coordinator'
    : record.repeatsFailedPlan
      ? 'repeats-failed-plan'
      : 'none'

  return {
    mode: 'ADAPT',
    attempt,
    decisionId: record.choiceId,
    decisionLabel: record.label,
    responseMs: record.responseMs,
    responsibilityWithoutPrompting: null,
    planConsistency: record.matchesOriginalMeetingPlan,
    adaptation: record.choosesWorkableAlternative,
    detectedWeakness,
  }
}

const WEAKNESS_ORDER: Array<Exclude<WeaknessId, 'none'>> = [
  'depends-on-coordinator',
  'repeats-failed-plan',
  'skips-elena',
]

const VARIATION_FOR: Record<Exclude<WeaknessId, 'none'>, VariationId> = {
  'depends-on-coordinator': 'unreachable-and-blocked',
  'repeats-failed-plan': 'blocked-with-backup',
  'skips-elena': 'elena-without-coordinator',
}

const FINDING_FOR: Record<Exclude<WeaknessId, 'none'>, string> = {
  'depends-on-coordinator':
    'One weakness: dependence on the normal family coordinator. The next rehearsal will make Mariana unreachable while the original meeting point is also unavailable.',
  'repeats-failed-plan':
    'One weakness: repeating the original meeting point after it failed. The next rehearsal will keep that place blocked and require a backup place.',
  'skips-elena':
    'One weakness: Elena’s need was not taken in the first move. The next rehearsal will keep Mariana unreachable so someone else must decide about Elena.',
}

export function runAdaptiveEngine(observations: BehaviorObservation[]): AdaptiveResult {
  const first = observations.filter((item) => item.attempt === 1)

  for (const weakness of WEAKNESS_ORDER) {
    const source = first.find((item) => item.detectedWeakness === weakness)
    if (!source) continue
    return {
      weakness,
      variation: VARIATION_FOR[weakness],
      finding: FINDING_FOR[weakness],
      sourceMode: source.mode,
      sourceLabel: source.decisionLabel,
    }
  }

  return {
    weakness: 'none',
    variation: 'none',
    finding:
      'No single weakness stood out in these three decisions. The original modes still work; there is no modified repeat for this round.',
    sourceMode: null,
    sourceLabel: '',
  }
}

export function summarizeAttempt(observation: BehaviorObservation): string {
  if (
    observation.decisionId === 'wait-mariana' ||
    observation.decisionId === 'wait-instructions'
  ) {
    return 'You waited for Mariana.'
  }
  if (observation.decisionId === 'follow-backup' || observation.decisionId === 'follow-plan') {
    return 'You followed the backup plan without waiting.'
  }
  if (observation.decisionId === 'choose-alternative') {
    return 'You chose a new meeting place.'
  }
  if (observation.decisionId === 'keep-meeting-point' || observation.decisionId === 'original-point') {
    return 'You continued toward the original meeting point.'
  }
  if (observation.decisionId === 'help-elena') {
    return 'You went to Elena without waiting to be told.'
  }
  if (observation.decisionId === 'move-self') {
    return 'You moved yourself first.'
  }
  if (observation.decisionId === 'diego-to-elena') {
    return 'You sent Diego toward Elena without waiting for Mariana.'
  }
  return observation.decisionLabel
}

export function compareAttempts(
  first: BehaviorObservation,
  second: BehaviorObservation,
): { first: string; second: string } {
  return {
    first: `First attempt: ${summarizeAttempt(first)}`,
    second: `Second attempt: ${summarizeAttempt(second)}`,
  }
}

export function observationFromRepeat(
  record: RepeatRecord,
  mode: RehearsalMode,
): BehaviorObservation {
  const detectedWeakness: WeaknessId =
    record.choiceId === 'wait-mariana'
      ? 'depends-on-coordinator'
      : record.choiceId === 'original-point'
        ? 'repeats-failed-plan'
        : record.choiceId === 'help-elena'
          ? 'none'
          : 'none'

  return {
    mode,
    attempt: 2,
    decisionId: record.choiceId,
    decisionLabel: record.label,
    responseMs: record.responseMs,
    responsibilityWithoutPrompting: record.choiceId === 'help-elena' ? true : null,
    planConsistency: record.choiceId === 'follow-backup' ? true : record.choiceId === 'original-point',
    adaptation: record.choiceId === 'follow-backup',
    detectedWeakness,
  }
}

export function findingForRepeat(choice: RepeatChoice, backupPlace: string): string {
  if (choice.id === 'follow-backup') {
    return `You used the backup plan (${backupPlace}) without waiting for Mariana.`
  }
  if (choice.id === 'help-elena') {
    return 'You took responsibility for Elena without waiting for Mariana.'
  }
  if (choice.id === 'wait-mariana') {
    return 'You still waited for the usual coordinator while she was unreachable.'
  }
  return 'You still aimed at the original meeting point after it was unavailable.'
}

export function recordRepeatDecision(
  choice: RepeatChoice,
  backupPlace: string,
  startedAt: number,
  decidedAt: number,
  pausedMs = 0,
): RepeatRecord {
  return {
    choiceId: choice.id,
    label: choice.label,
    responseMs: measureResponseMs(startedAt, decidedAt, pausedMs),
    finding: findingForRepeat(choice, backupPlace),
  }
}

export function planChangePrompt(weakness: WeaknessId): {
  label: string
  suggested: string
  backupPlace: string
} | null {
  if (weakness === 'depends-on-coordinator' || weakness === 'repeats-failed-plan') {
    return {
      label: 'Change one part of the plan: Diego’s responsibility for a backup meeting place.',
      suggested:
        'Diego follows the backup meeting place (school courtyard) without waiting for Mariana.',
      backupPlace: 'the school courtyard',
    }
  }
  if (weakness === 'skips-elena') {
    return {
      label: 'Change one part of the plan: who helps Elena if Mariana cannot coordinate.',
      suggested: 'Diego checks on Elena first if Mariana cannot be reached.',
      backupPlace: 'the school courtyard',
    }
  }
  return null
}
