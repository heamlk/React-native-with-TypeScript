import type { ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import themeVars from '@/app/_styles/theme/themeVars'
import useDimensions from '@/app/_hooks/dimensions'
import { getThemeBackground, Text } from '@/app/_shared/components/reusable'
import { useFonts } from 'expo-font'
import FontDosisVariable from '@/app/_assets/fonts/Dosis-VariableFont_wght.ttf'
import ProtectedScreen from '@/app/_shared/layout/protectedScreen'
import { useAuth } from '@/app/_context/auth'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()

  const [fontsLoaded] = useFonts({
    'Dosis Variable': FontDosisVariable,
  })

  if (!fontsLoaded) {
    return (
      <ProtectedScreen>
        <Text></Text>
      </ProtectedScreen>
    )
  }

  const styles = StyleSheet.create({
    scroll: {},
    root: {
      fontFamily: themeVars.fonts.dosis,
      fontSize: 16,
    },
  })

  const backgroud = breakpoints === 'phone' ? getThemeBackground({ theme, breakpoints, background: 'light1_dark1' }) : getThemeBackground({ theme, breakpoints, background: 'light1_dark2' })

  return (
    <div className='overflow-y-auto scrollbar-hide' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      <div className='w-[100%] h-[fit-content] min-h-[100%] flex' style={{ ...styles.root, backgroundColor: backgroud }}>
        {children}
      </div>
    </div>
  )
}
