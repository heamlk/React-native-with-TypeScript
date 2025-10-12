import { Slot } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DeeplinkProvider from './_context/deeplink'
import AuthProvider from './_context/auth'
import ThemeProvider from './_context/theme'
import Layout from './_shared/layout/layout'
import './_styles/global.css'
import PopupProvider from './_context/popup'
import ProtectedRoutesProvider from './_context/protectedRoutes'
import ApiProvider from './_context/api'

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ApiProvider>
            <AuthProvider>
              <ProtectedRoutesProvider>
                <DeeplinkProvider>
                  <PopupProvider>
                    <Layout>
                      <Slot />
                    </Layout>
                  </PopupProvider>
                </DeeplinkProvider>
              </ProtectedRoutesProvider>
            </AuthProvider>
          </ApiProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  )
}
