import { useEffect, useRef, useState } from 'react'
import { FamilyRehearsalScene, type SceneMode } from '../scene/RehearsalScene.ts'
import { NightHomeScene } from './NightHomeScene.tsx'

type FamilyScene3DProps = {
  mode: SceneMode
  decisionId: string | null
  caption: string
  paused?: boolean
}

export function FamilyScene3D({ mode, decisionId, caption, paused = false }: FamilyScene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<FamilyRehearsalScene | null>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const scene = new FamilyRehearsalScene(canvas)
      scene.setMode(mode)
      scene.setDecision(decisionId)
      scene.start()
      sceneRef.current = scene
      return () => {
        scene.stop()
        sceneRef.current = null
      }
    } catch {
      setFallback(true)
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setMode(mode)
  }, [mode])

  useEffect(() => {
    sceneRef.current?.setDecision(decisionId)
  }, [decisionId])

  useEffect(() => {
    sceneRef.current?.setPaused(paused)
  }, [paused])

  if (fallback) {
    return <NightHomeScene />
  }

  return (
    <div className="scene-3d" data-testid="scene-3d">
      <canvas ref={canvasRef} className="scene-3d-canvas" aria-hidden="true" />
      <p className="night-caption">{caption}</p>
    </div>
  )
}
