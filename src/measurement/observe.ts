import { memberText } from '../data/coordinateScenario.ts'
import type {
  ActChoice,
  ActRecord,
  AdaptChoice,
  AdaptRecord,
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
    return 'Fuiste con Elena aunque nadie te lo pidió. Eso es hacerse cargo sin que te lo indiquen.'
  }
  if (choice.id === 'wait-mariana') {
    return 'Esperaste a quien normalmente organiza antes de actuar. Elena no quedó en ese primer paso.'
  }
  return 'Primero te moviste tú. Elena no quedó en ese primer paso.'
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
    waitsForMariana:
      /wait(?:ing)? for mariana|until mariana|reach mariana first|call mariana first|esperar a mariana|hasta que mariana|hablar primero con mariana/.test(
        all,
      ),
    diegoHelpsElena:
      /\belena\b/.test(diego) && /help|assist|stay with|check|ayudar|revisar|quedarse con/.test(diego),
    diegoActsIfMarianaAbsent:
      /do not wait|don't wait|if mariana is not|without mariana|not wait only|no esperar|sin esperar|si mariana no|sin mariana|no esperar solo/.test(
        diego,
      ) || /do not wait|don't wait|no esperar|sin esperar/.test(all),
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
      return 'Esto sigue un plan que espera a Mariana. En esta práctica no se le puede hablar, así que la familia sigue sin un primer paso propio.'
    }
    if (signals.diegoActsIfMarianaAbsent) {
      return 'El plan escrito decía no esperar solo a Mariana. Esta decisión todavía depende de ella, y ahora no se le puede hablar.'
    }
    return 'Esperaste a Mariana. La familia está separada y ella no puede organizar en este momento.'
  }

  if (choice.id === 'follow-plan') {
    if (matchesPlan) {
      return 'Usaste el plan guardado sin esperar a Mariana. Eso es decidir sin quien normalmente organiza, cuando no se le puede hablar.'
    }
    return 'Elegiste no esperar a Mariana, pero eso no coincide con lo que está escrito en el plan de la familia.'
  }

  if (matchesPlan) {
    return 'Que Diego ayude a Elena sí coincide con el plan. Esta práctica recuerda que él está en la escuela, no junto a ella.'
  }
  return 'Esto no espera a Mariana, pero no coincide con el plan escrito de la familia.'
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

export function adaptMatchesOriginalMeetingPlan(
  choice: AdaptChoice,
  plan: FamilyPlan,
): boolean {
  return choice.repeatsFailedPlan && plan.meetingPoint.trim().length > 0
}

export function findingForAdapt(choice: AdaptChoice, plan: FamilyPlan): string {
  const place = plan.meetingPoint.trim() || 'el punto de reunión de siempre'

  if (choice.id === 'keep-meeting-point') {
    return `El plan guardado sigue nombrando ${place}. En esta práctica ese lugar no se puede usar. Ir allá otra vez es repetir un plan que ya falló, en vez de cambiar.`
  }
  if (choice.id === 'wait-instructions') {
    return `Esperaste indicaciones nuevas en vez de elegir otro lugar. ${place} ya no sirve, y no hace falta Mariana para dar un primer paso.`
  }
  return `Elegiste un lugar que sí se puede usar, en vez de seguir yendo a ${place}. Eso es cambiar el plan de reunión.`
}

export function recordAdaptDecision(
  choice: AdaptChoice,
  plan: FamilyPlan,
  startedAt: number,
  decidedAt: number,
  pausedMs = 0,
): AdaptRecord {
  return {
    choiceId: choice.id,
    label: choice.label,
    responseMs: measureResponseMs(startedAt, decidedAt, pausedMs),
    repeatsFailedPlan: choice.repeatsFailedPlan,
    choosesWorkableAlternative: choice.id === 'choose-alternative',
    matchesOriginalMeetingPlan: adaptMatchesOriginalMeetingPlan(choice, plan),
    finding: findingForAdapt(choice, plan),
  }
}
