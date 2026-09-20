import { useMemo, useState } from 'react'
import {
  observationFromAct,
  observationFromAdapt,
  observationFromCoordinate,
  observationFromRepeat,
  runAdaptiveEngine,
} from './adaptive/loop.ts'
import { DEFAULT_FAMILY } from './data/family.ts'
import type {
  ActRecord,
  AdaptRecord,
  CoordinateRecord,
  FamilyPlan,
  RepeatRecord,
  RehearsalMode,
  Screen,
} from './domain/types.ts'
import { AdaptRehearsal } from './ui/AdaptRehearsal.tsx'
import { ActRehearsal } from './ui/ActRehearsal.tsx'
import { AppChrome } from './ui/AppChrome.tsx'
import { CoordinateRehearsal } from './ui/CoordinateRehearsal.tsx'
import { FamilySetup } from './ui/FamilySetup.tsx'
import { Home } from './ui/Home.tsx'
import { LoopCompare } from './ui/LoopCompare.tsx'
import { LoopFinding } from './ui/LoopFinding.tsx'
import { LoopRepeat } from './ui/LoopRepeat.tsx'
import { progressNote } from './ui/progressNote.ts'
import { Ready } from './ui/Ready.tsx'
import { StopPanel } from './ui/StopPanel.tsx'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [stopped, setStopped] = useState(false)
  const [family, setFamily] = useState<FamilyPlan>(DEFAULT_FAMILY)
  const [actRecord, setActRecord] = useState<ActRecord | null>(null)
  const [coordinateRecord, setCoordinateRecord] = useState<CoordinateRecord | null>(null)
  const [adaptRecord, setAdaptRecord] = useState<AdaptRecord | null>(null)
  const [repeatRecord, setRepeatRecord] = useState<RepeatRecord | null>(null)

  const firstObservations = useMemo(() => {
    const items = []
    if (actRecord) items.push(observationFromAct(actRecord))
    if (coordinateRecord) items.push(observationFromCoordinate(coordinateRecord))
    if (adaptRecord) items.push(observationFromAdapt(adaptRecord))
    return items
  }, [actRecord, coordinateRecord, adaptRecord])

  const engine = useMemo(() => runAdaptiveEngine(firstObservations), [firstObservations])
  const allModesDone = Boolean(actRecord && coordinateRecord && adaptRecord)
  const backupPlace = family.backupMeetingPoint.trim() || 'the school courtyard'

  function goHome() {
    setStopped(false)
    setScreen('welcome')
  }

  const chromeMode =
    screen === 'act'
      ? 'ACT'
      : screen === 'coordinate'
        ? 'COORDINATE'
        : screen === 'adapt'
          ? 'ADAPT'
          : null

  const recordedModes: RehearsalMode[] = [
    actRecord ? ('ACT' as const) : null,
    coordinateRecord ? ('COORDINATE' as const) : null,
    adaptRecord ? ('ADAPT' as const) : null,
  ].filter((mode): mode is RehearsalMode => mode !== null)

  return (
    <div className="app">
      <AppChrome
        currentMode={chromeMode}
        note={progressNote({
          screen,
          currentMode: chromeMode,
          recordedModes,
        })}
        onStop={() => setStopped(true)}
      />
      <main>
        {screen === 'welcome' ? (
          <Home family={family} onSetup={() => setScreen('setup')} />
        ) : null}
        {screen === 'setup' ? (
          <FamilySetup
            family={family}
            onBack={() => setScreen('welcome')}
            onSave={(plan) => {
              setFamily(plan)
              setScreen('ready')
            }}
          />
        ) : null}
        {screen === 'ready' ? (
          <Ready
            family={family}
            allModesDone={allModesDone}
            onEdit={() => setScreen('setup')}
            onHome={goHome}
            onStartAct={() => setScreen('act')}
            onStartCoordinate={() => setScreen('coordinate')}
            onStartAdapt={() => setScreen('adapt')}
            onReviewLoop={() => setScreen('loop-finding')}
          />
        ) : null}
        {screen === 'act' ? (
          <ActRehearsal
            paused={stopped}
            onLeave={() => setScreen('ready')}
            onRecord={setActRecord}
          />
        ) : null}
        {screen === 'coordinate' ? (
          <CoordinateRehearsal
            family={family}
            paused={stopped}
            onLeave={() => setScreen('ready')}
            onRecord={setCoordinateRecord}
          />
        ) : null}
        {screen === 'adapt' ? (
          <AdaptRehearsal
            family={family}
            paused={stopped}
            onLeave={() => setScreen('ready')}
            onRecord={setAdaptRecord}
          />
        ) : null}
        {screen === 'loop-finding' ? (
          <LoopFinding
            result={engine}
            family={family}
            onSavePlan={setFamily}
            onRehearse={() => {
              setRepeatRecord(null)
              setScreen('loop-repeat')
            }}
            onBack={() => setScreen('ready')}
          />
        ) : null}
        {screen === 'loop-repeat' ? (
          <LoopRepeat
            variation={engine.variation}
            meetingPoint={family.meetingPoint}
            backupPlace={backupPlace}
            paused={stopped}
            onResolved={setRepeatRecord}
            onCompare={() => setScreen('loop-compare')}
          />
        ) : null}
        {screen === 'loop-compare' && repeatRecord && engine.sourceMode ? (
          <LoopCompare
            first={
              firstObservations.find((item) => item.mode === engine.sourceMode) ??
              firstObservations[0]
            }
            second={observationFromRepeat(repeatRecord, engine.sourceMode)}
            onHome={() => setScreen('ready')}
          />
        ) : null}
      </main>
      {stopped ? (
        <div className="stop-overlay">
          <StopPanel
            onReturnHome={goHome}
            onContinue={() => setStopped(false)}
          />
        </div>
      ) : null}
    </div>
  )
}
