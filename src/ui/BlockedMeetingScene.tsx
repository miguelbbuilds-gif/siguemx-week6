type BlockedMeetingSceneProps = {
  meetingPoint: string
}

export function BlockedMeetingScene({ meetingPoint }: BlockedMeetingSceneProps) {
  return (
    <div className="adapt-scene" aria-hidden="true">
      <div className="adapt-street" />
      <div className="adapt-plaza is-blocked">
        <span className="adapt-x">×</span>
        <p>{meetingPoint}</p>
        <p className="adapt-tag">Unavailable</p>
      </div>
      <div className="adapt-alt">
        <p>Open side street</p>
      </div>
    </div>
  )
}
