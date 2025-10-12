import { View, Text } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import Subscription from '../_shared/components/subscription'

export default function SubscriptionPage() {
  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] max-w-[500px] mx-auto gap-[32px]'>
        <Text className='font-[600] text-center' size='xl' color='grey1_light1'>
          Subscription
        </Text>
        <Subscription />
      </View>
    </AuthenticatedLayout>
  )
}
