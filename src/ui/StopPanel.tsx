type StopPanelProps = {
  onReturnHome: () => void
  onContinue: () => void
}

export function StopPanel({ onReturnHome, onContinue }: StopPanelProps) {
  return (
    <section className="card stop-panel" aria-labelledby="stop-title">
      <h2 id="stop-title">Detuviste la práctica</h2>
      <p>
        Esto es solo práctica. Siempre puedes detener. Aquí no se mide el miedo ni se
        predice si van a estar a salvo en un sismo de verdad.
      </p>
      <div className="actions">
        <button type="button" className="primary" onClick={onReturnHome}>
          Volver al inicio
        </button>
        <button type="button" className="secondary" onClick={onContinue}>
          Seguir
        </button>
      </div>
    </section>
  )
}
