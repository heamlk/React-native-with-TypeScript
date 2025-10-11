import { Slot } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DeeplinkProvider from './_context/deeplink'
import DescopeProvider from './_context/auth'
import ThemeProvider from './_context/theme'
import Layout from './_shared/layout/layout'
import './_styles/global.css'
import PopupProvider from './_context/popup'
import ProtectedRoutesProvider from './_context/protectedRoutes'
import ApiProvider from './_context/api'
import AuthProvider from './_context/auth'

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ApiProvider>
            <DescopeProvider>
              <DeeplinkProvider>
                <AuthProvider>
                  <PopupProvider>
                    <ProtectedRoutesProvider>
                      <Layout>
                        <Slot />
                      </Layout>
                    </ProtectedRoutesProvider>
                  </PopupProvider>
                </AuthProvider>
              </DeeplinkProvider>
            </DescopeProvider>
          </ApiProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  )
}
