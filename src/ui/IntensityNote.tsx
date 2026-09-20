type IntensityNoteProps = {
  compact?: boolean
}

export function IntensityNote({ compact = false }: IntensityNoteProps) {
  return (
    <aside className={compact ? 'disclosure compact' : 'disclosure'} role="note">
      <p>
        Esto es una práctica. No garantiza que en un sismo de verdad vayan a estar
        a salvo. Puedes detener en cualquier momento.
      </p>
      {compact ? null : (
        <p className="disclosure-extra">
          Qué esperar de esta práctica: no hay heridas gráficas, no hay familiares
          muertos y no se mide el miedo. Se mantiene suave a propósito.
        </p>
      )}
    </aside>
  )
}
