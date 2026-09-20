import { useEffect, useRef, useState } from 'react'
import type { ActChoice } from '../domain/types.ts'
import { createSpeechRecognizer, matchActSpeech, speechSupported } from '../voice/speech.ts'

type VoiceActInputProps = {
  disabled: boolean
  onConfirm: (choice: ActChoice) => void
}

export function VoiceActInput({ disabled, onConfirm }: VoiceActInputProps) {
  const [supported] = useState(() => speechSupported())
  const [status, setStatus] = useState(
    'Toca una opción, o dilo en voz alta si tu celular lo permite.',
  )
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
      setStatus('La voz no está disponible aquí. Toca una opción.')
      return
    }
    recRef.current = recognition
    setListening(true)
    setHeard('')
    setMatch(null)
    setStatus('Escuchando… di Elena, espera a Mariana, o muévete tú.')
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      setHeard(transcript)
      setMatch(matchActSpeech(transcript))
      setStatus(
        matchActSpeech(transcript)
          ? 'Confirma la decisión, o toca otra.'
          : 'No entendimos eso. Toca una opción o vuelve a hablar.',
      )
    }
    recognition.onerror = (event) => {
      setListening(false)
      if (event.error === 'not-allowed') {
        setStatus('No se permitió el micrófono. Toca una opción.')
        return
      }
      setStatus('La voz no funcionó esta vez. Toca una opción o inténtalo de nuevo.')
    }
    recognition.onend = () => {
      setListening(false)
    }
    try {
      recognition.start()
    } catch {
      setListening(false)
      setStatus('La voz no arrancó. Toca una opción.')
    }
  }

  if (!supported) {
    return (
      <p className="fine-print" data-testid="voice-fallback">
        La voz no está disponible aquí. Toca una de las tres opciones. Hablar nunca es
        obligatorio.
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
        {listening ? 'Escuchando…' : 'Decirlo en voz alta'}
      </button>
      <p className="fine-print">{status}</p>
      {heard ? <p className="fine-print">Se escuchó: “{heard}”</p> : null}
      {match ? (
        <div className="voice-confirm">
          <p>
            Coincidió con: <strong>{match.label}</strong>
          </p>
          <button
            type="button"
            className="primary"
            data-testid="voice-confirm"
            disabled={disabled}
            onClick={() => onConfirm(match)}
          >
            Confirmar esta decisión
          </button>
        </div>
      ) : null}
    </div>
  )
}
