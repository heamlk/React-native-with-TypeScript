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
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, ActivityIndicator, Dimensions } from 'react-native'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { useAuth } from './context/descope'
import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import { getThemeBackground, getThemeBorder, getThemeColor, Logo, Text, View, Pressable } from './shared/components/reusable'
import themeVars from './styles/theme/themeVars'
import { BlurView } from 'expo-blur'
import IconGoogle from '@/app/assets/icons/google'
import IconMicrosoft from '@/app/assets/icons/microsoft'
import { validateEmail } from './shared/validation'
import ThemeToggle from './shared/components/themeToggle'
import { usePopup } from './context/popup'
import AboutUs from './shared/policy/aboutUs'
import Terms from './shared/policy/terms'
import PrivacyPolicy from './shared/policy/privacyPolicy'
import Cookies from './shared/policy/cookies'
import useDimensions from './hooks/dimensions'
import { LinearGradient } from 'expo-linear-gradient'

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
  const dimentions = useDimensions()
  const { setPopup } = usePopup()

  const styles = StyleSheet.create({
    carouselVideoContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      borderRadius: breakpoints === 'desktop' ? themeVars.borderRadius.md : 0,
    },
    carouselVideoElement: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      right: 0,
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
    <View className='relative flex-1'>
      <View className='tablet:flex-1 base:flex-col tablet:flex-row items-center tablet:justify-center base:gap-[20px] tablet:gap-[0]'>
        {/* Left */}
        <View className='base:w-full tablet:w-[768] base:h-[290px] tablet:h-[576] p-[40] justify-between relative tablet:border-purple2/20 tablet:border-[2px] tablet:rounded-md'>
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
            width={breakpoints === 'desktop' ? 768 : dimentions.deviceWidth}
            height={breakpoints === 'desktop' ? 576 : 290}
            autoPlay={true}
            data={carouselItems}
            autoPlayInterval={9995000}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View className='w-[100%] h-[100%] absolute z-[11] top-[0] left-[0] rounded-md'>
                <Video style={styles.carouselVideoElement} videoStyle={styles.carouselVideoElement} source={item.videoUrl} useNativeControls={false} resizeMode={ResizeMode.COVER} isLooping shouldPlay isMuted />
                <Text className='font-[600] text-light1 absolute bottom-[40] left-[40] pr-[50]' size='2xl'>
                  {item.title}
                </Text>
              </View>
            )}
            style={styles.carouselVideoContainer}
            containerStyle={styles.carouselVideoContainer}
          />
          {/* Carousel - END */}

          <LinearGradient
            colors={['transparent', getThemeBackground({ theme, breakpoints, background: 'primary' })]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              zIndex: 12,
            }}
          />
        </View>
        {/* Left - END */}

        {/* Right */}
        <BlurView tint={'dark'} className='base:w-[calc(100%_-_32px)] tablet:w-[540] max-w-[540] tablet:left-[-50] tablet:mr-[-50] rounded-md'>
          <View className='w-[100%] h-[100%] base:px-[24px] tablet:px-[64] base:py-[56px] tablet:pt-[72] tablet:pb-[64] items-center border-[2px] rounded-md relative' style={{ backgroundColor: getThemeBackground({ theme, breakpoints, background: 'form' }), borderColor: getThemeBorder({ theme, border: 'form' }) }}>
            <Logo width={140} height={27} theme={theme} />
            <Text className='font-[600] mt-[40]' size='xl' color='light1'>
              Welcome to BFFL.AI
            </Text>
            <Text className='mt-[16]' size='md' color='light3'>
              Where AI goes to meet humanity
            </Text>

            {/* Authentication */}
            <View className='gap-[20] mt-[40] items-center'>
              {/* OTP */}
              {otpStage === 0 ? (
                <>
                  <View className='gap-[16]'>
                    <View className='gap-[7]'>
                      <Text className='text-[#bec4ca]' size='sm' color='light3'>
                        Email *
                      </Text>
                      <TextInput
                        className='w-full h-[48] border-[2px] border-[#bec4ca]/40 rounded-[6] px-[8]'
                        style={{
                          ...(emailInputError ? { borderColor: themeVars.colors.red1 } : {}),
                          color: getThemeColor({ theme, color: 'light1' }),
                          backgroundColor: getThemeBackground({ theme, breakpoints, background: 'input' }),
                        }}
                        placeholder='Email'
                        autoComplete='email'
                        value={emailInput}
                        onChangeText={handleOtpEmailTextChange}
                      />
                      {emailInputError ? (
                        <Text className='font-[600] text-red1' size='sm'>
                          {emailInputError}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>

                    <Text className='max-w-[80%] mx-auto text-center' size='sm' color='light1'>
                      By continuing, I agree to the Company's
                      <Pressable>
                        <Text className='text-[#1f80ff] cursor-pointer' size='sm'>
                          {' '}
                          Privacy Statement{' '}
                        </Text>
                      </Pressable>
                      and
                      <Pressable>
                        <Text className='text-[#1f80ff] cursor-pointer' size='sm'>
                          {' '}
                          Terms of Service
                        </Text>
                      </Pressable>
                    </Text>
                  </View>

                  <Pressable className='w-full h-[50]' onPress={handleOtpPress}>
                    <Text className='w-full h-[50] font-[600] text-center flex items-center justify-center rounded-sm cursor-pointer' size='md' color='button' background='button'>
                      Continue
                    </Text>
                  </Pressable>

                  <View className='w-full flex-row items-center justify-center'>
                    <View className='flex-1 h-[1] bg-[#555f68]'></View>
                    <Text className='px-[10]' size='sm' color='light1'>
                      OR
                    </Text>
                    <View className='flex-1 h-[1] bg-[#555f68]'></View>
                  </View>

                  {/* OAuth */}
                  <View className='w-full gap-[6]'>
                    <Pressable
                      background='buttonOutline'
                      border='buttonOutline'
                      className='w-full h-[46] flex-row items-center justify-center gap-[10] border-[1px] rounded-sm'
                      onPress={() => {
                        auth.oAuth({ provider: 'google' })
                      }}
                    >
                      <IconGoogle width={24} height={24} />
                      <Text className='font-[600] text-purple1' size='md' color='buttonOutline'>
                        Continue with Google
                      </Text>
                    </Pressable>
                    <Pressable
                      background='buttonOutline'
                      border='buttonOutline'
                      className='w-full h-[46] flex-row items-center justify-center gap-[10] border-[1px] rounded-sm'
                      onPress={() => {
                        auth.oAuth({ provider: 'microsoft' })
                      }}
                    >
                      <IconMicrosoft width={24} height={24} />
                      <Text className='font-[600]' size='md' color='buttonOutline'>
                        Continue with Microsoft
                      </Text>
                    </Pressable>
                  </View>
                  {/* OAuth - END */}
                </>
              ) : (
                <View className='gap-[16] items-center'>
                  <Text className='text font-[500] text-center' size='xl' color='light1'>
                    We've sent a message containing a 6-digit code to {emailInput}
                  </Text>
                  <Text className='text font-[500] text-center mb-[20px]' size='lg' color='light1'>
                    Enter Code
                  </Text>
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
                  {otpError ? (
                    <Text className='font-[600] text-red1' size='sm'>
                      {otpError}
                    </Text>
                  ) : (
                    <></>
                  )}
                  <Pressable onPress={handleOtpPress}>
                    <Text className='font-[600] text-purple1' size='sm'>
                      Send Again
                    </Text>
                  </Pressable>
                  <Pressable onPress={handleGoBack}>
                    <Text className='font-[600] text-purple1' size='sm'>
                      Choose another authentication method
                    </Text>
                  </Pressable>
                </View>
              )}
              {/* OTP - END */}
            </View>
          </View>
          {/* Authentication - END */}
        </BlurView>
        {/* Right - END */}
      </View>

      {/* Footer */}
      <View className='w-[100%] tablet:absolute tablet:left-[0] tablet:bottom-[0] base:flex-col tablet:flex-row items-center justify-center flex-row gap-[32] py-[40px]'>
        <ThemeToggle />

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'about' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='light3'>
            About Us
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'terms' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='light3'>
            Terms of Service
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'privacy' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='light3'>
            Privacy Policy
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'cookies' })
          }}
        >
          <Text className='cursor-pointer' size='md' style={theme === 'light' ? { color: themeVars.colors.grey2 } : { color: themeVars.colors.light3 }}>
            Cookies Policy
          </Text>
        </Pressable>
      </View>
      {/* Footer - END */}
    </View>
  )
}
