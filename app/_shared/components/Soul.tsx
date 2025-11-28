import { useEffect, useRef } from 'react'
import SoulAnimation from '@/app/_shared/animations/soul/soulAnimation'
import { Platform, View } from 'react-native'
import { GLView } from 'expo-gl'
import NativeSoulAnimation from '@/app/_shared/animations/soul/nativeSoulAnimation' // New file, see below
import { fragment as fragmentShader, vertex as vertexShader } from '@/app/_shared/animations/soul/glsl' // Adjust path if needed
export interface SoulProps {
  contextClass?: string
  isPositionAbsolute?: boolean
  centered?: boolean
  width: number
  height: number
  soulSize: number
}
export default function Soul({ contextClass, isPositionAbsolute, centered, width, height, soulSize }: SoulProps) { const canvas = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<NativeSoulAnimation | null>(null)
  if (Platform.OS === 'web') {
    useEffect(() => {
      if (canvas.current != null) {
        const animation = new SoulAnimation(canvas.current, width, height, soulSize)
        return () => {
          animation.destroy()
        }
      }
    }, [width, height, soulSize])
    return (
      <div className='relative' style={isPositionAbsolute ? { position: 'absolute' } : {}}>
        <canvas ref={canvas} className='Soul-canvas' style={centered ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}} />
      </div>
    )
  }
  // Native (Android/iOS)
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
      }
    }
  }, [])
  const onContextCreate = (gl: any) => {
    animationRef.current = new NativeSoulAnimation(gl, width, height, soulSize, fragmentShader, vertexShader)
    animationRef.current.start()
  }
  return (
    <View
      className='Soul-canvas'
      style={{
        width: soulSize,
        height: soulSize,
        borderRadius: soulSize / 2,
        overflow: 'hidden', // Ensures rounded corners clip the GLView
      }}
    >
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        {...(contextClass && { className: contextClass })}
      />
    </View>
  )
}