import { useEffect, useRef, useState } from 'react'
import type { ActChoice } from '../domain/types.ts'
import { createSpeechRecognizer, matchActSpeech, speechSupported } from '../voice/speech.ts'

type VoiceActInputProps = {
  disabled: boolean
  onConfirm: (choice: ActChoice) => void
}

export function VoiceActInput({ disabled, onConfirm }: VoiceActInputProps) {
  const [supported] = useState(() => speechSupported())
  const [status, setStatus] = useState('Tap a choice, or speak one if your browser allows.')
  const [heard, setHeard] = useState('')
  const [match, setMatch] = useState<ActChoice | null>(null)
  const [listening, setListening] = useState(false)
  const recRef = useRef<ReturnType<typeof createSpeechRecognizer>>(null)

  useEffect(() => {
    return () => {
      recRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (disabled) {
      recRef.current?.abort()
      setListening(false)
    }
  }, [disabled])

  function listen() {
    if (disabled) return
    const recognition = createSpeechRecognizer()
    if (!recognition) {
      setStatus('Voice is not available in this browser. Tap a choice instead.')
      return
    }
    recRef.current = recognition
    setListening(true)
    setHeard('')
    setMatch(null)
    setStatus('Listening… say Elena, wait for Mariana, or move yourself.')
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      setHeard(transcript)
      setMatch(matchActSpeech(transcript))
      setStatus(
        matchActSpeech(transcript)
          ? 'Confirm the matched decision, or tap a different one.'
          : 'We could not match that. Tap a choice or try speaking again.',
      )
    }
    recognition.onerror = (event) => {
      setListening(false)
      if (event.error === 'not-allowed') {
        setStatus('Microphone permission was denied. Tap a choice instead.')
        return
      }
      setStatus('Voice did not work this time. Tap a choice or try again.')
    }
    recognition.onend = () => {
      setListening(false)
    }
    try {
      recognition.start()
    } catch {
      setListening(false)
      setStatus('Voice did not start. Tap a choice instead.')
    }
  }

  if (!supported) {
    return (
      <p className="fine-print" data-testid="voice-fallback">
        Voice is not available here. Tap one of the three choices. Voice is never required.
      </p>
    )
  }

  return (
    <div className="voice-panel">
      <button
        type="button"
        className="secondary"
        data-testid="voice-listen"
        disabled={disabled || listening}
        onClick={listen}
      >
        {listening ? 'Listening…' : 'Speak your decision'}
      </button>
      <p className="fine-print">{status}</p>
      {heard ? <p className="fine-print">Heard: “{heard}”</p> : null}
      {match ? (
        <div className="voice-confirm">
          <p>
            Matched: <strong>{match.label}</strong>
          </p>
          <button
            type="button"
            className="primary"
            data-testid="voice-confirm"
            disabled={disabled}
            onClick={() => onConfirm(match)}
          >
            Confirm this decision
          </button>
        </div>
      ) : null}
    </div>
  )
}
