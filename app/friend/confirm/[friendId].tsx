import { GradientPressable, Pressable, Text, View } from '@/app/_shared/components/reusable'
import AuthenticatedLayout from '@/app/_shared/layout/authenticatedLayout'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useDimensions from '@/app/_hooks/dimensions'
import useBreakpoints from '@/app/_hooks/breakpoints'
import { useEffect, useState } from 'react'
import themeVars from '@/app/_styles/theme/themeVars'
import { Image, ActivityIndicator } from 'react-native'
import { useApi } from '@/app/_context/api'
import { useUser, UserType } from '@/app/_context/user'
import { CompanionAttributes, CompanionInfos } from '@/app/_context/auth.types'
import IconRefresh from '@/app/_assets/icons/refresh.svg'

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
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId

  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const { user, setUser, updateUser } = useUser()
  const api = useApi()

  const [updatingImage, setUpdatingImage] = useState(false)

  useEffect(() => {
    const onCompanionUpdateEvent: any = async ({ companion }: { companion: CompanionInfos }) => {
      const newUser = await updateUser()
      setUpdatingImage(false)

      if (friendId) {
        const activeCompanion = newUser?.companions?.find((companion) => companion?.id === friendId)
        if (activeCompanion) {
          // @ts-ignore
          setUser({ ...newUser, activeCompanion })
        }
      }
    }

    api.socketState?.on('companion_update', onCompanionUpdateEvent)

    return () => {
      api.socketState?.off('companion_update', onCompanionUpdateEvent)
    }
  }, [])

  const handleMakeChanges = () => {
    router.push(`/friend/edit/${user?.activeCompanion?.id}`)
  }

  const handleStartChatting = () => {
    router.push(`/friend/${user?.activeCompanion?.id}`)
  }

  const handleRefreshImage = async () => {
    try {
      setUpdatingImage(true)
      const req = await api.postRegenerateCompanionPicture({ companionId: user?.activeCompanion?.id || '' })
      const data = req?.data
    } catch (error) {
      console.warn(error)
      setUpdatingImage(false)
    }
  }

  useEffect(() => {
    if (friendId && friendId !== 'new') {
      const activeCompanion = user?.companions?.find((companion) => companion?.id === friendId)
      if (activeCompanion) {
        setUser((prev) => ({ ...(prev as UserType), activeCompanion: activeCompanion }))
      }
    }
  }, [])

  return (
    <AuthenticatedLayout disableRelative={true} keepSafePaddingOnMobile={true}>
      <View className='base:py-[40px] phone:py-[0px] flex-1'>
        <View className='base:flex-col tablet:flex-row justify-center base:items-center base:gap-[30px] tablet:gap-[90px] flex-1'>
          {/* Logo */}
          <View className='base:w-[100%] phone:max-w-[300px] tablet:max-w-[500px] base:max-h-[unset] items-center justify-center rounded-md'>
            <Image
              source={{ uri: user?.activeCompanion?.profile_picture?.image }}
              style={{
                borderRadius: themeVars.borderRadius.md,
                ...(breakpoints === 'phone' ? { width: dimentions?.deviceWidth - 48 - 32, height: dimentions?.deviceWidth - 48 - 32 } : breakpoints === 'tablet' ? { width: 300, height: 300 } : { width: 500, height: 500 }),
              }}
            />

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
          <View className='w-[100%] flex-1 gap-[100px]'>
            {breakpoints === 'phone' ? (
              <Text className='text-center font-[600]' size='xl' color='grey1_light1'>
                {user?.activeCompanion?.name}, {user?.activeCompanion?.age}
              </Text>
            ) : (
              <></>
            )}

            {breakpoints === 'phone' ? (
              <></>
            ) : (
              <View className='gap-[4px]'>
                <Text className='text-center font-[600]' size='3xl' color='grey1_light3'>
                  {user?.activeCompanion?.name}
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
