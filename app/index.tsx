import IconArrow from '@/app/_assets/icons/arrow-white-right.svg'
import VideoCarousel1 from '@/app/_assets/media/carousel1.mp4'
import VideoCarousel2 from '@/app/_assets/media/carousel2.mp4'
import VideoCarousel3 from '@/app/_assets/media/carousel3.mp4'
import VideoCarousel4 from '@/app/_assets/media/carousel4.mp4'
import VideoCarousel5 from '@/app/_assets/media/carousel5.mp4'
import VideoCarousel6 from '@/app/_assets/media/carousel6.mp4'
import VideoCarousel7 from '@/app/_assets/media/carousel7.mp4'
import VideoCarousel8 from '@/app/_assets/media/carousel8.mp4'
import VideoCarousel9 from '@/app/_assets/media/carousel9.mp4'
import { ResizeMode, Video } from 'expo-av'
import { useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, ActivityIndicator } from 'react-native'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { useAuth } from './_context/auth'
import { useTheme } from './_context/theme'
import useBreakpoints from './_hooks/breakpoints'
import { getThemeBackground, getThemeBorder, getThemeColor, Logo, Text, View, Pressable } from './_shared/components/reusable'
import themeVars from './_styles/theme/themeVars'
import { BlurView } from 'expo-blur'
import IconGoogle from '@/app/_assets/icons/google'
import IconMicrosoft from '@/app/_assets/icons/microsoft'
import { validateEmail } from './_shared/validation'
import ThemeToggle from './_shared/components/themeToggle'
import { usePopup } from './_context/popup'
import AboutUs from './_shared/policy/aboutUs'
import Terms from './_shared/policy/terms'
import PrivacyPolicy from './_shared/policy/privacyPolicy'
import Cookies from './_shared/policy/cookies'
import useDimensions from './_hooks/dimensions'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from './_context/user'
import { Redirect } from 'expo-router'

export type HomeCarouselItemType = {
  videoUrl: string
  posterUrl: string
  title: string
}

export type CarouselItemsType = {
  videoUrl: any
  title: string
}[]

export default function IndexPage() {
  const { user } = useUser()

  if (user) {
    if (user?.companions?.length > 0) {
      return <Redirect href={`/friend/${user?.companions?.[0]?.id}`} />
    } else {
      return <Redirect href={`/friend`} />
    }
  }

  return <LoginPage />
}

export function LoginPage() {
  const insets = useSafeAreaInsets()
  const carouselRef = useRef<ICarouselInstance>(null)
  const { theme } = useTheme()
  const auth = useAuth()
  const breakpoints = useBreakpoints()
  const dimentions = useDimensions()
  const { setPopup } = usePopup()

  const [emailInput, setEmailInput] = useState('')
  const [emailInputError, setEmailInputError] = useState('')
  const [otpEmailFetching, setOtpEmailFetching] = useState(false)
  const [oAuthFetching, setOAuthFetching] = useState(false)

  const numInputs = 6
  const [otpStage, setOtpStage] = useState(0)
  const [otpCode, setOtpCode] = useState(Array(numInputs).fill(''))
  const [otpFetching, setOtpFetching] = useState(false)
  const [otpError, setOtpError] = useState('')
  const inputsRef = useRef<(TextInput | null)[]>([])

  const carouselItems: CarouselItemsType = [
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

  const videoSizeStyle = {
    ...(breakpoints === 'desktop'
      ? {
          width: 768,
          height: 572,
        }
      : {
          width: dimentions.deviceWidth,
          height: 290,
        }),
  }

  const borderRadiusStyle = {
    ...(breakpoints === 'desktop'
      ? {
          borderRadius: themeVars.borderRadius.md,
        }
      : {
          borderRadius: 0,
        }),
  }

  return (
    <View className='relative flex-1' style={{ paddingBottom: insets.bottom + 25 }}>
      <View className='tablet:flex-1 base:flex-col tablet:flex-row items-center tablet:justify-center base:gap-[20px] tablet:gap-[0px]'>
        {/* Left */}
        <View className='base:w-full tablet:w-[768px] base:h-[290px] tablet:h-[576px] justify-between relative tablet:border-purple2/20 tablet:border-[2px] tablet:rounded-md'>
          {/* Carousel controls */}
          <View className='w-[144px] flex-row gap-[16px] absolute top-[40px] left-[40px] z-[50]'>
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
            autoPlayInterval={5000}
            scrollAnimationDuration={1000}
            renderItem={({ item, index }) => {
              return (
                <View
                  className='relative z-[11] top-[0] left-[0] rounded-md'
                  style={{
                    ...videoSizeStyle,
                  }}
                >
                  <Video
                    source={item.videoUrl}
                    style={{
                      ...videoSizeStyle,
                      ...borderRadiusStyle,
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                    }}
                    videoStyle={{
                      ...videoSizeStyle,
                      ...borderRadiusStyle,
                    }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    isMuted
                  />
                  <Text className='font-[600] text-light1 absolute z-[12] bottom-[40px] left-[40px] pr-[50px]' size='2xl'>
                    {item.title}
                  </Text>
                </View>
              )
            }}
            containerStyle={{
              ...videoSizeStyle,
              ...borderRadiusStyle,
              overflow: 'hidden',
              position: 'absolute',
              left: 0,
              right: 0,
            }}
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
        <BlurView
          key={theme}
          tint={theme === 'light' ? 'light' : 'dark'}
          intensity={theme === 'light' ? 80 : 100}
          className='max-w-[540px] tablet:left-[-50px] tablet:mr-[-50px] rounded-md overflow-hidden'
          style={{
            ...(breakpoints === 'phone' ? { width: dimentions.deviceWidth - 32 } : { width: 540 }),
          }}
        >
          <View className='base:px-[24px] tablet:px-[64px] base:py-[56px] tablet:pt-[72px] tablet:pb-[64px] items-center border-[2px] rounded-md relative' style={{ backgroundColor: getThemeBackground({ theme, breakpoints, background: 'grey6_transparent' }), borderColor: getThemeBorder({ theme, border: 'form' }) }}>
            <Logo width={140} height={27} theme={theme} />
            <Text className='font-[600] mt-[40px]' size='xl' color='grey1_light1'>
              Welcome to BFFL.AI
            </Text>
            <Text className='mt-[16px]' size='md' color='grey2_light3'>
              Where AI goes to meet humanity
            </Text>

            {/* Authentication */}
            <View className='gap-[20px] mt-[40px] self-stretch'>
              {/* OTP */}
              {otpStage === 0 ? (
                <>
                  <View className='gap-[16px] self-stretch'>
                    <View className='gap-[7px] self-stretch'>
                      <Text className='text-[#bec4ca]' size='sm' color='grey2_light3'>
                        Email *
                      </Text>
                      <TextInput
                        className='w-full h-[48px] border-[2px] border-[#bec4ca]/40 rounded-[6] px-[8]'
                        style={{
                          ...(emailInputError ? { borderColor: themeVars.colors.red1 } : {}),
                          color: getThemeColor({ theme, color: 'grey1_light1' }),
                          backgroundColor: getThemeBackground({ theme, breakpoints, background: 'input' }),
                        }}
                        placeholder='Email'
                        placeholderTextColor={getThemeColor({ theme, color: 'grey1_light1' })}
                        autoComplete='email'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        value={emailInput}
                        onChangeText={handleOtpEmailTextChange}
                        onSubmitEditing={handleOtpPress}
                        returnKeyType='send'
                        autoCorrect={false}
                      />
                      {emailInputError ? (
                        <Text className='font-[600] text-red1' size='sm'>
                          {emailInputError}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>

                    <View className='max-w-[85%] mx-auto'>
                      <Text className='text-center' size='sm' color='grey1_light1'>
                        By continuing, I agree to the Company's{' '}
                        <Text className='text-[#1f80ff] underline' style={{ textDecorationLine: 'underline' }} onPress={() => handleFooterPopup({ target: 'privacy' })}>
                          Privacy Statement
                        </Text>
                        {' and '}
                        <Text className='text-[#1f80ff] underline' style={{ textDecorationLine: 'underline' }} onPress={() => handleFooterPopup({ target: 'terms' })}>
                          Terms of Service
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <Pressable className='h-[50px] self-stretch items-center justify-center rounded-sm' background='button' onPress={handleOtpPress}>
                    {otpEmailFetching ? (
                      <ActivityIndicator size='small' color={getThemeColor({ theme, color: 'button' })} />
                    ) : (
                      <Text className='font-[600] text-center flex items-center justify-center cursor-pointer' size='md' color='button'>
                        Continue
                      </Text>
                    )}
                  </Pressable>

                  <View className='w-full flex-row items-center justify-center'>
                    <View className='flex-1 h-[1px] bg-[#555f68]'></View>
                    <Text className='px-[10]' size='sm' color='grey1_light1'>
                      OR
                    </Text>
                    <View className='flex-1 h-[1px] bg-[#555f68]'></View>
                  </View>

                  {/* OAuth */}
                  <View className='w-full gap-[6]'>
                    <Pressable
                      background='buttonOutline'
                      border='buttonOutline'
                      className='w-full h-[46px] flex-row items-center justify-center gap-[10px] border-[1px] rounded-sm'
                      onPress={async () => {
                        setOAuthFetching(true)
                        await auth.oAuth({ provider: 'google' })
                        setOAuthFetching(false)
                      }}
                    >
                      {oAuthFetching ? (
                        <ActivityIndicator size='small' color={getThemeColor({ theme, color: 'buttonOutline' })} />
                      ) : (
                        <>
                          <IconGoogle width={24} height={24} />
                          <Text className='font-[600] text-purple1' size='md' color='buttonOutline'>
                            Continue with Google
                          </Text>
                        </>
                      )}
                    </Pressable>
                    <Pressable
                      background='buttonOutline'
                      border='buttonOutline'
                      className='w-full h-[46px] flex-row items-center justify-center gap-[10px] border-[1px] rounded-sm'
                      onPress={async () => {
                        setOAuthFetching(true)
                        await auth.oAuth({ provider: 'microsoft' })
                        setOAuthFetching(false)
                      }}
                    >
                      {oAuthFetching ? (
                        <ActivityIndicator size='small' color={getThemeColor({ theme, color: 'buttonOutline' })} />
                      ) : (
                        <>
                          <IconMicrosoft width={24} height={24} />
                          <Text className='font-[600]' size='md' color='buttonOutline'>
                            Continue with Microsoft
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                  {/* OAuth - END */}
                </>
              ) : (
                <View className='gap-[16px] items-center'>
                  <Text className='text font-[500] text-center' size='xl' color='grey1_light1'>
                    We've sent a message containing a 6-digit code to {emailInput}
                  </Text>
                  <Text className='text font-[500] text-center mb-[20px]' size='lg' color='grey1_light1'>
                    Enter Code
                  </Text>
                  <View className='w-fit flex-row items-center justify-center gap-[4px] relative'>
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
      <View className='w-[100%] tablet:absolute tablet:left-[0px] tablet:bottom-[0px] base:flex-col tablet:flex-row items-center justify-center flex-row gap-[32px] py-[40px]'>
        <ThemeToggle />

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'about' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='grey2_light3'>
            About Us
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'terms' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='grey2_light3'>
            Terms of Service
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFooterPopup({ target: 'privacy' })
          }}
        >
          <Text className='cursor-pointer' size='md' color='grey2_light3'>
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
