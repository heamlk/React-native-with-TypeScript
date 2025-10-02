import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import themeVars from './styles/theme/themeVars'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  const styles = StyleSheet.create({
    root: {
      height: 100,
      flex: 1,
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={styles.root}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  )
}
