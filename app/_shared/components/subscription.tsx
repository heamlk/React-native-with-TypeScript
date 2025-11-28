import { useEffect, useState } from 'react'
import { Pressable, View, Text, getThemeBackground, GradientPressable } from '@/app/_shared/components/reusable'
import IconCheckGreen from '@/app/_assets/icons/check-green.svg'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import { useUser } from '@/app/_context/user'
import { useApi } from '@/app/_context/api'
import { Platform } from 'react-native'

export default function Subscription() {
  const { user, updateUser } = useUser()
  const { theme } = useTheme()
  const api = useApi()
  const breakpoints = useBreakpoints()

  const redirectUrl = Platform.OS === 'web' ? '/subscription' : `/subscription/mobile`

  const [selectedSubscription, setSelectedSubscription] = useState(0)
  const [fetchingMonthlySubscription, setFetchingMonthlySubscription] = useState(false)

  const formatDate = ({ date }: { date: Date }) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  const handleMothlySubscription = async () => {
    if (fetchingMonthlySubscription) {
      return
    }

    try {
      setFetchingMonthlySubscription(true)
      const req = await api.postGetNewSubscriptionUrl({ mode: selectedSubscription === 0 ? 'monthly' : 'lifetime', cancel_url: redirectUrl, success_url: redirectUrl })
      const data = req?.data
      const url = data?.url
      setFetchingMonthlySubscription(false)

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.warn(error)
      setFetchingMonthlySubscription(false)
    }
  }

  useEffect(() => {
    updateUser()
  }, [])

  return (
    <View className='w-[100%] p-[24px] rounded-sm' background='grey6_dark7'>
      {user?.profile?.subscription?.status === 'active' ? (
        <View className='gap-[10px]'>
          <View className='w-[100%] flex-row items-center justify-between'>
            <Text color='grey3_light3' size='md'>
              Status
            </Text>
            <View className='flex-row gap-[4px] items-center'>
              {user?.profile?.is_subscribed ? (
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
          {user?.profile?.subscription?.status === 'active' && (
            <>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text color='grey3_light3' size='md'>
                  Member since
                </Text>
                <View className='flex-row gap-[4px] items-center'>
                  <Text color='grey1_light1' size='md'>
                    {formatDate({ date: new Date((user?.profile?.subscription?.start_date || 0) * 1000) })}
                  </Text>
                </View>
              </View>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text color='grey3_light3' size='md'>
                  Member until
                </Text>
                <View className='flex-row gap-[4px] items-center'>
                  <Text color='grey1_light1' size='md'>
                    {formatDate({ date: new Date((user?.profile?.subscription?.current_period_end || 0) * 1000) })}
                  </Text>
                </View>
              </View>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text color='grey3_light3' size='md'>
                  Auto-renewal
                </Text>
                <View className='flex-row gap-[4px] items-center'>
                  <Text color='grey1_light1' size='md'>
                    {!user?.profile?.subscription?.cancel_at_period_end ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <></>
      )}

      {user?.profile?.subscription?.status !== 'active' ? (
        <>
          <View className='gap-[16px]'>
            <Pressable className='flex-row items-center gap-[10px]' onPress={() => setSelectedSubscription(0)}>
              <View className='w-[16px] h-[16px] rounded-[9999px] border-[1px] cursor-pointer' style={{ borderColor: getThemeBackground({ theme, breakpoints, background: 'button' }), backgroundColor: selectedSubscription === 0 ? getThemeBackground({ theme, breakpoints, background: 'button' }) : 'transparent' }} />
              <Text className='font-[600]' size='xl' color='grey1_light1'>
                $7.00
                <Text size='md' color='grey1_light1'>
                  /month
                </Text>
              </Text>
            </Pressable>

            <View className='gap-[8px]'>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text size='sm' color='grey2_light3'>
                  Unlimited Text & upscaled friend image generation
                </Text>
                <IconCheckGreen />
              </View>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text size='sm' color='grey2_light3'>
                  The option to age verify to unlock more capabilities
                </Text>
                <IconCheckGreen />
              </View>
            </View>
          </View>

          <View className='w-[100%] h-[1px] mb-[16px] mt-[20px] border-t-[1px]' border='grey5_dark3'></View>

          <View className='gap-[16px]'>
            <Pressable className='flex-row items-center gap-[10px]' onPress={() => setSelectedSubscription(1)}>
              <View className='w-[16px] h-[16px] rounded-[9999px] border-[1px] cursor-pointer' style={{ borderColor: getThemeBackground({ theme, breakpoints, background: 'button' }), backgroundColor: selectedSubscription === 1 ? getThemeBackground({ theme, breakpoints, background: 'button' }) : 'transparent' }} />
              <Text className='font-[600] flex flex-col' size='xl' color='grey1_light1'>
                250 for life
                <Text className='font-[400]' size='sm' color='black_light5'>
                  &nbsp;100 are left
                </Text>
              </Text>
            </Pressable>

            <View className='gap-[8px]'>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text size='sm' color='grey2_light3'>
                  Unlimited Text & upscaled friend image generation
                </Text>
                <IconCheckGreen />
              </View>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text size='sm' color='grey2_light3'>
                  The option to age verify to unlock more capabilities
                </Text>
                <IconCheckGreen />
              </View>
            </View>

            <GradientPressable type='dark' className='h-[48px] items-center justicy-center rounded-[99999px]' combinedStyle={{ width: '100%' }} onPress={handleMothlySubscription}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Subscribe
              </Text>
            </GradientPressable>
            <Text className='opacity-70' size='md' color='grey2_light3'>
              Cancel anytime. Plan automatically renews until cancelled.
            </Text>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  )
}
