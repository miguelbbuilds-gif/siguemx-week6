import type { ActChoice, ActRecord } from '../domain/types.ts'

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
