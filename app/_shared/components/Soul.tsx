import { useEffect, useRef, useState } from 'react'
import SoulAnimation from '@/app/_shared/animations/soul/soulAnimation'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { Asset } from 'expo-asset'
import { Video } from 'expo-av'
import { useTheme } from '@/app/_context/theme'
import SoulAnimationWhite from '@/app/_shared/animations/soul/soul_animation_white.mp4'
import SoulAnimationBlack from '@/app/_shared/animations/soul/soul_animation_black.mp4'

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
  const [htmlText, setHtmlText] = useState('')

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (canvas.current != null) {
        const animation = new SoulAnimation(canvas.current, width, height, soulSize)

        return () => {
          animation.destroy()
        }
      }
    } else if (Platform.OS === 'android') {
      async function loadHtml() {
        const asset = Asset.fromModule(soulSize === 200 ? require('@/app/_shared/animations/soul/soulAnimation200.html') : soulSize === 80 ? require('@/app/_shared/animations/soul/soulAnimation80.html') : require('@/app/_shared/animations/soul/soulAnimation44.html'))
        await asset.downloadAsync()
        const response = await fetch(asset.uri)
        const text = await response.text()
        setHtmlText(text)
      }

      loadHtml()
    }
  }, [canvas, width, height, soulSize])

  return Platform.OS === 'web' ? (
    <div className='relative' style={isPositionAbsolute ? { position: 'absolute' } : {}}>
      <canvas ref={canvas} className='Soul-canvas' style={centered ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}} />
    </div>
  ) : Platform.OS === 'android' ? (
    <WebView originWhitelist={['*']} source={{ html: htmlText }} style={{ backgroundColor: 'transparent' }} />
  ) : (
    <Video source={theme === 'light' ? (SoulAnimationWhite as any) : SoulAnimationBlack} style={{ width: soulSize, height: soulSize }} videoStyle={{ width: soulSize, height: soulSize }} shouldPlay isLooping></Video>
  )
}
