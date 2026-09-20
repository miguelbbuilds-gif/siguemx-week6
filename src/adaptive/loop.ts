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
    'Un punto débil: esperar a quien normalmente organiza a la familia. La siguiente práctica hará que no se pueda hablar con Mariana, y además el punto de reunión de siempre no se podrá usar.',
  'repeats-failed-plan':
    'Un punto débil: volver al punto de reunión después de que ya no se pudo usar. La siguiente práctica dejará ese lugar cerrado y pedirá un lugar de respaldo.',
  'skips-elena':
    'Un punto débil: en el primer paso no se pensó en Elena. La siguiente práctica hará que no se pueda hablar con Mariana, para que otra persona decida sobre Elena.',
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
      'En estas tres decisiones no destacó un solo punto débil. Las prácticas de siempre siguen disponibles; en esta ronda no hay una segunda práctica distinta.',
    sourceMode: null,
    sourceLabel: '',
  }
}

export function summarizeAttempt(observation: BehaviorObservation): string {
  if (
    observation.decisionId === 'wait-mariana' ||
    observation.decisionId === 'wait-instructions'
  ) {
    return 'Esperaste a Mariana.'
  }
  if (observation.decisionId === 'follow-backup' || observation.decisionId === 'follow-plan') {
    return 'Seguiste el plan sin esperar.'
  }
  if (observation.decisionId === 'choose-alternative') {
    return 'Elegiste un lugar nuevo para reunirse.'
  }
  if (observation.decisionId === 'keep-meeting-point' || observation.decisionId === 'original-point') {
    return 'Seguiste hacia el punto de reunión de siempre.'
  }
  if (observation.decisionId === 'help-elena') {
    return 'Fuiste con Elena sin esperar a que te lo dijeran.'
  }
  if (observation.decisionId === 'move-self') {
    return 'Primero te moviste tú.'
  }
  if (observation.decisionId === 'diego-to-elena') {
    return 'Mandaste a Diego con Elena sin esperar a Mariana.'
  }
  return observation.decisionLabel
}

export function compareAttempts(
  first: BehaviorObservation,
  second: BehaviorObservation,
): { first: string; second: string } {
  return {
    first: `Primera vez: ${summarizeAttempt(first)}`,
    second: `Segunda vez: ${summarizeAttempt(second)}`,
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
    return `Usaste el plan de respaldo (${backupPlace}) sin esperar a Mariana.`
  }
  if (choice.id === 'help-elena') {
    return 'Te hiciste cargo de Elena sin esperar a Mariana.'
  }
  if (choice.id === 'wait-mariana') {
    return 'Otra vez esperaste a quien normalmente organiza, aunque no se le podía hablar.'
  }
  return 'Otra vez te dirigiste al punto de reunión de siempre, después de que ya no se podía usar.'
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
      label: 'Cambia una parte del plan: qué hace Diego con un punto de reunión de respaldo.',
      suggested:
        'Diego va al patio de la escuela, que es el punto de reunión de respaldo, sin esperar a Mariana.',
      backupPlace: 'el patio de la escuela',
    }
  }
  if (weakness === 'skips-elena') {
    return {
      label: 'Cambia una parte del plan: quién ayuda a Elena si no se puede hablar con Mariana.',
      suggested: 'Diego pregunta por Elena primero si no se puede hablar con Mariana.',
      backupPlace: 'el patio de la escuela',
    }
  }
  return null
}
