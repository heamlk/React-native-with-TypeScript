import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import themeVars from '@/app/_styles/theme/themeVars'
import useDimensions from '@/app/_hooks/dimensions'
import { getThemeBackground, Text, View } from '@/app/_shared/components/reusable'
import { useFonts } from 'expo-font'
import FontDosisVariable from '@/app/_assets/fonts/Dosis-VariableFont_wght.ttf'
import ProtectedScreen from '@/app/_shared/layout/protectedScreen'

export type LayoutContextType = {
  scrollY: number
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()

  const [fontsLoaded] = useFonts({
    'Dosis Variable': FontDosisVariable,
  })

  const [scrollY, setScrollY] = useState(0)

  const onScroll = useCallback((event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y)
  }, [])

  const value = { scrollY }

  if (!fontsLoaded) {
    return (
      <LayoutContext.Provider value={value}>
        <ProtectedScreen>
          <Text></Text>
        </ProtectedScreen>
      </LayoutContext.Provider>
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
    <LayoutContext.Provider value={value}>
      <ScrollView className='overflow-y-auto scrollbar-hide flex' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }} onScroll={onScroll} scrollEventThrottle={16}>
        <View className='flex' style={{ ...styles.root, width: dimentions.deviceWidth, minHeight: dimentions.deviceHeight, backgroundColor: backgroud }}>
          {children}
        </View>
      </ScrollView>
    </LayoutContext.Provider>
  )
}

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) throw new Error("useLayout can't be null")
  return context
}
