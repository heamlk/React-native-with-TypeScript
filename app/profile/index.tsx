import { getThemeBackground, GradientPressable, Pressable, Text, View } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { Platform, Image } from 'react-native'
import IconUser from '@/app/_assets/icons/user'
import { useTheme } from '../_context/theme'
import { useAuth } from '../_context/auth'
import themeVars from '../_styles/theme/themeVars'
import useBreakpoints from '../_hooks/breakpoints'
import { useRouter } from 'expo-router'
import IconNext from '@/app/_assets/icons/next'
import IconBubbles from '@/app/_assets/icons/bubbles.svg'
import { usePopup } from '../_context/popup'
import * as Linking from 'expo-linking'
import OpenSourceLicense from '@/app/_shared/policy/openSourceLicense'
import { useUser } from '../_context/user'
import IconCheckGreen from '@/app/_assets/icons/check-green.svg'

export default function ProfilePage() {
  const breakpoints = useBreakpoints()
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { logout } = useAuth()
  const { setPopup } = usePopup()

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  const handleManageSubscription = () => {
    router.push('/subscription')
  }

  const handleReferralProgram = () => {
    router.push('/referral')
  }

  const handleHelpUsImprove = () => {
    Linking.openURL('https://form.jotform.com/241255026988059')
  }

  const handleOpenSourceLicenses = () => {
    setPopup({
      open: true,
      content: <OpenSourceLicense />,
    })
  }

  const handleVerifyAge = () => {}

  const handleBringModel = () => {
    router.push('/model')
  }

  const formatDate = ({ date }: { date: Date }) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] max-w-[500px] mx-auto'>
        {/* Avatar */}
        <View className='w-[128px] h-[128px] relative mx-auto'>
          <View className='w-[128px] h-[128px] items-center justify-center border-[1px] rounded-[999999px] relative overflow-hidden' style={theme === 'light' ? { backgroundColor: themeVars.colors.grey6, borderColor: 'transparent' } : { borderColor: themeVars.colors.dark4 }}>
            <View className='w-[128px] h-[128px] absoulte top-0 bottom-0 left-0 right-0 m-auto border-[8px] z-[1] rounded-[999999px]' style={{ borderColor: theme === 'light' ? themeVars.colors.grey6 : getThemeBackground({ theme, breakpoints, background: 'primary' }) }}></View>

            {/* Profile picture */}
            {user?.profile?.avatar ? (
              Platform.OS === 'web' ? (
                <img src={user?.profile?.avatar} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
              ) : (
                <Image source={{ uri: user?.profile?.avatar }} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
              )
            ) : (
              <IconUser width={140} height={140} color={theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.dark4} className='absolute top-[20px]' />
            )}
          </View>
          {/* Profile picture - END */}
        </View>
        {/* Avatar - END */}

        <View className='mt-[8px] gap-[4px]'>
          <Text className='text-center' size='md' color='grey1_light1'>
            {user?.profile?.username}
          </Text>
          <Text className='text-center' size='sm' color='grey2_light3'>
            {user?.profile?.first_name} {user?.profile?.last_name}
          </Text>
        </View>

        <View className='gap-[16px] mt-[32px]'>
          <View className='w-[100%] px-[24px] py-[14px] gap-[8px] rounded-sm' background='grey6_dark7'>
            <View className='w-[100%] flex-row items-center justify-between'>
              <Text color='grey3_light3' size='md'>
                Email
              </Text>
              <Text color='grey1_light1' size='md'>
                {user?.profile?.email}
              </Text>
            </View>
            <View className='w-[100%] flex-row items-center justify-between'>
              <Text color='grey3_light3' size='md'>
                Date of Birth
              </Text>
              <Text color='grey1_light1' size='md'>
                {user?.profile?.date_of_birth?.replaceAll('-', '/')}
              </Text>
            </View>
            <Pressable className='w-[100%] flex-row items-center justify-between mt-[20px]' onPress={handleVerifyAge}>
              <Text color='grey1_light1' size='md' className='font-[600]'>
                Verify age
              </Text>

              <IconNext width={18} height={20} theme={theme} />
            </Pressable>
          </View>

          <View className='w-[100%] px-[24px] py-[14px] gap-[8px] rounded-sm' background='grey6_dark7'>
            <Text color='grey3_light3' size='md'>
              Interests
            </Text>
            <View className='flex-row flex-wrap items-center gap-[8px]'>
              {user?.profile?.interests?.map((interest) => {
                return (
                  <View key={interest + 55553} className='px-[10px] py-[6px] rounded-[9999px]' background='grey5_dark5'>
                    <Text color='grey1_light1'>{user?.interests?.[interest]}</Text>
                  </View>
                )
              })}
            </View>
          </View>

          <View className='my-[12px]'>
            <GradientPressable type='dark' combinedClassname='w-[100%] h-[48px] items-center justify-center' onPress={handleEditProfile}>
              <Text size='md' color='grey1_light2' className='text-center font-[600]'>
                Edit profile
              </Text>
            </GradientPressable>
          </View>

          <View className='w-[100%] px-[24px] py-[14px] gap-[16px] rounded-sm' background='grey6_dark7'>
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

            <Pressable className='w-[100%] flex-row items-center justify-between' onPress={handleManageSubscription}>
              <Text color='grey1_light1' size='md' className='font-[600]'>
                Manage subscription
              </Text>

              <IconNext width={18} height={20} theme={theme} />
            </Pressable>
          </View>

          {user?.profile?.subscription?.status === 'active' && (
            <View className='w-[100%] px-[24px] py-[14px] gap-[16px] rounded-sm' background='grey6_dark7'>
              <Pressable className='w-[100%] flex-row items-center justify-between' onPress={handleBringModel}>
                <Text color='grey1_light1' size='md' className='font-[600]'>
                  Bring your own model
                </Text>

                <IconNext width={18} height={20} theme={theme} />
              </Pressable>
            </View>
          )}

          <View className='w-[100%] px-[24px] py-[14px] gap-[16px] rounded-sm' background='grey6_dark7'>
            <Pressable className='w-[100%] flex-row items-center justify-between' onPress={handleReferralProgram}>
              <Text color='grey1_light1' size='md' className='font-[600]'>
                Referral program
              </Text>

              <IconNext width={18} height={20} theme={theme} />
            </Pressable>
          </View>

          <View className='w-[100%] px-[24px] py-[14px] gap-[16px] rounded-sm' background='grey6_dark7'>
            <Pressable className='w-[100%] flex-row items-center justify-between' onPress={handleHelpUsImprove}>
              <IconBubbles />

              <Text color='grey1_light1' size='md' className='font-[600]'>
                Help us improve
              </Text>

              <IconNext width={18} height={20} theme={theme} />
            </Pressable>
          </View>

          <View className='w-[100%] px-[24px] py-[14px] gap-[16px] rounded-sm' background='grey6_dark7'>
            <Pressable className='w-[100%] flex-row items-center justify-between' onPress={handleOpenSourceLicenses}>
              <Text color='grey1_light1' size='md' className='font-[600]'>
                Open Source Licenses
              </Text>

              <IconNext width={18} height={20} theme={theme} />
            </Pressable>
          </View>

          <View className='my-[12px]'>
            <GradientPressable type='dark' combinedClassname='w-[100%] h-[48px] items-center justify-center' onPress={() => logout()}>
              <Text size='md' color='grey1_light2' className='text-center font-[600]'>
                Logout
              </Text>
            </GradientPressable>
          </View>
        </View>
      </View>
    </AuthenticatedLayout>
  )
}
