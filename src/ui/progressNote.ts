import type { RehearsalMode, Screen } from '../domain/types.ts'
import { modeLabel } from './labels.ts'

export function progressNote(args: {
  screen: Screen
  currentMode: RehearsalMode | null
  recordedModes: RehearsalMode[]
}): string {
  if (args.screen === 'loop-finding' || args.screen === 'loop-repeat' || args.screen === 'loop-compare') {
    return 'Segunda práctica'
  }
  if (args.currentMode) return `Práctica: ${modeLabel(args.currentMode)}`
  if (args.recordedModes.length === 3) return 'Plan de la familia · tres prácticas hechas'
  if (args.recordedModes.length > 0) {
    return `Plan de la familia · ya hiciste: ${args.recordedModes.map(modeLabel).join(', ')}`
  }
  if (args.screen === 'ready' || args.screen === 'setup') return 'Plan de la familia · aún no decides'
  return 'Aún no empieza la práctica'
}
