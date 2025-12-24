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
import UserProvider from './_context/user'
import PaymentsProvider from './_context/payments'

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ApiProvider>
            <UserProvider>
              <AuthProvider>
                <ProtectedRoutesProvider>
                  <DeeplinkProvider>
                    <PaymentsProvider>
                      <PopupProvider>
                        <Layout>
                          <Slot />
                        </Layout>
                      </PopupProvider>
                    </PaymentsProvider>
                  </DeeplinkProvider>
                </ProtectedRoutesProvider>
              </AuthProvider>
            </UserProvider>
          </ApiProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  )
}
