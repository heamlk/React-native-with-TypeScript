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
import { useRef, useState } from 'react'
import { NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TextInputKeyPressEventData, View, ActivityIndicator } from 'react-native'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { useAuth } from './context/descope'
import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import { Text } from './shared/components/reusable'
import themeVars from './styles/theme/themeVars'
import { BlurView } from 'expo-blur'
import IconLogo from '@/app/assets/icons/logo'
import IconGoogle from '@/app/assets/icons/google'
import IconMicrosoft from '@/app/assets/icons/microsoft'
import { validateEmail } from './shared/validation'
import ThemeToggle from './shared/components/themeToggle'
import { usePopup } from './context/popup'

import AboutUs from './shared/policy/aboutUs'
import Terms from './shared/policy/terms'
import PrivacyPolicy from './shared/policy/privacyPolicy'
import Cookies from './shared/policy/cookies'

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
  const { setPopup } = usePopup()

  const styles = StyleSheet.create({
    carouselVideoContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      borderRadius: themeVars.borderRadius.md,
    },
    carouselVideoElement: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
  })

  const [emailInput, setEmailInput] = useState('')
  const [emailInputError, setEmailInputError] = useState('')
  const [otpEmailFetching, setOtpEmailFetching] = useState(false)

  const numInputs = 6
  const [otpStage, setOtpStage] = useState(0)
  const [otpCode, setOtpCode] = useState(Array(numInputs).fill(''))
  const [otpFetching, setOtpFetching] = useState(false)
  const [otpError, setOtpError] = useState('')
  const inputsRef = useRef<(TextInput | null)[]>([])

  const handleOtpEmailTextChange = (text: string) => {
    setEmailInput(text)
    const isValid = validateEmail({ email: text })

    if (isValid || text === '') {
      setEmailInputError('')
    }
  }

  const onOtpComplete = async (code: string) => {
    if (otpFetching) {
      return
    }

    setOtpFetching(true)
    const req = await auth.otpVerify({ email: emailInput, code })
    setOtpFetching(false)
    const isSuccessful = req.successful

    if (isSuccessful) {
      setOtpError('')
      setOtpCode(['', '', '', '', '', ''])
      setOtpStage(0)
      console.log('Successful OTP authentication')
    } else {
      const errorMessage = req?.error?.response?.data?.errorDescription || 'Something went wrong'
      setOtpError(errorMessage)
    }
  }

  const handleOtpPress = async () => {
    if (otpEmailFetching) {
      return
    }

    const isValid = validateEmail({ email: emailInput })

    if (!isValid) {
      setEmailInputError('Must be a valid email')
      return
    }

    setOtpEmailFetching(true)
    const req = await auth.otp({ email: emailInput })
    setOtpEmailFetching(false)

    if (req.successful) {
      setOtpStage(1)
    } else {
      const errorMessage = req?.error?.response?.data?.errorDescription || 'Something went wrong'
      setEmailInputError(errorMessage)
    }
  }

  const handleOtpNumberChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      // Only allowing a single number
      const newOtp = [...otpCode]
      newOtp[index] = text
      setOtpCode(newOtp)

      const nextInput = inputsRef.current?.[index + 1]
      if (nextInput) {
        nextInput.focus()
      } else {
        // Triggering onOtpComplete when finished
        onOtpComplete(newOtp.join(''))
      }
    } else if (text === '') {
      // Allow deleting
      const newOtp = [...otpCode]
      newOtp[index] = ''
      setOtpCode(newOtp)
    }
  }

  const handleOtpKeyPress = ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (nativeEvent.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      if (inputsRef.current) {
        inputsRef.current[index - 1]?.focus()
      }
    }
  }

  const handleGoBack = () => {
    setOtpError('')
    setOtpCode(['', '', '', '', '', ''])
    setOtpFetching(false)
    setOtpStage(0)
  }

  const handleFooterPopup = async ({ target }: { target: 'about' | 'terms' | 'privacy' | 'cookies' }) => {
    const targetContent = {
      about: <AboutUs />,
      terms: <Terms />,
      privacy: <PrivacyPolicy />,
      cookies: <Cookies />,
    }

    setPopup({
      open: true,
      content: <View className='w-full h-fit'>{targetContent[target]}</View>,
    })
  }

  return (
    <View className='flex-1 relative'>
      <View className='flex-1 flex-row items-center justify-center'>
        {/* Left */}
        <View className='w-[768] h-[576] p-[40] justify-between relative border-purple2/20 border-[2px] rounded-md'>
          {/* Carousel controls */}
          <View className='w-fit flex-row gap-[16] relative z-[50]'>
            <Pressable className='w-[64] h-[64] items-center justify-center border-light1/40 border-[1px] rounded-[99999] pointer' onPress={() => carouselRef.current?.prev()}>
              <IconArrow style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Pressable className='w-[64] h-[64] items-center justify-center border-light1/40 border-[1px] rounded-[99999] pointer' onPress={() => carouselRef.current?.next()}>
              <IconArrow />
            </Pressable>
          </View>
          {/* Carousel controls - END */}

          {/* Carousel */}
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
              <View className='w-[100%] h-[100%] absolute z-[11] top-[0] left-[0] rounded-md'>
                <Video style={styles.carouselVideoElement} videoStyle={styles.carouselVideoElement} source={item.videoUrl} useNativeControls={false} resizeMode={ResizeMode.COVER} isLooping shouldPlay isMuted />
                <Text className='text-[32px] font-[600] text-white absolute bottom-[40] left-[40] pr-[50]'>{item.title}</Text>
              </View>
            )}
            style={styles.carouselVideoContainer}
            containerStyle={styles.carouselVideoContainer}
          />
          {/* Carousel - END */}
        </View>
        {/* Left - END */}

        {/* Right */}
        <BlurView tint={'dark'} className='w-[540] pt-[72] pb-[64] px-[64] items-center border-[2px] border-purple2/20 rounded-md relative left-[-50] pr-[50]'>
          <IconLogo width={140} height={27} />
          <Text className='text-xl font-[600] mt-[40]' style={{ color: theme === 'dark' ? themeVars.colors.light1 : themeVars.colors.grey1 }}>
            Welcome to BFFL.AI
          </Text>
          <Text className='text-md mt-[16]' style={{ color: theme === 'dark' ? themeVars.colors.light3 + themeVars.colors.opacity70 : themeVars.colors.grey2 }}>
            Where AI goes to meet humanity
          </Text>

          {/* Authentication */}
          <View className='w-[408] gap-[20] mt-[40] items-center'>
            {/* OTP */}
            {otpStage === 0 ? (
              <>
                <View className='gap-[16]'>
                  <View className='gap-[7]'>
                    <Text className='text-sm text-[#bec4ca]'>Email *</Text>
                    <TextInput className='w-full h-[48] border-[2px] border-[#bec4ca]/40 rounded-[6] px-[8] !bg-[#181a1c] !text-[#bec4ca]' style={emailInputError ? { borderColor: themeVars.colors.red1 } : {}} placeholder='Email' autoComplete='email' value={emailInput} onChangeText={handleOtpEmailTextChange} />
                    {emailInputError ? <Text className='text-sm font-[600] text-red1'>{emailInputError}</Text> : <></>}
                  </View>

                  <Text className='text-sm text-center text-white'>
                    By continuing, I agree to the Company's
                    <Pressable>
                      <Text className='text-[#1f80ff] cursor-pointer'> Privacy Statement </Text>
                    </Pressable>
                    and
                    <Pressable>
                      <Text className='text-[#1f80ff] cursor-pointer'> Terms of Service</Text>
                    </Pressable>
                  </Text>
                </View>

                <Pressable className='w-full h-[50]' onPress={handleOtpPress}>
                  <Text className='w-full h-[50] text-md font-[600] text-center flex items-center justify-center bg-[#860fef] rounded-sm cursor-pointer'>Continue</Text>
                </Pressable>

                <View className='w-full flex-row items-center justify-center'>
                  <View className='flex-1 h-[1] bg-[#555f68]'></View>
                  <Text className='text-sm text-white px-[10]'>OR</Text>
                  <View className='flex-1 h-[1] bg-[#555f68]'></View>
                </View>

                {/* OAuth */}
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
                {/* OAuth - END */}
              </>
            ) : (
              <View className='gap-[16] items-center'>
                <Text className='text text-xl text-white font-[500] text-center'>We've sent a message containing a 6-digit code to {emailInput}</Text>
                <Text className='text text-lg text-white font-[500] text-center mb-[20px]'>Enter Code</Text>
                <View className='w-fit flex-row items-center justify-center gap-[4] relative'>
                  {otpCode.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        inputsRef.current[index] = ref
                      }}
                      value={value}
                      onChangeText={(text) => handleOtpNumberChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      className='w-[50px] h-[50px] bg-[#181a1c] border-[1px] border-[#555f68] rounded-sm text-center text-white caret-white focus:outline-none'
                      style={otpFetching ? { opacity: 0.15, pointerEvents: 'none' } : {}}
                      keyboardType='number-pad'
                      maxLength={1}
                      inputMode='numeric'
                    />
                  ))}
                  {otpFetching && <ActivityIndicator className='absolute' size='small' color={themeVars.colors.purple1} />}
                </View>
                {otpError ? <Text className='text-sm font-[600] text-red1'>{otpError}</Text> : <></>}
                <Pressable onPress={handleOtpPress}>
                  <Text className='text-sm font-[600] text-purple1'>Send Again</Text>
                </Pressable>
                <Pressable onPress={handleGoBack}>
                  <Text className='text-sm font-[600] text-purple1'>Choose another authentication method</Text>
                </Pressable>
              </View>
            )}
            {/* OTP - END */}
          </View>
          {/* Authentication - END */}
        </BlurView>
        {/* Right - END */}
      </View>

      {/* Footer */}
      <View className='w-[100%] h-[80px] absolute left-[0] bottom-[0] items-center justify-center flex-row gap-[32]'>
        <ThemeToggle />

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'about' })
          }}
        >
          <Text className='text-md cursor-pointer' style={theme === 'light' ? { color: themeVars.colors.grey2 } : { color: themeVars.colors.light3 }}>
            About Us
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'terms' })
          }}
        >
          <Text className='text-md cursor-pointer' style={theme === 'light' ? { color: themeVars.colors.grey2 } : { color: themeVars.colors.light3 }}>
            Terms of Service
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'privacy' })
          }}
        >
          <Text className='text-md cursor-pointer' style={theme === 'light' ? { color: themeVars.colors.grey2 } : { color: themeVars.colors.light3 }}>
            Privacy Policy
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'cookies' })
          }}
        >
          <Text className='text-md cursor-pointer' style={theme === 'light' ? { color: themeVars.colors.grey2 } : { color: themeVars.colors.light3 }}>
            Cookies Policy
          </Text>
        </Pressable>
      </View>
      {/* Footer - END */}
    </View>
  )
}
