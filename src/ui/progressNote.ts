import type { RehearsalMode, Screen } from '../domain/types.ts'

export function progressNote(args: {
  screen: Screen
  currentMode: RehearsalMode | null
  recordedModes: RehearsalMode[]
}): string {
  if (args.screen === 'loop-finding' || args.screen === 'loop-repeat' || args.screen === 'loop-compare') {
    return 'Adaptive repeat loop'
  }
  if (args.currentMode) return `${args.currentMode} rehearsal`
  if (args.recordedModes.length === 3) return 'Family plan · three modes recorded'
  if (args.recordedModes.length > 0) {
    return `Family plan · recorded: ${args.recordedModes.join(', ')}`
  }
  if (args.screen === 'ready' || args.screen === 'setup') return 'Family plan · no decisions yet'
  return 'Family setup · rehearsals not started'
}
