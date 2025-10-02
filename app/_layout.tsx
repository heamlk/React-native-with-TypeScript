import FontDosisVariable from '@/app/assets/fonts/Dosis-VariableFont_wght.ttf'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DeeplinkProvider from './context/deeplink'
import DescopeProvider from './context/descope'
import ThemeProvider from './context/theme'
import Layout from './layout'
import './styles/global.css'
import PopupProvider from './context/popup'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Dosis Variable': FontDosisVariable,
  })

  if (!fontsLoaded) {
    return
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <DescopeProvider>
            <DeeplinkProvider>
              <PopupProvider>
                <Layout>
                  <Slot />
                </Layout>
              </PopupProvider>
            </DeeplinkProvider>
          </DescopeProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  )
}
