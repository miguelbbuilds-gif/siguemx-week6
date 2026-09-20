import { memberText } from '../data/coordinateScenario.ts'
import type {
  ActChoice,
  ActRecord,
  CoordinateChoice,
  CoordinateRecord,
  FamilyPlan,
  PlanSignals,
} from '../domain/types.ts'

export function measureResponseMs(startedAt: number, decidedAt: number, pausedMs = 0): number {
  return Math.max(0, decidedAt - startedAt - pausedMs)
}

export function findingForActChoice(choice: ActChoice): string {
  if (choice.assumesElenaWithoutPrompt) {
    return 'You went to Elena without being told to. That is assuming responsibility without prompting.'
  }
  if (choice.id === 'wait-mariana') {
    return 'You waited for the usual coordinator before acting. Elena was not included in that first decision.'
  }
  return 'You moved yourself first. Elena was not included in that first decision.'
}

export function recordActDecision(
  choice: ActChoice,
  startedAt: number,
  decidedAt: number,
  pausedMs = 0,
): ActRecord {
  return {
    choiceId: choice.id,
    label: choice.label,
    responseMs: measureResponseMs(startedAt, decidedAt, pausedMs),
    assumesElenaWithoutPrompt: choice.assumesElenaWithoutPrompt,
    finding: findingForActChoice(choice),
  }
}

export function formatResponseTime(ms: number): string {
  const seconds = ms / 1000
  return `${seconds.toFixed(1)}s`
}

export function readPlanSignals(plan: FamilyPlan): PlanSignals {
  const diego = memberText(plan, 'diego').toLowerCase()
  const all = plan.members.map((member) => member.responsibility.toLowerCase()).join(' ')

  return {
    waitsForMariana: /wait(?:ing)? for mariana|until mariana|reach mariana first|call mariana first/.test(
      all,
    ),
    diegoHelpsElena: /\belena\b/.test(diego) && /help|assist|stay with|check/.test(diego),
    diegoActsIfMarianaAbsent:
      /do not wait|don't wait|if mariana is not|without mariana|not wait only/.test(diego) ||
      /do not wait|don't wait/.test(all),
  }
}

export function coordinateMatchesPlan(choice: CoordinateChoice, plan: FamilyPlan): boolean {
  const signals = readPlanSignals(plan)

  if (choice.id === 'wait-mariana') {
    return signals.waitsForMariana && !signals.diegoActsIfMarianaAbsent
  }
  if (choice.id === 'follow-plan') {
    return signals.diegoActsIfMarianaAbsent || (!signals.waitsForMariana && signals.diegoHelpsElena)
  }
  return signals.diegoHelpsElena && !signals.waitsForMariana
}

export function findingForCoordinate(choice: CoordinateChoice, plan: FamilyPlan): string {
  const matchesPlan = coordinateMatchesPlan(choice, plan)
  const signals = readPlanSignals(plan)

  if (choice.id === 'wait-mariana') {
    if (matchesPlan) {
      return 'This follows a plan that waits for Mariana. COORDINATE is the moment she cannot be reached, so the family still has no independent first step.'
    }
    if (signals.diegoActsIfMarianaAbsent) {
      return 'The saved plan said not to wait only for Mariana. This decision still relies on the coordinator while she is unreachable.'
    }
    return 'You waited for Mariana. The family is separated and she cannot coordinate right now.'
  }

  if (choice.id === 'follow-plan') {
    if (matchesPlan) {
      return 'You used the saved plan without waiting for Mariana. That is independent decision-making while the coordinator is unreachable.'
    }
    return 'You chose not to wait for Mariana, but that does not match the written family responsibilities.'
  }

  if (matchesPlan) {
    return 'Diego helping Elena matches the saved plan. This rehearsal still notes that he is at school, not already with her.'
  }
  return 'This does not wait for Mariana, but it does not match the written family plan.'
}

export function recordCoordinateDecision(
  choice: CoordinateChoice,
  plan: FamilyPlan,
  startedAt: number,
  decidedAt: number,
  pausedMs = 0,
): CoordinateRecord {
  return {
    choiceId: choice.id,
    label: choice.label,
    responseMs: measureResponseMs(startedAt, decidedAt, pausedMs),
    reliesOnMariana: choice.reliesOnMariana,
    matchesPlan: coordinateMatchesPlan(choice, plan),
    finding: findingForCoordinate(choice, plan),
  }
}
