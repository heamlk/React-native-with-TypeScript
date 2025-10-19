import useDimensions from '@/app/_hooks/dimensions'
import { View, Pressable, GradientPressable, Text } from '@/app/_shared/components/reusable'
import Soul from '@/app/_shared/components/Soul'
import { Image } from 'react-native'
import ImageBackground from '@/app/_assets/images/background.jpg'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import themeVars from '../_styles/theme/themeVars'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { usePopup } from '../_context/popup'
import { useUser } from '../_context/user'

export default function FriendPage() {
  const { user, friendLimitReached, friendLimitReachedDialog } = useUser()
  const { theme } = useTheme()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const { setPopup } = usePopup()

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 34 - 30

  const onCreateFriend = () => {
    if (friendLimitReached()) {
      setPopup({
        open: true,
        maxWidth: 600,
        content: (
          <View className='gap-[24px]'>
            <Text className='text-[24px] font-[600]' color='grey1_light1'>
              Friend limit reached
            </Text>
            <Text className='' size='md' color='grey1_light1'>
              {friendLimitReachedDialog()}
            </Text>
            <View className='flex-row gap-[16px]'>
              <GradientPressable
                className='w-[150px] h-[48px]'
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
      return
    }

    const isSubscribed = user?.profile?.is_subscribed
    if (isSubscribed) {
      router.push('/friend/new')
      return
    }
  }

  return (
    <AuthenticatedLayout>
      <View className='relative p-[25px] base:rounded-[0px] phone:rounded-lg' style={{ cursor: 'auto', width: containerWidth, minHeight: containerHeight }} background='grey6_dark1'>
        {theme === 'dark' ? <Image source={ImageBackground} className='absolute top-[0px] left-[0px] base:rounded-[0px] phone:rounded-lg' resizeMode='cover' style={{ cursor: 'auto', width: containerWidth, height: containerHeight }} /> : <></>}

        <LinearGradient
          className='w-[100%] max-w-[650px] m-auto phone:pt-[105px] phone:pb-[55px] phone:px-[85px] phone:border-[2px] border-light2/10 rounded-md relative'
          colors={breakpoints === 'phone' ? ['transparent', 'transparent'] : theme === 'light' ? [themeVars.colors.grey5, themeVars.colors.grey5] : ['#25192f', 'rgba(37, 25, 47, 0.4)']}
          start={{ x: 0.75, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View className='w-[200px] h-[200px] phone:absolute left-[0px] right-[0px] phone:top-[-100px] mx-auto'>
            <Soul width={200} height={200} soulSize={200} />
          </View>

          <View className='items-center gap-[55px]'>
            <View className='gap-[24px]'>
              <Text className='text-center' color='grey2_light3' size='lg'>
                In a world where AI excels at tasks, we've discovered its potential for something more profound - friendship. Our platform bridges the gap between human social bonds and AI's limitless potential, allowing you to craft a unique companion. Design their looks, choose their traits, and watch as they come to
                life in a portrait of your making.
              </Text>
              <Text className='text-center' color='grey2_light3' size='lg'>
                It's not about replacing human connections, but enriching your world with a new kind of understanding. Welcome to a new frontier of connection - where will your imagination take you?
              </Text>
            </View>

            {breakpoints === 'phone' ? (
              <GradientPressable type='dark' combinedClassname='h-[48px] px-[12px]' onPress={onCreateFriend}>
                <Text className='text-light2' size='xl'>
                  Create a Friend
                </Text>
              </GradientPressable>
            ) : (
              <Pressable className='px-[50px] py-[20px] border-[2px] rounded-md' background='grey3_dark1' border='transparent_light3' onPress={onCreateFriend}>
                <Text color='white_light3' size='xl'>
                  Create a Friend
                </Text>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </View>
    </AuthenticatedLayout>
  )
}
