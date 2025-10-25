import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { GradientPressable, Pressable, Text, TextInput, View } from '../_shared/components/reusable'
import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { useUser } from '../_context/user'
import useBreakpoints from '../_hooks/breakpoints'
import useDimensions from '../_hooks/dimensions'
import IconSettings from '@/app/_assets/icons/settings.svg'
import IconAnimationToggle from '@/app/_assets/icons/animations-toggle.svg'
import IconClean from '@/app/_assets/icons/clean.svg'
import IconChecked from '@/app/_assets/icons/check-circle.svg'
import IconMicrophone from '@/app/_assets/icons/microphone'
import IconMessage from '@/app/_assets/icons/message'
import themeVars from '../_styles/theme/themeVars'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../_context/theme'

export default function User() {
  const { theme } = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId
  const { user, setUser, updateUser } = useUser()
  const breakpoints = useBreakpoints()
  const dimentions = useDimensions()

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 48 - 30

  const [allowUser, setAllowUser] = useState(false)

  const handleEdit = () => {}
  const handleAnimationToggle = () => {}
  const handleClear = () => {}

  useEffect(() => {
    if (!friendId) {
      router.push('/profile')
      return
    }

    if (!user?.companions || user?.companions?.length === 0) {
      router.push('/profile')
      return
    }

    updateUser()
    setAllowUser(true)
  }, [])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout keepSafePaddingOnMobile={false}>
      <View className='base:flex-col phone:flex-row base:rounded-[0px] phone:rounded-lg' style={{ width: containerWidth, height: containerHeight }} background='grey6_dark1'>
        {/* Character */}
        <View className='base:p-[0] phone:p-[16px]' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth } : breakpoints === 'tablet' ? { width: 300 } : { width: 664 }}>
          <View className='base:rounded-t-[0px] phone:rounded-t-md relative' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }}>
            <Image source={{ uri: user?.activeCompanion?.profile_picture?.image }} className='base:rounded-t-[0px] phone:rounded-t-md' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }} />

            {breakpoints === 'phone' ? <LinearGradient className='flex-1 h-[40px] absolute bottom-[0px] left-[0px] z-[100]' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ width: dimentions.deviceWidth }} /> : <></>}

            {/* Settings */}
            {breakpoints !== 'phone' ? (
              <Pressable className='w-[40px] h-[40px] absolute top-[24px] right-[24px] rounded-[9999px] items-center justify-center pt-[3px] pr-[1px]' background='grey6/40_dark6/40' onPress={handleEdit}>
                <IconSettings />
              </Pressable>
            ) : (
              <></>
            )}
            {/* Settings - END */}

            <View className='w-[100%] h-[40px] overflow-visible flex-row items-center justify-between absolute bottom-[24px] left-[0px] px-[24px]'>
              <View className='gap-[10px] flex-row items-center'>
                <Text className='text-[24px] font-[600]' color='grey1_light2'>
                  {user?.activeCompanion?.name}
                </Text>
                {breakpoints === 'phone' ? (
                  <Pressable className='w-[20px] h-[20px] rounded-[9999px] items-center justify-center mt-[6px]' background='grey6/40_dark6/40' onPress={handleEdit}>
                    <View className='scale-[0.6] mt-[2px] ml-[1px]'>
                      <IconSettings />
                    </View>
                  </Pressable>
                ) : (
                  <></>
                )}
              </View>

              <View className='flex-row items-center gap-[8px]'>
                <Pressable className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' background='black/50_dark1' onPress={handleAnimationToggle}>
                  <IconAnimationToggle />
                  <View className='border-[2px] rounded-[999px] absolute bottom-[-2px] right-[-2px]' border='transparent_dark1'>
                    <IconChecked className='rounded-[999px]' />
                  </View>
                </Pressable>

                <Pressable className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' background='black/50_dark1' onPress={handleClear}>
                  <IconClean />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {/* Character - END */}

        {/* Divider */}
        {breakpoints !== 'phone' ? <View className='w-[1px]' background='grey5_dark2' style={{ height: containerHeight }}></View> : <></>}
        {/* Divider - END */}

        {/* Chat container */}
        <View className='flex-1 px-[16px] base:py-[24px] phone:py-[32px]'>
          <View className='flex-1 base:gap-[24px] phone:gap-[40px]'>
            <View className='w-[100%] max-w-[496px] rounded-[16px] px-[20px] py-[12px] mx-auto' background='grey5_dark2'>
              <Text className='font-[500] text-center' size='md' color='grey2_light3'>
                Please keep in mind that all of the interactions are fictional. Do not take actual advice you see in this chat.
              </Text>
            </View>

            {/* Chat area */}
            <View className='w-[100%] max-w-[640px] mx-auto flex-1 gap-[16px] mb-[16px] overflow-y-auto'>
              <View className='gap-[16px] flex-row items-center'>
                <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                <GradientPressable combinedClassname='h-[44px] px-[10px] items-center justify-center' gradientClassname='rounded-[16px]' type='primary' isPressable={false}>
                  <Text className='font-[500]' size='md' color='light1'>
                    Hi oiofdibo! How's everything?
                  </Text>
                </GradientPressable>
              </View>
            </View>
            {/* Chat area - END */}
          </View>

          {/* Input */}
          <View className='w-[100%] max-w-[640px] h-[60px] flex-row border-[1px] rounded-[31px] mx-auto relative' border='grey5_dark3' background='grey5_dark2'>
            <TextInput className='h-[60px] flex-1 text-[16px] pl-[24px] pr-[12px]' color='grey1_light1' placeholder='Type a message…' />
            <View className='h-[60px] flex-row items-center gap-[10px] pr-[24px]'>
              <Pressable className=''>
                <IconMicrophone width={24} height={24} color={themeVars.colors.purple5} hoverColor={themeVars.colors.purple3} />
              </Pressable>

              <Pressable className=''>
                <IconMessage width={30} height={30} color={themeVars.colors.purple1} />
              </Pressable>
            </View>
          </View>
          {/* Input - END */}
        </View>
        {/* Chat container - END */}
      </View>
    </AuthenticatedLayout>
  )
}
