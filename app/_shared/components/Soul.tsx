import { useEffect, useRef } from 'react'
import SoulAnimation from '@/app/_shared/animations/soul/soulAnimation'

export interface SoulProps {
  contextClass?: string
  isPositionAbsolute?: boolean
  centered?: boolean
  width: number
  height: number
  soulSize: number
}

export default function Soul({ contextClass, isPositionAbsolute, centered, width, height, soulSize }: SoulProps) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvas.current != null) {
      const animation = new SoulAnimation(canvas.current, width, height, soulSize)

      return () => {
        animation.destroy()
      }
    }
  }, [canvas, width, height, soulSize])

  return (
    <div className='relative' style={isPositionAbsolute ? { position: 'absolute' } : {}}>
      <canvas ref={canvas} className='Soul-canvas' style={centered ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}} />
    </div>
  )
}
