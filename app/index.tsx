import IconArrow from '@/app/assets/icons/arrow-white-right.svg'
import VideoCarousel1 from '@/app/assets/media/carousel1.mp4'
import VideoCarousel2 from '@/app/assets/media/carousel2.mp4'
import VideoCarousel3 from '@/app/assets/media/carousel3.mp4'
import VideoCarousel4 from '@/app/assets/media/carousel4.mp4'
import VideoCarousel5 from '@/app/assets/media/carousel5.mp4'
import VideoCarousel6 from '@/app/assets/media/carousel6.mp4'
import VideoCarousel7 from '@/app/assets/media/carousel7.mp4'
import VideoCarousel8 from '@/app/assets/media/carousel8.mp4'
import VideoCarousel9 from '@/app/assets/media/carousel9.mp4'
import { ResizeMode, Video } from 'expo-av'
import { useRef } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { useAuth } from './context/descope'
import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import { Text } from './shared/components/reusable'
import vars from './styles/vars'
import { BlurView } from 'expo-blur'
import elements from './styles/elements'
import IconLogo from '@/app/assets/icons/logo'
import IconGoogle from '@/app/assets/icons/google'
import IconMicrosoft from '@/app/assets/icons/microsoft'

export type HomeCarouselItemType = {
  videoUrl: string
  posterUrl: string
  title: string
}

export type CarouselItemsType = {
  videoUrl: any
  title: string
}[]

export const carouselItems: CarouselItemsType = [
  {
    videoUrl: VideoCarousel1,
    title: 'Fully integrated AI chat, speech, imagery, and animation.',
  },
  {
    videoUrl: VideoCarousel2,
    title: 'No online predators, safe, secure, private chat',
  },
  {
    videoUrl: VideoCarousel3,
    title: 'We are ever evolving our technology to improve the AI friend user experience',
  },
  {
    videoUrl: VideoCarousel4,
    title: 'Bring your AI friend to life with advanced animation',
  },
  {
    videoUrl: VideoCarousel5,
    title: 'No Prompting knowledge required',
  },
  {
    videoUrl: VideoCarousel6,
    title: 'Use our chat model, or bring your own - either way it uses BFFL.AI technology',
  },
  {
    videoUrl: VideoCarousel7,
    title: 'A marketplace to grow your best friend',
  },
  {
    videoUrl: VideoCarousel8,
    title: 'We will never sell your data or use your chats outside of your account',
  },
  {
    videoUrl: VideoCarousel9,
    title: "Explore your friend's unique universe and backstory",
  },
]

export default function Index() {
  const carouselRef = useRef<ICarouselInstance>(null)
  const { theme } = useTheme()
  const auth = useAuth()
  const breakpoints = useBreakpoints()

  const styles = StyleSheet.create({
    carouselVideoContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      borderRadius: vars.borderMd,
    },
    carouselVideoContent: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 11,
      top: 0,
      left: 0,
      borderRadius: vars.borderMd,
    },
    carouselVideoElement: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
    carouselVideoText: {
      fontSize: 32,
      fontWeight: 600,
      color: vars.white,
      position: 'absolute',
      bottom: 40,
      left: 40,
    },
  })

  return (
    <View className='flex-1 flex-row items-center justify-center'>
      <View className='w-[768] h-[576] p-[40] justify-between relative border-purple2/20 border-[2px] rounded-md'>
        <View className='w-fit flex-row gap-[16] relative z-[50]'>
          <Pressable className='w-[64] h-[64] items-center justify-center border-light1/40 border-[1px] rounded-[99999] pointer' onPress={() => carouselRef.current?.prev()}>
            <IconArrow style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
          <Pressable className='w-[64] h-[64] items-center justify-center border-light1/40 border-[1px] rounded-[99999] pointer' onPress={() => carouselRef.current?.next()}>
            <IconArrow />
          </Pressable>
        </View>
        <Carousel
          ref={carouselRef}
          loop
          width={768}
          height={576}
          autoPlay={true}
          data={carouselItems}
          autoPlayInterval={9995000}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.carouselVideoContent}>
              <Video style={styles.carouselVideoElement} videoStyle={styles.carouselVideoElement} source={item.videoUrl} useNativeControls={false} resizeMode={ResizeMode.COVER} isLooping shouldPlay isMuted />
              <Text style={styles.carouselVideoText}>{item.title}</Text>
            </View>
          )}
          style={styles.carouselVideoContainer}
          containerStyle={styles.carouselVideoContainer}
        />
      </View>

      <BlurView tint={'dark'} className='w-[540] pt-[72] pb-[64] px-[64] items-center border-[2px] border-purple2/20 rounded-md relative left-[-50] pr-[50]'>
        <IconLogo width={140} height={27} />
        <Text className='text-xl font-[600] mt-[40]' style={{ color: theme === 'dark' ? vars.light1 : vars.grey1 }}>
          Welcome to BFFL.AI
        </Text>
        <Text className='text-md mt-[16]' style={{ color: theme === 'dark' ? vars.light3 + vars.opacity70 : vars.grey2 }}>
          Where AI goes to meet humanity
        </Text>

        <View className='w-[408] gap-[20] mt-[40] items-center'>
          <View className='gap-[16]'>
            <View className='gap-[7]'>
              <Text className='text-sm text-[#bec4ca]'>Email *</Text>
              <TextInput className='w-full h-[48] border-[1px] border-[#bec4ca]/40 rounded-[6] px-[8] bg-[#181a1c]' placeholder='Email' />
            </View>
            <Text className='text-dm text-center text-white'>
              By continuing, I agree to the Company's{' '}
              <Pressable>
                <Text className='text-[#1f80ff] cursor-pointer'>Privacy Statement</Text>
              </Pressable>
              and
              <Pressable>
                <Text className='text-[#1f80ff] cursor-pointer'>Terms of Service</Text>
              </Pressable>
            </Text>
          </View>

          <Pressable className='w-full h-[50]'>
            <Text className='w-full h-[50] text-md font-[600] text-center flex items-center justify-center bg-[#860fef] rounded-sm cursor-pointer'>Continue</Text>
          </Pressable>

          <View className='w-full flex-row items-center justify-center'>
            <View className='flex-1 h-[1] bg-[#555f68]'></View>
            <Text className='text-sm text-white px-[10]'>OR</Text>
            <View className='flex-1 h-[1] bg-[#555f68]'></View>
          </View>

          <View className='w-full gap-[6]'>
            <Pressable
              className='w-full h-[46] flex-row items-center justify-center gap-[10] border-[1px] border-purple1 rounded-sm'
              onPress={() => {
                auth.oAuth({ provider: 'google' })
              }}
            >
              <IconGoogle width={24} height={24} />
              <Text className='text-md font-[600] text-purple1'>Continue with Google</Text>
            </Pressable>
            <Pressable
              className='w-full h-[46] flex-row items-center justify-center gap-[10] border-[1px] border-purple1 rounded-sm'
              onPress={() => {
                auth.oAuth({ provider: 'microsoft' })
              }}
            >
              <IconMicrosoft width={24} height={24} />
              <Text className='text-md font-[600] text-purple1'>Continue with Microsoft</Text>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </View>
  )
}
