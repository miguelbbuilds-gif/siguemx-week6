import { useState } from 'react'
import { DEFAULT_FAMILY } from './data/family.ts'
import type { FamilyPlan, Screen } from './domain/types.ts'
import { ActRehearsal } from './ui/ActRehearsal.tsx'
import { AppChrome } from './ui/AppChrome.tsx'
import { FamilySetup } from './ui/FamilySetup.tsx'
import { Home } from './ui/Home.tsx'
import { Ready } from './ui/Ready.tsx'
import { StopPanel } from './ui/StopPanel.tsx'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [stopped, setStopped] = useState(false)
  const [family, setFamily] = useState<FamilyPlan>(DEFAULT_FAMILY)

  function goHome() {
    setStopped(false)
    setScreen('welcome')
  }

  return (
    <div className="app">
      <AppChrome
        currentMode={screen === 'act' ? 'ACT' : null}
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
            onEdit={() => setScreen('setup')}
            onHome={goHome}
            onStartAct={() => setScreen('act')}
          />
        ) : null}
        {screen === 'act' ? (
          <ActRehearsal paused={stopped} onLeave={() => setScreen('ready')} />
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
