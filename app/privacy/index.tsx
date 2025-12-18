import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientPressable, Text, View } from '../_shared/components/reusable'
import PrivacyPolicy from '../_shared/policy/privacyPolicy'
import { useRouter } from 'expo-router'
import { useAuth } from '../_context/auth'
import { useUser } from '../_context/user'

export default function PrivacyPolicyPage() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <View className='p-[25px] flex-1 mx-auto items-center'>
      <PrivacyPolicy />

      <GradientPressable
        type='dark'
        containerClassname='base:max-w-[310px] phone:max-w-[440px] min-w-[200px]'
        className='h-[48px] items-center justify-center rounded-[99999px]'
        onPress={() => {
          if (user) {
            if (user?.companions?.length > 0) {
              router.push(`/friend/${user?.companions?.[0]?.id}`)
            } else {
              router.push('/friend/')
            }
          } else {
            router.push('/')
          }
        }}
      >
        <Text className='font-[600]' size='md' color='white_light2'>
          Go Back
        </Text>
      </GradientPressable>
    </View>
  )
}
