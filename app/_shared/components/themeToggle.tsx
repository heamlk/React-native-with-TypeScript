import { useTheme } from '@/app/_context/theme'
import { Pressable, Image, Animated, Easing } from 'react-native'
import { useEffect, useRef } from 'react'
import IconMoon from '@/app/_assets/icons/moon.png'
import IconSun from '@/app/_assets/icons/sun.png'
import themeVars from '@/app/_styles/theme/themeVars'
import { borderRadiusNative } from '@/app/_styles/theme/borderRadius'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const anim = useRef(new Animated.Value(theme === 'light' ? 0 : 1)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: theme === 'light' ? 0 : 1,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start()
  }, [theme])

  const handleToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [themeVars.colors.grey3, themeVars.colors.purple3],
  })

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  })

  return (
    <Pressable onPress={handleToggle} className='w-[55px] min-w-[55px] h-[30px] cursor-pointer'>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor,
          borderRadius: borderRadiusNative.md,
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
          }}
        >
          {theme === 'light' ? <Image source={IconSun} style={{ width: 33.5, height: 22, borderRadius: 0 }} /> : <Image source={IconMoon} style={{ width: 24, height: 24, borderRadius: 9999 }} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}
