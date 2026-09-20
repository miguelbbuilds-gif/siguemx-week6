import type { FamilyPlan } from '../domain/types.ts'

/** Familia inventada. Solo para practicar. No son personas reales. */
export const DEFAULT_FAMILY: FamilyPlan = {
  meetingPoint: 'la plaza del barrio',
  backupMeetingPoint: '',
  members: [
    {
      id: 'mariana',
      name: 'Mariana',
      age: 46,
      role: 'Mamá. Persona que normalmente organiza a la familia',
      responsibility: 'Organizar a la familia y ayudar a Elena a llegar a un lugar abierto y seguro.',
    },
    {
      id: 'elena',
      name: 'Elena',
      age: 72,
      role: 'Abuela. Puede necesitar ayuda',
      responsibility: 'Quedarse con alguien y, cuando la ayuden, ir al punto de reunión.',
    },
    {
      id: 'diego',
      name: 'Diego',
      age: 15,
      role: 'Hijo',
      responsibility: 'Ayudar a Elena si Mariana no está. No esperar solo a Mariana.',
    },
  ],
}
