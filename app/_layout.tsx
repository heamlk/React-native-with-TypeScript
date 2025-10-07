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
import ApiProvider from './context/api'
import AuthProvider from './context/auth'

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
