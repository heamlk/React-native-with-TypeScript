import { Renderer, Camera, Transform, Plane, Program, Mesh, Vec2, Vec3, type OGLRenderingContext, type Geometry } from 'ogl'

import { fragment as fragmentShader, vertex as vertexShader } from './glsl'

interface SoulAnimationUniforms {
  uTime: { value: number }
  uPosition: { value: Vec3 }
  uPlaneResolution: { value: Vec2 }
  uScale: { value: number }
  uMouse: { value: Vec2 }
}

class SoulAnimation {
  canvas: HTMLCanvasElement
  canvasWidth: number
  canvasHeight: number
  soulSize: number

  isPlaying: boolean
  mousemoveListener: (ev: MouseEvent) => void = () => {}
  mouseX: number
  mouseY: number

  scene: Transform
  gl: OGLRenderingContext
  plane: Mesh<Geometry, Program> | null = null
  camera: Camera
  renderer: Renderer
  uniforms: SoulAnimationUniforms
  cameraDistance: number

  maxFPS: number

  constructor(canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number, soulSize: number) {
    this.canvas = canvas
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.soulSize = soulSize

    this.isPlaying = true
    this.maxFPS = 66
    this.cameraDistance = 600

    this.mouseX = 0
    this.mouseY = 0

    // OGL setup
    this.renderer = new Renderer({ canvas: this.canvas, alpha: true })
    this.gl = this.renderer.gl

    this.scene = new Transform()

    this.camera = new Camera(this.gl, {
      fov: this.getCameraFovMappedToPixels(),
      far: 10000,
    })
    this.camera.position.set(0, 0, this.cameraDistance)

    this.uniforms = {
      uTime: { value: 0.0 },
      uPlaneResolution: { value: new Vec2(this.soulSize, this.soulSize) },
      uPosition: { value: new Vec3(0.0, 0.0, 0.0) },
      uScale: { value: 1.0 },
      uMouse: { value: new Vec2(0.0, 0.0) },
    }

    this.initSceneObjects()
    this.updateSceneParams()
    this.initListeners()
    this.render()
  }

  initListeners() {
    this.mousemoveListener = (ev) => {
      this.mouseX = ev.clientX / window.innerWidth
      this.mouseY = ev.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', this.mousemoveListener)
  }

  updateSceneParams() {
    this.renderer.dpr = this.getDevicePixelRatio()
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    this.camera.perspective({
      aspect: this.getCameraAspectRatio(),
    })
  }

  getCameraFovMappedToPixels() {
    return 2 * Math.atan(Math.max(this.canvasWidth, this.canvasHeight) / 2 / this.cameraDistance) * (180 / Math.PI)
  }

  getDevicePixelRatio() {
    if (this.detectIsSlowDevice()) {
      return 1
    }
    return Math.min(2, window.devicePixelRatio)
  }

  detectIsSlowDevice() {
    if (typeof navigator === 'undefined') {
      return true
    }
    // @ts-expect-error navigator.deviceMemory is available only in some supporting browsers
    return navigator.deviceMemory <= 2 || navigator.hardwareConcurrency <= 2
  }

  getCameraAspectRatio() {
    return this.canvasWidth / this.canvasHeight
  }

  initSceneObjects() {
    this.plane = this.createPlane()
    this.plane.setParent(this.scene)
  }

  createPlane() {
    const geometry = new Plane(this.gl, {
      width: this.soulSize,
      height: this.soulSize,
      attributes: {
        position: {
          size: 3,
          data: new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
        },
        uv: {
          size: 2,
          data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
        },
      },
    })

    const program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    })

    const plane = new Mesh(this.gl, { geometry, program })
    plane.position.set(0, 0, 0)

    return plane
  }

  render() {
    let lastFrameTime: number = 0
    const minFrameTime = 1000 / this.maxFPS

    const newFrame: FrameRequestCallback = (frameTime) => {
      if (!this.isPlaying) return
      requestAnimationFrame(newFrame)

      if (frameTime - lastFrameTime < minFrameTime) {
        return
      }
      lastFrameTime = frameTime

      this.uniforms.uMouse.value.x = this.mouseX
      this.uniforms.uMouse.value.y = this.mouseY
      this.uniforms.uTime.value = frameTime / 1000

      this.renderer.render({ scene: this.scene, camera: this.camera })
    }
    requestAnimationFrame(newFrame)
  }

  destroy() {
    this.isPlaying = false
    window.removeEventListener('mousemove', this.mousemoveListener)
  }
}

export default SoulAnimation
