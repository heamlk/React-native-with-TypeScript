import { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import IconRegenAnimation from '@/app/_assets/icons/regenAnimation'
import { useTheme } from '@/app/_context/theme'

interface AnimatedRegenIconProps {
  width?: number
  height?: number
  isAnimating?: boolean
}

export default function AnimatedRegenIcon({ width = 18, height = 18, isAnimating = true }: AnimatedRegenIconProps) {
  const { theme } = useTheme()
  const rotateAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isAnimating) {
      // Continuous rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )

      // Pulse animation (scale up and down)
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )

      rotateAnimation.start()
      pulseAnimation.start()

      return () => {
        rotateAnimation.stop()
        pulseAnimation.stop()
      }
    } else {
      rotateAnim.setValue(0)
      pulseAnim.setValue(1)
    }
  }, [isAnimating, rotateAnim, pulseAnim])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View
      style={{
        transform: [
          { rotate },
          { scale: pulseAnim },
        ],
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconRegenAnimation width={width} height={height} theme={theme} />
    </Animated.View>
  )
}
