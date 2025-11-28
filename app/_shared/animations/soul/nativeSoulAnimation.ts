import { vertex as vertexShader, fragment as fragmentShader } from './glsl'
interface UniformLocations {
  uTime?: WebGLUniformLocation
  uPosition?: WebGLUniformLocation
  uPlaneResolution?: WebGLUniformLocation
  uScale?: WebGLUniformLocation
  uMouse?: WebGLUniformLocation
  projectionMatrix?: WebGLUniformLocation
  modelViewMatrix?: WebGLUniformLocation
}
export default class NativeSoulAnimation {
  gl: any
  canvasWidth: number
  canvasHeight: number
  soulSize: number
  cameraDistance: number = 600
  isPlaying: boolean = true
  maxFPS: number = 66
  minFrameTime: number = 1000 / this.maxFPS
  mouseX: number = 0.5
  mouseY: number = 0.5
  program: WebGLProgram | null = null
  positionBuffer: WebGLBuffer | null = null
  uvBuffer: WebGLBuffer | null = null
  uniformLocations: UniformLocations = {}
  renderId: number | null = null
  // Matrices
  projMatrix: Float32Array
  viewMatrix: Float32Array
  modelMatrix: Float32Array
  modelViewMatrix: Float32Array
  constructor(gl: any, canvasWidth: number, canvasHeight: number, soulSize: number, fragmentSource: string, vertexSource: string) {
    this.gl = gl
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.soulSize = soulSize
    this.cameraDistance = this.soulSize // Updated: Set to soulSize to match the shader's assumed FOV (~53°)
    this.projMatrix = new Float32Array(16)
    this.viewMatrix = new Float32Array(16)
    this.modelMatrix = new Float32Array(16)
    this.modelViewMatrix = new Float32Array(16)
    this.setupGL()
    this.createBuffers()
    this.createProgram(fragmentSource, vertexSource)
    if (this.program) {
      this.getUniformLocations()
      this.setupMatrices()
      this.setStaticUniforms()
    }
    this.gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }
  setupGL() {
    const { gl } = this
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
  }
  createBuffers() {
    const gl = this.gl
    // Key Fix: Scale positions to world units [-soulSize/2, soulSize/2] to fill frustum like OGL Plane
    const halfSize = this.soulSize / 2
    const positions = new Float32Array([-halfSize, -halfSize, 0, halfSize, -halfSize, 0, -halfSize, halfSize, 0, halfSize, halfSize, 0])
    this.positionBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
    this.uvBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  }
  createProgram(fragmentSource: string, vertexSource: string) {
    const gl = this.gl
    const vs = this.createShader(gl.VERTEX_SHADER, vertexSource)
    const fs = this.createShader(gl.FRAGMENT_SHADER, fragmentSource)
    this.program = gl.createProgram()!
    gl.attachShader(this.program, vs)
    gl.attachShader(this.program, fs)
    gl.linkProgram(this.program)
    gl.useProgram(this.program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  }
  createShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
  }
  getUniformLocations() {
    const gl = this.gl
    if (!this.program) return
    gl.useProgram(this.program)
    this.uniformLocations.uTime = gl.getUniformLocation(this.program, 'uTime')
    this.uniformLocations.uPosition = gl.getUniformLocation(this.program, 'uPosition')
    this.uniformLocations.uPlaneResolution = gl.getUniformLocation(this.program, 'uPlaneResolution')
    this.uniformLocations.uScale = gl.getUniformLocation(this.program, 'uScale')
    this.uniformLocations.uMouse = gl.getUniformLocation(this.program, 'uMouse')
    this.uniformLocations.projectionMatrix = gl.getUniformLocation(this.program, 'projectionMatrix')
    this.uniformLocations.modelViewMatrix = gl.getUniformLocation(this.program, 'modelViewMatrix')
  }
  setupMatrices() {
    // Model: Identity (plane at origin)
    this.mat4.identity(this.modelMatrix)
    // View: Camera at (0,0,distance), translate Z by -distance
    this.mat4.identity(this.viewMatrix)
    this.viewMatrix[14] = -this.cameraDistance
    // ModelView: view * model
    this.mat4.multiply(this.modelViewMatrix, this.viewMatrix, this.modelMatrix)
    // Projection: Perspective
    const fovRad = (this.getCameraFovMappedToPixels() * Math.PI) / 180
    const aspect = this.getCameraAspectRatio()
    this.mat4.perspective(this.projMatrix, fovRad, aspect, 0.1, 10000)
  }
  setStaticUniforms() {
    const gl = this.gl
    if (!this.program) return
    gl.useProgram(this.program)
    if (this.uniformLocations.projectionMatrix) {
      gl.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, this.projMatrix)
    }
    if (this.uniformLocations.modelViewMatrix) {
      gl.uniformMatrix4fv(this.uniformLocations.modelViewMatrix, false, this.modelViewMatrix)
    }
    if (this.uniformLocations.uPosition) gl.uniform3f(this.uniformLocations.uPosition, 0, 0, 0)
    if (this.uniformLocations.uPlaneResolution) gl.uniform2f(this.uniformLocations.uPlaneResolution, this.soulSize, this.soulSize)
    if (this.uniformLocations.uScale) gl.uniform1f(this.uniformLocations.uScale, 1.0)
  }
  getCameraFovMappedToPixels() {
    return 2 * Math.atan(Math.max(this.canvasWidth, this.canvasHeight) / 2 / this.cameraDistance) * (180 / Math.PI)
  }
  getCameraAspectRatio() {
    return this.canvasWidth / this.canvasHeight
  }
  // mat4 helpers
  private mat4 = {
    identity(out: Float32Array) {
      out[0] = 1
      out[1] = 0
      out[2] = 0
      out[3] = 0
      out[4] = 0
      out[5] = 1
      out[6] = 0
      out[7] = 0
      out[8] = 0
      out[9] = 0
      out[10] = 1
      out[11] = 0
      out[12] = 0
      out[13] = 0
      out[14] = 0
      out[15] = 1
      return out
    },
    perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
      const f = 1.0 / Math.tan(fovy / 2)
      const nf = 1 / (near - far)
      out[0] = f / aspect
      out[1] = 0
      out[2] = 0
      out[3] = 0
      out[4] = 0
      out[5] = f
      out[6] = 0
      out[7] = 0
      out[8] = 0
      out[9] = 0
      out[10] = (far + near) * nf
      out[11] = -1
      out[12] = 0
      out[13] = 0
      out[14] = 2 * far * near * nf
      out[15] = 0
      return out
    },
    multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
      const a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3]
      const a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7]
      const a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11]
      const a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]
      let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3]
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
      b0 = b[4]
      b1 = b[5]
      b2 = b[6]
      b3 = b[7]
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
      b0 = b[8]
      b1 = b[9]
      b2 = b[10]
      b3 = b[11]
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
      b0 = b[12]
      b1 = b[13]
      b2 = b[14]
      b3 = b[15]
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
      return out
    },
  }
  start() {
    let lastFrameTime = 0
    const renderLoop = (frameTime: number) => {
      if (!this.isPlaying) return
      if (frameTime - lastFrameTime < this.minFrameTime) {
        this.renderId = requestAnimationFrame(renderLoop)
        return
      }
      lastFrameTime = frameTime
      this.render(frameTime)
      this.renderId = requestAnimationFrame(renderLoop)
    }
    this.renderId = requestAnimationFrame(renderLoop)
  }
  render(frameTime: number) {
    const gl = this.gl
    if (!this.program) return
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(this.program)
    if (this.uniformLocations.uTime) gl.uniform1f(this.uniformLocations.uTime, frameTime / 1000)
    if (this.uniformLocations.uMouse) gl.uniform2f(this.uniformLocations.uMouse, this.mouseX, this.mouseY)
    const posLoc = gl.getAttribLocation(this.program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    const uvLoc = gl.getAttribLocation(this.program, 'uv')
    gl.enableVertexAttribArray(uvLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.endFrameEXP()
  }
  destroy() {
    this.isPlaying = false
    if (this.renderId) {
      cancelAnimationFrame(this.renderId)
    }
    const gl = this.gl
    if (this.program) gl.deleteProgram(this.program)
    if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer)
    if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer)
  }
}
