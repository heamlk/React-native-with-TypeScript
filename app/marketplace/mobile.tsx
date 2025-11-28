import { useEffect } from 'react'
import { Text } from '../_shared/components/reusable'
import ProtectedScreen from '../_shared/layout/protectedScreen'
import { Linking, Platform } from 'react-native'

export default function MarketplaceMobile() {
  useEffect(() => {
    console.log(`${process.env.EXPO_PUBLIC_WEB_BASE_URL}/marketplace`)
    if (Platform.OS === 'web') {
      window.location.href = `${process.env.EXPO_PUBLIC_WEB_BASE_URL}/marketplace`
    } else {
      Linking.openURL(`${process.env.EXPO_PUBLIC_MOBILE_BASE_URL}marketplace`)
    }
  }, [])

  return (
    <ProtectedScreen>
      <Text></Text>
    </ProtectedScreen>
  )
}
