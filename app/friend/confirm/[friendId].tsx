import { GradientPressable, Pressable, Text, View } from '@/app/_shared/components/reusable'
import AuthenticatedLayout from '@/app/_shared/layout/authenticatedLayout'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useDimensions from '@/app/_hooks/dimensions'
import useBreakpoints from '@/app/_hooks/breakpoints'
import { useEffect, useState } from 'react'
import themeVars from '@/app/_styles/theme/themeVars'
import { Image, ActivityIndicator } from 'react-native'
import { useApi } from '@/app/_context/api'
import { useUser } from '@/app/_context/user'
import { CompanionInfos } from '@/app/_context/auth.types'
import IconRefresh from '@/app/_assets/icons/refresh.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { borderRadiusNative } from '@/app/_styles/theme/borderRadius'

export type SelcetInputType = {
  open: boolean
  position: {
    x: number
    y: number
  }
  type: 'input' | 'select'
  inputPlaceholder: string
  value: string
  selectOptions: { name: string; value: string }[]
  onChange: (string: string) => void
}

export const defaultSelcetInput: SelcetInputType = {
  open: false,
  position: {
    x: 0,
    y: 0,
  },
  type: 'input',
  value: '',
  inputPlaceholder: '',
  selectOptions: [],
  onChange: (string: string) => {},
}

export const asd = {}

export default function NewFriendPage() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId

  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const { user, setUser, updateUser } = useUser()
  const api = useApi()

  const [friend, setFriend] = useState(user?.companions?.find((obj) => obj?.id === friendId))
  const [updatingImage, setUpdatingImage] = useState(false)

  useEffect(() => {
    const onCompanionUpdateEvent: any = async ({ companion }: { companion: CompanionInfos }) => {
      const newUser = await updateUser()
      setUpdatingImage(false)

      if (friendId) {
        const newFriend = newUser?.companions?.find((companion) => companion?.id === friendId)
        if (newFriend) {
          setFriend(newFriend)
        }
      }
    }

    api.socketState?.on('companion_update', onCompanionUpdateEvent)

    return () => {
      api.socketState?.off('companion_update')
    }
  }, [api.socketState?.active])

  const handleMakeChanges = () => {
    router.push(`/friend/edit/${friend?.id}`)
  }

  const handleStartChatting = () => {
    router.push(`/friend/${friend?.id}`)
  }

  const handleRefreshImage = async () => {
    try {
      setUpdatingImage(true)
      const req = await api.postRegenerateCompanionPicture({ companionId: friend?.id || '' })
      const data = req?.data
    } catch (error) {
      console.warn(error)
      setUpdatingImage(false)
    }
  }

  useEffect(() => {
    if (friendId && friendId !== 'new') {
      const activeFriend = user?.companions?.find((companion) => companion?.id === friendId)
      if (activeFriend) {
        setFriend(activeFriend)
      }
    }
  }, [])

  useEffect(() => {
    const fn = async () => {
      const updatedUser = await updateUser()
      const newFriend = updatedUser?.companions?.find((obj) => obj?.id === friendId)

      if (newFriend) {
        setFriend(newFriend)
      }
    }

    fn()
  }, [])

  return (
    <AuthenticatedLayout disableRelative={true} keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='base:py-[40px] phone:py-[0px] flex-1' style={{ paddingBottom: insets.bottom + 25 }}>
        <View className='base:flex-col tablet:flex-row base:justify-between phone:justify-center base:items-center phone:items-center base:gap-[30px] tablet:gap-[90px] phone:mt-[60px] base:flex-1 phone:flex-[unset]'>
          {/* Logo */}
          <View className='base:w-[100%] phone:max-w-[300px]  tablet:max-w-[500px] base:max-h-[unset] items-center justify-center rounded-md'>
            <Image
              source={{ uri: friend?.profile_picture?.image }}
              style={{
                borderRadius: borderRadiusNative.md,
                ...(breakpoints === 'phone' ? { width: dimentions?.deviceWidth - 48 - 32, height: dimentions?.deviceWidth - 48 - 32 } : breakpoints === 'tablet' ? { width: 300, height: 300 } : { width: 500, height: 500 }),
              }}
            />
            {breakpoints === 'phone' ? (
              <Text className='text-center font-[600] mt-[32px]' size='xl' color='grey1_light1'>
                {friend?.name}, {friend?.age}
              </Text>
            ) : (
              <></>
            )}

            <Pressable className='w-[48px] h-[48px] rounded-[20px] items-center justify-center absolute top-[12px] base:right-[32px] phone:right-[12px]' background='grey6/40_dark6/40' onPress={handleRefreshImage}>
              <IconRefresh />
            </Pressable>

            {updatingImage ? (
              <View className='w-[100%] h-[100%] absolute top-[0px] left-[0px] z-[10] rounded-[20px] items-center justify-center' background='dark6/30'>
                <ActivityIndicator size='large' color={themeVars.colors.purple1} />
              </View>
            ) : (
              <></>
            )}
          </View>
          {/* Logo - END */}

          {/* Form */}
          <View className='w-[100%] max-w-[600px] gap-[100px] base:my-[unset] phone:my-auto'>
            {breakpoints === 'phone' ? (
              <></>
            ) : (
              <View className='gap-[4px]'>
                <Text className='text-center font-[600]' size='3xl' color='grey1_light3'>
                  {friend?.name}
                </Text>
                <Text className='text-center font-[600]' size='lg' color='grey2_light3/50'>
                  {user?.profile?.first_name}’s new friend
                </Text>
              </View>
            )}

            {breakpoints !== 'phone' ? (
              <View className='flex-row gap-[20px] justify-center flex-1'>
                <Pressable className='w-[100%] max-w-[290px] h-[92px] items-center justify-center rounded-md border-[2px]' background='grey3_dark1' border='transparent_purple2/40' onPress={handleMakeChanges}>
                  <Text className='text-[24px] font-[600]' color='light1_light3'>
                    Make changes
                  </Text>
                </Pressable>

                <Pressable className='w-[100%] max-w-[290px] h-[92px] items-center justify-center rounded-md border-[2px]' background='grey3_dark1' border='transparent_purple2/40' onPress={handleStartChatting}>
                  <Text className='text-[24px] font-[600]' color='light1_light3'>
                    Start Chatting
                  </Text>
                </Pressable>
              </View>
            ) : (
              <></>
            )}

            {breakpoints === 'phone' ? (
              <View className='flex-1 gap-[12px] justify-end'>
                <GradientPressable combinedClassname='w-[100%] h-[48px] items-center justify-center rounded-md' type={breakpoints === 'phone' ? 'primary' : 'primary'} onPress={handleMakeChanges}>
                  <Text className='text-[24px] font-[600]' size='md' color='light1_light3'>
                    Make changes
                  </Text>
                </GradientPressable>

                <GradientPressable combinedClassname='w-[100%] h-[48px] items-center justify-center rounded-md' type={breakpoints === 'phone' ? 'primary' : 'dark'} onPress={handleStartChatting}>
                  <Text className='text-[24px] font-[600]' size='md' color='light1_light3'>
                    Start Chatting
                  </Text>
                </GradientPressable>
              </View>
            ) : (
              <></>
            )}
          </View>
          {/* Form - END */}
        </View>
      </View>
    </AuthenticatedLayout>
  )
}
