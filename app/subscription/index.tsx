import { View, Text, GradientPressable } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import Subscription from '../_shared/components/subscription'
import { useUser } from '../_context/user'
import IconCheckGreen from '@/app/_assets/icons/check-green.svg'
import { useEffect, useState } from 'react'
import { useApi } from '../_context/api'
import { usePopup } from '../_context/popup'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Linking, Platform } from 'react-native'
import { SubscriptionOption } from '../_context/auth.types'

export function openMobileSubscriptions() {
  if (Platform.OS === 'ios') {
    Linking.openURL('https://apps.apple.com/account/subscriptions')
  } else if (Platform.OS === 'android') {
    Linking.openURL('https://play.google.com/store/account/subscriptions')
  }
}

export default function SubscriptionPage() {
  const insets = useSafeAreaInsets()
  const { user, updateUser } = useUser()
  const api = useApi()
  const { setPopup } = usePopup()

  const [updatingSubscriptionStatus, setUpdatingSubscriptionStatus] = useState<boolean | 'error'>(false)
  const [updatingSubscriptionOptionStatus, setUpdatingSubscriptionOptionStatus] = useState<string>('')
  const [fetchingSubscriptionBillingInfoUrl, setFetchingSubscriptionBillingInfoUrl] = useState<boolean | 'error'>(false)

  const openPlatformPopup = () => {
    setPopup({
      open: true,
      maxWidth: 600,
      content: (
        <View className='gap-[24px]'>
          <Text className='text-[24px] font-[600]' color='grey1_light1'>
            Manage subscription
          </Text>
          <Text className='' size='md' color='grey1_light1'>
            This subscription cannot be canceled or changed withing this app because it was purchased on another platform. To manage your subscription, please log in to your account where you made the purchase.
          </Text>
          <View className='flex-row gap-[16px]'>
            <GradientPressable
              className='w-[120px] h-[48px]'
              type='dark'
              onPress={() => {
                setPopup({ open: false })
              }}
            >
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  const subscriptionPlatformCheck = ({ platform }: { platform: SubscriptionOption['platform'] }) => {
    if (Platform.OS !== platform) {
      openPlatformPopup()
      return false
    }
  }

  const handleUpdateSubscriptionOptionStatus = async ({ active, product_id, platform }: { active: boolean; product_id: string; platform: SubscriptionOption['platform'] }) => {
    if (!subscriptionPlatformCheck({ platform })) return

    if (Platform.OS === 'web') {
      if (updatingSubscriptionOptionStatus) {
        return
      }
      setUpdatingSubscriptionOptionStatus(product_id)
      try {
        await api.postUpdateSubscriptionOptionStatus({ active, product_id })
        await updateUser()
        setUpdatingSubscriptionOptionStatus('')
      } catch (error) {
        console.warn(error)
        setUpdatingSubscriptionOptionStatus('')
      }
    } else {
      openMobileSubscriptions()
    }
  }

  const handleChangeBillingInfo = async ({ platform }: { platform: SubscriptionOption['platform'] }) => {
    if (!subscriptionPlatformCheck({ platform })) return

    if (Platform.OS === 'web') {
      if (fetchingSubscriptionBillingInfoUrl === true) {
        return
      }
      setFetchingSubscriptionBillingInfoUrl(true)
      try {
        const req = await api.postGetManageSubscriptionUrl()
        const data = req?.data
        const url = data?.url
        setFetchingSubscriptionBillingInfoUrl(false)
        if (url) {
          window.location.href = url
        }
      } catch (error) {
        console.warn(error)
        setFetchingSubscriptionBillingInfoUrl('error')
      }
    } else {
      openMobileSubscriptions()
    }
  }

  const handleCancelSubscription = async ({ platform }: { platform: SubscriptionOption['platform'] }) => {
    if (!subscriptionPlatformCheck({ platform })) return

    if (Platform.OS === 'web') {
      if (updatingSubscriptionStatus === true) {
        return
      }
      setUpdatingSubscriptionStatus(true)
      try {
        await api.postUpdateSubscriptionStatus({ active: false })
        await updateUser()
        setUpdatingSubscriptionStatus(false)
      } catch (error) {
        console.warn(error)
        setUpdatingSubscriptionStatus('error')
      }
    } else {
      openMobileSubscriptions()
    }
  }

  const handleCancelSubscriptionClick = ({ platform }: { platform: SubscriptionOption['platform'] }) => {
    if (!subscriptionPlatformCheck({ platform })) return

    setPopup({
      open: true,
      maxWidth: 600,
      content: (
        <View className='gap-[24px]'>
          <Text className='text-[24px] font-[600]' color='grey1_light1'>
            Cancel subscription
          </Text>
          <Text className='' size='md' color='grey1_light1'>
            Are you sure you want to cancel your subscription?
          </Text>
          <View className='flex-row gap-[16px]'>
            <GradientPressable
              combinedClassname='max-w-[150px] h-[48px] min-h-[48px]'
              type='dark'
              onPress={() => {
                setPopup({ open: false })
                handleCancelSubscription({ platform })
              }}
            >
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable combinedClassname='max-w-[150px] h-[48px] min-h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Cancel
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  useEffect(() => {
    updateUser()
  }, [])

  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] max-w-[500px] mx-auto gap-[32px]' style={{ paddingBottom: insets.bottom + 25 }}>
        <Text className='font-[600] text-center' size='xl' color='grey1_light1'>
          Subscription
        </Text>

        {user?.profile?.subscription?.status === 'active' ? (
          <View className='gap-[30px]'>
            <View className='gap-[24px]'>
              <Subscription />

              <View className='gap-[6px]'>
                <GradientPressable combinedClassname='h-[48px]' type='dark' onPress={() => handleChangeBillingInfo({ platform: user?.profile?.subscription?.options?.additional_ai?.platform || null })}>
                  <Text className='font-[600] text-center' size='md' color='grey1_light2'>
                    {fetchingSubscriptionBillingInfoUrl === true ? 'Loading...' : 'Change subscriptions billing information'}
                  </Text>
                </GradientPressable>
                {fetchingSubscriptionBillingInfoUrl === 'error' ? (
                  <Text size='md' color='red1'>
                    Error while getting subscription URL
                  </Text>
                ) : (
                  <></>
                )}
              </View>

              <View className='gap-[6px]'>
                <GradientPressable combinedClassname='h-[48px]' type='dark' onPress={() => handleCancelSubscriptionClick({ platform: user?.profile?.subscription?.options?.additional_ai?.platform || null })}>
                  <Text className='font-[600]' size='md' color='grey1_light2'>
                    {updatingSubscriptionStatus === true ? 'Canceling...' : 'Cancel subscription'}
                  </Text>
                </GradientPressable>
                {updatingSubscriptionStatus === 'error' ? (
                  <Text size='md' color='red1'>
                    Error while canceling subscription
                  </Text>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </View>
        ) : (
          <Subscription />
        )}

        <View className='gap-[32px]'>
          {Object.entries(user?.profile?.subscription?.options || {}).map(([key, value]) => {
            const product = user?.products?.find((product) => product.id === key)
            const active_until = value?.active_until
            const cancel_at_period_end = value?.cancel_at_period_end
            const platform = value?.platform

            const active = active_until >= Math.floor(Date.now() / 1000)

            return (
              <View key={key + 35754} className='gap-[20px]'>
                <Text className='font-[600] text-center' size='xl' color='grey1_light1'>
                  {product?.name}
                </Text>
                <View className='w-[100%] p-[24px] rounded-sm' background='grey6_dark7'>
                  <View className='gap-[10px]'>
                    <View className='w-[100%] flex-row items-center justify-between'>
                      <Text color='grey3_light3' size='md'>
                        Status
                      </Text>
                      <View className='flex-row gap-[4px] items-center'>
                        {active ? (
                          <>
                            <Text color='grey1_light1' size='md'>
                              Active
                            </Text>
                            <IconCheckGreen />
                          </>
                        ) : (
                          <Text color='grey1_light1' size='md'>
                            Inactive
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className='w-[100%] flex-row items-center justify-between'>
                      <Text color='grey3_light3' size='md'>
                        Price
                      </Text>
                      <View className='flex-row gap-[4px] items-center'>
                        <Text color='grey1_light1' size='md'>
                          ${product?.price} / month
                        </Text>
                      </View>
                    </View>
                    <View className='w-[100%] flex-row items-center justify-between'>
                      <Text color='grey3_light3' size='md'>
                        Auto-renewal
                      </Text>
                      <View className='flex-row gap-[4px] items-center'>
                        <Text color='grey1_light1' size='md'>
                          {!cancel_at_period_end ? 'Enabled' : 'Disabled'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <GradientPressable type='dark' className='h-[48px] items-center justicy-center rounded-[99999px]' combinedStyle={{ width: '100%' }} onPress={() => handleUpdateSubscriptionOptionStatus({ active: !cancel_at_period_end ? false : true, product_id: product?.id || '', platform })}>
                  <Text className='font-[600]' size='md' color='grey1_light2'>
                    {updatingSubscriptionOptionStatus === product?.id ? `${!cancel_at_period_end ? 'Disabling...' : 'Enabling...'}` : `${!cancel_at_period_end ? 'Disable' : 'Enable'} auto-renewal`}
                  </Text>
                </GradientPressable>
              </View>
            )
          })}
        </View>
      </View>
    </AuthenticatedLayout>
  )
}
