import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import themeVars from './styles/theme/themeVars'
import useDimensions from './hooks/dimensions'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()

  const styles = StyleSheet.create({
    scroll: {},
    root: {
      fontFamily: themeVars.fonts.dosis,
      fontSize: 16,

      ...(theme === 'dark'
        ? {
            color: themeVars.colors.light1,
            backgroundColor: breakpoints === 'phone' ? themeVars.colors.dark1 : themeVars.colors.dark2,
          }
        : theme === 'light' && {
            color: themeVars.colors.grey1,
            backgroundColor: themeVars.colors.white,
          }),
    },
  })

  return (
    <div className='overflow-y-auto scrollbar-hide' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      <div className='w-[100%] h-[fit-content] min-h-[100%] flex' style={styles.root}>
        {children}
      </div>
    </div>
  )
}
