import { useEffect, useRef, useState } from 'react'
import SoulAnimation from '@/app/_shared/animations/soul/soulAnimation'
import { Platform } from 'react-native'
import { Video } from 'expo-av'
import { useTheme } from '@/app/_context/theme'
import SoulAnimationWhite from '@/app/_shared/animations/soul/soul_animation_white.mp4'
import SoulAnimationBlack from '@/app/_shared/animations/soul/soul_animation_black.mp4'
import { GLView } from 'expo-gl'
import NativeSoulAnimation from '@/app/_shared/animations/soul/nativeSoulAnimation' // New file, see below
import { fragment as fragmentShader, vertex as vertexShader } from '@/app/_shared/animations/soul/glsl' // Adjust path if needed
import { View } from './reusable'

export interface SoulProps {
  contextClass?: string
  isPositionAbsolute?: boolean
  centered?: boolean
  width: number
  height: number
  soulSize: 200 | 80 | 44
}

export default function Soul({ contextClass, isPositionAbsolute, centered, width, height, soulSize }: SoulProps) {
  const { theme } = useTheme()
  const canvas = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<NativeSoulAnimation | null>(null)

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (canvas.current != null) {
        const animation = new SoulAnimation(canvas.current, width, height, soulSize)

        return () => {
          animation.destroy()
        }
      }
    }
  }, [canvas, width, height, soulSize])

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

  return Platform.OS === 'web' ? (
    <div className='relative' style={isPositionAbsolute ? { position: 'absolute' } : {}}>
      <canvas ref={canvas} className='Soul-canvas' style={centered ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}} />
    </div>
  ) : Platform.OS === 'android' ? (
    <View
      className='Soul-canvas'
      style={{
        width: soulSize,
        height: soulSize,
        borderRadius: soulSize / 2,
        overflow: 'hidden',
      }}
    >
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} {...(contextClass && { className: contextClass })} />
    </View>
  ) : (
    <Video source={theme === 'light' ? (SoulAnimationWhite as any) : SoulAnimationBlack} style={{ width: soulSize, height: soulSize }} videoStyle={{ width: soulSize, height: soulSize }} shouldPlay isLooping></Video>
  )
}
