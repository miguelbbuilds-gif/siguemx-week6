import type { ActChoice } from '../domain/types.ts'
import { ACT_CHOICES } from '../data/actScenario.ts'

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike
  webkitSpeechRecognition?: new () => SpeechRecognitionLike
}

export function speechSupported(): boolean {
  if (typeof window === 'undefined') return false
  const view = window as SpeechWindow
  return Boolean(view.SpeechRecognition || view.webkitSpeechRecognition)
}

export function createSpeechRecognizer(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null
  const view = window as SpeechWindow
  const Ctor = view.SpeechRecognition || view.webkitSpeechRecognition
  if (!Ctor) return null
  const recognition = new Ctor()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false
  return recognition
}

export function matchActSpeech(transcript: string, choices: ActChoice[] = ACT_CHOICES): ActChoice | null {
  const text = transcript.toLowerCase()
  const byId = (id: ActChoice['id']) => choices.find((choice) => choice.id === id) ?? null

  const mentionsElena = /\belena\b|grandmother|help her|go to her|with her/.test(text)
  const mentionsWait = /\bwait\b|\bmariana\b|coordinator/.test(text)
  const mentionsSelf = /\bmyself\b|safer place|move now|go now|leave first/.test(text)

  if (mentionsElena && !mentionsWait) return byId('help-elena')
  if (mentionsWait && !mentionsElena) return byId('wait-mariana')
  if (mentionsElena) return byId('help-elena')
  if (mentionsWait) return byId('wait-mariana')
  if (mentionsSelf) return byId('move-self')
  return null
}
