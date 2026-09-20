import type { FamilyPlan } from '../domain/types.ts'

/** Synthetic household. Invented for demonstration only. Not real people. */
export const DEFAULT_FAMILY: FamilyPlan = {
  meetingPoint: 'the neighborhood plaza',
  backupMeetingPoint: '',
  members: [
    {
      id: 'mariana',
      name: 'Mariana',
      age: 46,
      role: 'Mother and family coordinator',
      responsibility: 'Coordinate the family and help Elena reach a safe open area.',
    },
    {
      id: 'elena',
      name: 'Elena',
      age: 72,
      role: 'Grandmother who may need assistance',
      responsibility: 'Stay with someone and move to the agreed meeting point when helped.',
    },
    {
      id: 'diego',
      name: 'Diego',
      age: 15,
      role: 'Son',
      responsibility: 'Help Elena if Mariana is not there. Do not wait only for Mariana.',
    },
  ],
}
