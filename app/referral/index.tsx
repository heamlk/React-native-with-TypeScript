import { useTheme } from '@/app/_context/theme'
import { View, Text, Pressable } from '@/app/_shared/components/reusable'
import AuthenticatedLayout from '@/app/_shared/layout/authenticatedLayout'
import themeVars from '@/app/_styles/theme/themeVars'
import IconCopy from '@/app/_assets/icons/copy'
import Terms from '../_shared/policy/terms'
import { usePopup } from '../_context/popup'
import { useEffect, useState } from 'react'
import { useApi } from '../_context/api'
import type { ReferralInfo } from '../_context/auth.types'
import * as Clipboard from 'expo-clipboard'
import { useUser } from '../_context/user'

export default function ReferralPage() {
  const { theme } = useTheme()
  const { setPopup } = usePopup()
  const { user } = useUser()
  const api = useApi()

  const [referralInfo, setReferralInfo] = useState<null | ReferralInfo>(null)

  const handleCopyReferral = ({ text }: { text: string }) => {
    Clipboard.setStringAsync(text)
  }

  const handleOpenTerms = () => {
    setPopup({
      open: true,
      content: (
        <View className='w-full h-fit'>
          <Terms />
        </View>
      ),
    })
  }

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await api.getReferralInfo()
        const data = res?.data
        setReferralInfo(data)
      } catch (error) {
        console.warn(error)
      }
    }

    getInfo()
  }, [])

  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] max-w-[500px] mx-auto'>
        <View className='gap-[12px]'>
          <View className='p-[24px] rounded-[16px] items-center gap-[24px] border-[1px]' style={{ borderColor: theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity20 }} background='grey6_transparent'>
            <Text className='text-center' size='md' color='grey1_light1'>
              Your unique referral code:
            </Text>
            <View className='flex-row items-center gap-[8px]'>
              <Text className='text-center font-[600]' size='2xl' color='grey1_purple3'>
                {user?.profile?.personal_referral_code}
              </Text>
              <Pressable
                className='w-[40px] h-[40px] items-center justify-center rounded-[99999px]'
                style={{ backgroundColor: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.purple3 + themeVars.colors.opacity10 }}
                onPress={() => {
                  handleCopyReferral({ text: user?.profile?.personal_referral_code || '' })
                }}
              >
                <IconCopy width={28} height={28} theme={theme} />
              </Pressable>
            </View>
          </View>

          <View className='p-[24px] rounded-[16px] items-center gap-[24px] border-[1px]' style={{ borderColor: theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity20 }} background='grey6_transparent'>
            <Text className='text-center' size='md' color='grey1_light1'>
              At this time you have accumulated:
            </Text>
            <View className='w-[100%] gap-[8px]'>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text color='grey3_purple5' size='md'>
                  Non-paid accounts
                </Text>
                <Text color='grey1_light1' size='md'>
                  {referralInfo?.non_paid_accounts || 0}
                </Text>
              </View>
              <View className='w-[100%] flex-row items-center justify-between'>
                <Text color='grey3_purple5' size='md'>
                  Paid accounts
                </Text>
                <Text color='grey1_light1' size='md'>
                  {referralInfo?.paid_accounts || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className='w-[100%] mx-auto gap-[12px] mt-[32px]'>
          <View
            className='p-[24px] rounded-[16px] items-center gap-[24px] border-[1px]'
            style={theme === 'light' ? { backgroundColor: themeVars.colors.grey5, borderColor: 'transparent' } : { backgroundColor: themeVars.colors.dark3 + themeVars.colors.opacity50, borderColor: themeVars.colors.purple2 + themeVars.colors.opacity20 }}
          >
            <View className='w-[100%] flex-row items-center justify-between'>
              <Text className='font-[500]' color='grey1_light1' size='md'>
                You may redeem:
              </Text>
              <Text className='font-[600]' color='grey1_light1' size='xl'>
                {'$' + referralInfo?.redeem?.toFixed(2) || '$0.00'}
              </Text>
            </View>
          </View>

          <View className='p-[24px] rounded-[16px] flex-row items-center justify-between border-[1px]' style={{ borderColor: theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity20 }} background='grey6_transparent'>
            <Text color='grey3_purple5' size='md'>
              Previously collected:
            </Text>
            <Text color='grey1_light1' size='md'>
              {'$' + referralInfo?.previously_redeemed?.toFixed(2) || '$0.00'}
            </Text>
          </View>
        </View>

        <Pressable className='mx-auto mt-[32px]' onPress={handleOpenTerms}>
          <Text size='md' color='grey3_purple5'>
            Terms of Service
          </Text>
        </Pressable>
      </View>
    </AuthenticatedLayout>
  )
}
