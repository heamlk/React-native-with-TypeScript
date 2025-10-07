import type { ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/app/context/theme'
import useBreakpoints from '@/app/hooks/breakpoints'
import themeVars from '@/app/styles/theme/themeVars'
import useDimensions from '@/app/hooks/dimensions'
import { getThemeBackground } from '@/app/shared/components/reusable'
import { useFonts } from 'expo-font'
import FontDosisVariable from '@/app/assets/fonts/Dosis-VariableFont_wght.ttf'
import ProtectedScreen from '@/app/shared/layout/protectedScreen'
import { useAuth } from '@/app/context/auth'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()

  const [fontsLoaded] = useFonts({
    'Dosis Variable': FontDosisVariable,
  })

  if (!fontsLoaded) {
    return <ProtectedScreen> </ProtectedScreen>
  }

  const styles = StyleSheet.create({
    scroll: {},
    root: {
      fontFamily: themeVars.fonts.dosis,
      fontSize: 16,
    },
  })

  return (
    <div className='overflow-y-auto scrollbar-hide' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      <div className='w-[100%] h-[fit-content] min-h-[100%] flex' style={{ ...styles.root, backgroundColor: user?.customerId ? getThemeBackground({ theme, breakpoints, background: 'primaryAuthenticated' }) : getThemeBackground({ theme, breakpoints, background: 'primary' }) }}>
        {children}
      </div>
    </div>
  )
}
