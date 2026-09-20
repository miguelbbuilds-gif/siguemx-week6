import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'
import type { VariationId } from '../domain/types.ts'

export type SceneMode = VariationId | 'act-night'

type Figure = Mesh<CylinderGeometry, MeshStandardMaterial>

export class FamilyRehearsalScene {
  private renderer: WebGLRenderer
  private scene: Scene
  private camera: PerspectiveCamera
  private clock = 0
  private raf = 0
  private running = false
  private paused = false
  private mariana: Figure
  private elena: Figure
  private diego: Figure
  private blocker: Mesh
  private backup: Mesh
  private lamp: MeshStandardMaterial
  private decision: string | null = null
  private resize: () => void

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.scene = new Scene()
    this.scene.background = new Color('#1b2433')
    this.camera = new PerspectiveCamera(45, 1, 0.1, 40)
    this.camera.position.set(0, 3.4, 7.2)
    this.camera.lookAt(0, 0.8, 0)

    this.scene.add(new AmbientLight('#8ea0b8', 0.7))
    const sun = new DirectionalLight('#ffe9b8', 0.8)
    sun.position.set(-2, 6, 4)
    this.scene.add(sun)

    const floor = new Mesh(
      new PlaneGeometry(8, 8),
      new MeshStandardMaterial({ color: '#2c241c' }),
    )
    floor.rotation.x = -Math.PI / 2
    this.scene.add(floor)

    const wall = new Mesh(
      new BoxGeometry(8, 3.2, 0.2),
      new MeshStandardMaterial({ color: '#3a4458' }),
    )
    wall.position.set(0, 1.6, -3.4)
    this.scene.add(wall)

    this.lamp = new MeshStandardMaterial({
      color: '#c9a227',
      emissive: '#c9a227',
      emissiveIntensity: 0.4,
    })
    const lampMesh = new Mesh(new SphereGeometry(0.18), this.lamp)
    lampMesh.position.set(2.2, 2.4, -1.4)
    this.scene.add(lampMesh)

    this.mariana = this.makeFigure('#0f6e68', -1.4)
    this.elena = this.makeFigure('#b8860b', 0.2)
    this.diego = this.makeFigure('#3d6ea8', 1.5)
    this.scene.add(this.mariana, this.elena, this.diego)

    this.blocker = new Mesh(
      new BoxGeometry(1.4, 1.6, 0.35),
      new MeshStandardMaterial({ color: '#8a3b3b' }),
    )
    this.blocker.position.set(-2.4, 0.8, 1.6)
    this.blocker.visible = false
    this.scene.add(this.blocker)

    this.backup = new Mesh(
      new CylinderGeometry(0.35, 0.35, 0.15, 12),
      new MeshStandardMaterial({ color: '#6fbf9a' }),
    )
    this.backup.position.set(2.4, 0.1, 1.8)
    this.backup.visible = false
    this.scene.add(this.backup)

    const door = new Mesh(
      new BoxGeometry(0.9, 1.8, 0.12),
      new MeshStandardMaterial({ color: '#3b3228' }),
    )
    door.position.set(2.6, 0.9, -2.8)
    this.scene.add(door)

    this.resize = () => {
      const width = canvas.clientWidth || 320
      const height = canvas.clientHeight || 160
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / Math.max(height, 1)
      this.camera.updateProjectionMatrix()
    }
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  private makeFigure(color: string, x: number): Figure {
    const mesh = new Mesh(
      new CylinderGeometry(0.22, 0.28, 1.1, 8),
      new MeshStandardMaterial({ color }),
    )
    mesh.position.set(x, 0.55, 0)
    const head = new Mesh(
      new SphereGeometry(0.18, 10, 10),
      new MeshStandardMaterial({ color }),
    )
    head.position.y = 0.72
    mesh.add(head)
    return mesh
  }

  setMode(mode: SceneMode) {
    const hideMariana = mode !== 'act-night'
    this.mariana.visible = !hideMariana
    this.blocker.visible = mode === 'unreachable-and-blocked' || mode === 'blocked-with-backup'
    this.backup.visible = mode === 'blocked-with-backup' || mode === 'unreachable-and-blocked'
    this.scene.background = new Color(mode === 'act-night' ? '#1b2433' : '#18202c')
  }

  setDecision(decision: string | null) {
    this.decision = decision
  }

  setPaused(paused: boolean) {
    this.paused = paused
  }

  start() {
    if (this.running) return
    this.running = true
    const tick = () => {
      if (!this.running) return
      if (!this.paused) {
        this.clock += 1
        this.lamp.emissiveIntensity = 0.25 + Math.abs(Math.sin(this.clock * 0.08)) * 0.45
        this.camera.position.x = Math.sin(this.clock * 0.02) * 0.08
        this.applyDecision()
      }
      this.renderer.render(this.scene, this.camera)
      this.raf = requestAnimationFrame(tick)
    }
    tick()
  }

  private applyDecision() {
    const diego = this.diego.position
    if (this.decision === 'help-elena') {
      diego.x += (this.elena.position.x - diego.x) * 0.04
      diego.z += (this.elena.position.z + 0.4 - diego.z) * 0.04
    } else if (this.decision === 'move-self' || this.decision === 'original-point') {
      diego.x += (2.4 - diego.x) * 0.04
      diego.z += (-2.2 - diego.z) * 0.04
    } else if (this.decision === 'follow-backup') {
      diego.x += (this.backup.position.x - diego.x) * 0.04
      diego.z += (this.backup.position.z - diego.z) * 0.04
    } else if (this.decision === 'wait-mariana' || this.decision === 'wait-instructions') {
      diego.x += (1.5 - diego.x) * 0.02
    }
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    this.renderer.dispose()
  }
}
