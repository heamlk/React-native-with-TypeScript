import { Slot } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DeeplinkProvider from './context/deeplink'
import DescopeProvider from './context/auth'
import ThemeProvider from './context/theme'
import Layout from './shared/layout/layout'
import './styles/global.css'
import PopupProvider from './context/popup'
import ProtectedRoutesProvider from './context/protectedRoutes'

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <DescopeProvider>
            <DeeplinkProvider>
              <PopupProvider>
                <ProtectedRoutesProvider>
                  <Layout>
                    <Slot />
                  </Layout>
                </ProtectedRoutesProvider>
              </PopupProvider>
            </DeeplinkProvider>
          </DescopeProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  )
}
