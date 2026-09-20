type StopPanelProps = {
  onReturnHome: () => void
  onContinue: () => void
}

export function StopPanel({ onReturnHome, onContinue }: StopPanelProps) {
  return (
    <section className="card stop-panel" aria-labelledby="stop-title">
      <h2 id="stop-title">You stopped</h2>
      <p>
        This rehearsal is practice. Stopping is always allowed. Nothing here measures
        fear or predicts survival.
      </p>
      <div className="actions">
        <button type="button" className="primary" onClick={onReturnHome}>
          Return to welcome
        </button>
        <button type="button" className="secondary" onClick={onContinue}>
          Continue setup
        </button>
      </div>
    </section>
  )
}
