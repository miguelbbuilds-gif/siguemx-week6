import type { RehearsalMode } from '../domain/types.ts'

export const MODE_LABEL: Record<RehearsalMode, string> = {
  ACT: 'Decidir',
  COORDINATE: 'Separados',
  ADAPT: 'Otro plan',
}

export function modeLabel(mode: RehearsalMode): string {
  return MODE_LABEL[mode]
}

export function yesNo(value: boolean): string {
  return value ? 'sí' : 'no'
}
