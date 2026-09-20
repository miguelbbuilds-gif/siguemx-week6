import { ACT_CHOICES } from '../src/data/actScenario.ts'
import { recordActDecision } from '../src/measurement/observe.ts'
import {
  observationFromAct,
  observationFromAdapt,
  observationFromCoordinate,
  runAdaptiveEngine,
} from '../src/adaptive/loop.ts'
import { matchActSpeech } from '../src/voice/speech.ts'
import { progressNote } from '../src/ui/progressNote.ts'

const checks: Array<{ name: string; ok: boolean }> = []

function assert(name: string, ok: boolean) {
  checks.push({ name, ok: Boolean(ok) })
  if (!ok) console.error('FAIL', name)
}

const elena = matchActSpeech('Go to Elena now')
const wait = matchActSpeech('Wait for Mariana')
const self = matchActSpeech('Move myself to a safer place')
const miss = matchActSpeech('hello there')

assert('voice maps Elena', elena?.id === 'help-elena')
assert('voice maps wait', wait?.id === 'wait-mariana')
assert('voice maps self', self?.id === 'move-self')
assert('unmatched speech is null', miss === null)

const tapped = recordActDecision(ACT_CHOICES[1], 1000, 2500, 200)
assert('tap record is structured', tapped.choiceId === 'wait-mariana')
assert('response time subtracts pause', tapped.responseMs === 1300)

if (!elena) throw new Error('Elena match missing')
const voiced = recordActDecision(elena, 1000, 2500, 200)
assert('voice uses same measurement', voiced.choiceId === 'help-elena' && voiced.responseMs === 1300)

const engineFromVoice = runAdaptiveEngine([
  observationFromAct(voiced),
  observationFromCoordinate({
    choiceId: 'follow-plan',
    label: 'Follow the saved family plan now. Do not wait for Mariana.',
    responseMs: 800,
    reliesOnMariana: false,
    matchesPlan: true,
    finding: 'ok',
  }),
  observationFromAdapt({
    choiceId: 'keep-meeting-point',
    label: 'Keep going to the original meeting point anyway.',
    responseMs: 900,
    repeatsFailedPlan: true,
    choosesWorkableAlternative: false,
    matchesOriginalMeetingPlan: true,
    finding: 'ok',
  }),
])

assert(
  'engine receives voice-shaped ACT record',
  engineFromVoice.weakness === 'repeats-failed-plan' &&
    engineFromVoice.variation === 'blocked-with-backup',
)

const engineWait = runAdaptiveEngine([
  observationFromAct(tapped),
  observationFromCoordinate({
    choiceId: 'follow-plan',
    label: 'follow',
    responseMs: 1,
    reliesOnMariana: false,
    matchesPlan: true,
    finding: 'ok',
  }),
  observationFromAdapt({
    choiceId: 'choose-alternative',
    label: 'alt',
    responseMs: 1,
    repeatsFailedPlan: false,
    choosesWorkableAlternative: true,
    matchesOriginalMeetingPlan: false,
    finding: 'ok',
  }),
])

assert(
  'wait-for-Mariana path triggers coordinator variation',
  engineWait.weakness === 'depends-on-coordinator' &&
    engineWait.variation === 'unreachable-and-blocked',
)

assert(
  'ready screen does not say rehearsals not started',
  progressNote({ screen: 'ready', currentMode: null, recordedModes: [] }) ===
    'Family plan · no decisions yet',
)
assert(
  'recorded ACT is visible in the header',
  progressNote({ screen: 'ready', currentMode: null, recordedModes: ['ACT'] }) ===
    'Family plan · recorded: ACT',
)
assert(
  'welcome with no records still says not started',
  progressNote({ screen: 'welcome', currentMode: null, recordedModes: [] }) ===
    'Family setup · rehearsals not started',
)

const failed = checks.filter((item) => !item.ok)
console.log(JSON.stringify({ passed: checks.length - failed.length, total: checks.length, failed }, null, 2))
if (failed.length) process.exit(1)
