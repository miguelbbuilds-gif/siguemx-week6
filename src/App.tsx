import { useState } from 'react'
import { DEFAULT_FAMILY } from './data/family.ts'
import type { FamilyPlan, Screen } from './domain/types.ts'
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
      <AppChrome onStop={() => setStopped(true)} />
      <main>
        {stopped ? (
          <StopPanel
            onReturnHome={goHome}
            onContinue={() => setStopped(false)}
          />
        ) : null}
        {!stopped && screen === 'welcome' ? (
          <Home family={family} onSetup={() => setScreen('setup')} />
        ) : null}
        {!stopped && screen === 'setup' ? (
          <FamilySetup
            family={family}
            onBack={() => setScreen('welcome')}
            onSave={(plan) => {
              setFamily(plan)
              setScreen('ready')
            }}
          />
        ) : null}
        {!stopped && screen === 'ready' ? (
          <Ready
            family={family}
            onEdit={() => setScreen('setup')}
            onHome={goHome}
          />
        ) : null}
      </main>
    </div>
  )
}
