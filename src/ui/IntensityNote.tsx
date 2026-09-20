type IntensityNoteProps = {
  compact?: boolean
}

export function IntensityNote({ compact = false }: IntensityNoteProps) {
  return (
    <aside className={compact ? 'disclosure compact' : 'disclosure'} role="note">
      <p>
        This is a practice experience. It does not predict real-world survival. You can
        stop at any time.
      </p>
      {compact ? null : (
        <p className="disclosure-extra">
          No photorealistic injuries, dead relatives, or fear scores. Intensity stays
          low on purpose.
        </p>
      )}
    </aside>
  )
}
