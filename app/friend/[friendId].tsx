import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { GradientPressable, Pressable, Text, TextInput, View } from '../_shared/components/reusable'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, ScrollView } from 'react-native'
import { useUser } from '../_context/user'
import useBreakpoints from '../_hooks/breakpoints'
import useDimensions from '../_hooks/dimensions'
import IconSettings from '@/app/_assets/icons/settings.svg'
import IconAnimationToggle from '@/app/_assets/icons/animations-toggle.svg'
import IconNsfwToggle from '@/app/_assets/icons/nsfw-toggle.svg'
import IconClean from '@/app/_assets/icons/clean.svg'
import IconChecked from '@/app/_assets/icons/check-circle.svg'
import IconLeft from '@/app/_assets/icons/iconLeft'
import IconTrash from '@/app/_assets/icons/trash.svg'
import IconClose from '@/app/_assets/icons/close'
import IconMessage from '@/app/_assets/icons/message'
import IconMedia from '@/app/_assets/icons/mediaIcon.svg'
import themeVars from '../_styles/theme/themeVars'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../_context/theme'
import { ResizeMode, Video } from 'expo-av'
import { useApi } from '../_context/api'
import { usePopup } from '../_context/popup'
import Soul from '../_shared/components/Soul'
import VoiceToText from '../_shared/components/voiceToText'
import type { ImageMedia } from '../_context/auth.types'
import { BlurView } from 'expo-blur'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { resizeToFitScreen, scaleToFit } from '../_lib/utils'

export default function User() {
  const { theme } = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId
  const { user, updateUser, companionIsTyping } = useUser()
  const breakpoints = useBreakpoints()
  const dimentions = useDimensions()
  const api = useApi()
  const { setPopup } = usePopup()

  const videoRef = useRef<Video | null>(null)
  const viewRef = useRef<ScrollView | null>(null)
  const carouselRef = useRef<ICarouselInstance>(null)
  const carouselSmallRef = useRef<ICarouselInstance>(null)

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 48 - 30

  const [friend, setFriend] = useState(user?.companions?.find((obj) => obj?.id === friendId))
  const [carouselData, setCarouselData] = useState({
    open: false,
    defaultIndex: 0,
  })
  const [allowUser, setAllowUser] = useState(false)
  const [fetchingMedia, setFetchingMedia] = useState(false)
  const [fetchingMediaAnimation, setFetchingMediaAnimation] = useState(false)
  const [deletingMedia, setDeletingMedia] = useState(false)
  const [clearingChat, setClearingChat] = useState(false)
  const [updatingNsfwStatus, setUpdatingNsfwStatus] = useState(false)
  const [updatingEmotionsStatus, setUpdatingEmotionsStatus] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  const [activeVideo, setActiveVideo] = useState(friend?.emotions_animations?.urls?.blink || null)
  const [nextVideo, setNextVideo] = useState<string | null>(null)

  const [emotionEnabled, setEmotionEnabled] = useState(friend?.emotions_animations?.enabled || false)
  const [nsfwEnabled, setNsfwEnabled] = useState(user?.profile?.nsfw_disabled_since === null)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<
    {
      content: string
      created_at: string
      role: 'customer' | 'companion'
      type: 'text' | 'image' | 'error'
    }[]
  >([])
  const [conversationMedia, setConversationMedia] = useState<ImageMedia[]>([])
  const [mediaBlurOpen, setMediaBlurOpen] = useState(false)

  const blinkVideoUrl = friend?.emotions_animations?.urls?.blink
  const smileVideoUrl = friend?.emotions_animations?.urls?.smile
  const friendBackgroundUrl = friend?.profile_picture?.image

  const updateConversationHistory = async () => {
    try {
      const req = await api.getConversationsHistory({ companionId: friend?.id || '' })
      const data = req?.data

      if (data?.status === 'OK') {
        setMessages(data?.conversation)
        return data?.conversation
      }

      return []
    } catch (error) {
      console.warn(error)
    }
  }

  const handleEdit = () => {
    router.push(`/friend/edit/${friend?.id}`)
  }

  const handleNsfwToggle = async () => {
    if (updatingNsfwStatus) {
      return
    }

    try {
      setUpdatingNsfwStatus(true)
      const req = await api.postUpdateNsfwSettings({ nsfw_status: !nsfwEnabled })
      const data = req?.data

      setNsfwEnabled(!nsfwEnabled)
      setUpdatingNsfwStatus(false)

      if (data === 'OK') {
        await updateUser()
      }
    } catch (error) {
      setUpdatingNsfwStatus(false)
      console.warn(error)
    }
  }

  const handleAnimationToggle = async () => {
    if (updatingEmotionsStatus) {
      return
    }

    try {
      setUpdatingEmotionsStatus(true)
      const req = await api.postUpdateAnimationStatue({ companionId: friend?.id || '', enabled: !emotionEnabled })
      const data = req?.data

      setEmotionEnabled(!emotionEnabled)
      setUpdatingEmotionsStatus(false)

      if (data === 'OK') {
        await updateUser()
      }
    } catch (error) {
      setUpdatingEmotionsStatus(false)
      console.warn(error)
    }
  }

  const handleClear = async () => {
    if (clearingChat) {
      return
    }

    try {
      setPopup({ open: false })
      setClearingChat(true)
      const req = await api.postClearChat({ companionId: friend?.id || '' })
      const data = req?.data
      setClearingChat(false)

      if (data === 'OK') {
        await updateConversationHistory()
        await updateUser()
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const handleClearClick = () => {
    if (clearingChat) {
      return
    }

    setPopup({
      open: true,
      maxWidth: 600,
      content: (
        <View className='gap-[24px]'>
          <Text className='text-[24px] font-[600]' color='grey1_light1'>
            Clear chat
          </Text>
          <Text className='' size='md' color='grey1_light1'>
            Are you sure you want to clear the chat?
          </Text>
          <View className='flex-row gap-[16px]'>
            <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={handleClear}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Cancel
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  const handleSendMessage = async () => {
    if (sendingMessage || !messageInput) {
      return
    }

    const message = messageInput
    const newMessages: any = [
      ...messages,
      {
        content: message,
        created_at: new Date().toString(),
        role: 'customer',
        type: 'text',
      },
    ]

    setMessageInput('')
    setMessages(newMessages)

    try {
      setSendingMessage(true)
      const req = await api.postSendMessage({ companionId: friend?.id || '', message: message })
      const data = req?.data
      let errorMessage = ''
      setSendingMessage(false)

      if (data === 'INAPPROPRIATE_MESSAGE') {
        errorMessage = 'Message rejected due to inappropriate content'
      } else if (data === 'CUSTOMER_AGE_NOT_VERIFIED') {
        errorMessage = 'Please verify your age before sending NSFW messages'
      } else if (data === 'MISSING_NSFW_SUBSCRIPTION_OPTION') {
        errorMessage = 'Message rejected due to missing NSFW subscription option'
      } else if (data === 'NSFW_DISABLED') {
        errorMessage = 'Message rejected due to NSFW being disabled'
      } else if (data !== 'OK') {
        errorMessage = 'Error while sending message'
      }

      if (errorMessage) {
        setMessages([
          ...newMessages,
          {
            content: errorMessage,
            created_at: new Date().toString(),
            role: 'customer',
            type: 'error',
          },
        ])
      }
    } catch (error) {
      setSendingMessage(false)
      console.warn(error)
    }
  }

  const updateMedia = async () => {
    if (fetchingMedia) {
      return
    }

    try {
      setFetchingMedia(true)
      const req = await api.getConversationMedia({ companionId: friend?.id || '' })
      const data = req?.data
      setFetchingMedia(false)

      if (data?.status === 'OK') {
        setConversationMedia(data?.images)
      }
    } catch (error) {
      setFetchingMedia(false)
      console.warn(error)
    }
  }

  const handleBlurOpen = ({ index }: { index: number }) => {
    setCarouselData({ open: true, defaultIndex: index })
  }

  const handleBlurClose = () => {
    setCarouselData({ open: false, defaultIndex: 0 })
  }

  const handleCarouselDelete = async ({ mediaId }: { mediaId: string }) => {
    if (deletingMedia) {
      return
    }

    try {
      setDeletingMedia(true)
      const req = await api.deleteConversationMedia({ companionId: friend?.id || '', mediaId })
      const data = req?.data
      setDeletingMedia(false)

      if (data === 'OK') {
        updateMedia()
        setPopup({ open: false })
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const handleCarouselDeleteClick = async ({ mediaId }: { mediaId: string }) => {
    setPopup({
      open: true,
      maxWidth: 600,
      content: (
        <View className='gap-[24px]'>
          <Text className='text-[24px] font-[600]' color='grey1_light1'>
            Delete image
          </Text>
          <Text className='' size='md' color='grey1_light1'>
            Are you sure you want to delete this image?
          </Text>
          <View className='flex-row gap-[16px]'>
            <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={() => handleCarouselDelete({ mediaId })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Cancel
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  const reduceByLimit = ({ number, limit }: { number: number; limit: number }) => {
    if (limit === 0) return number
    return number % limit
  }

  const handleGenerateCompanionAnimation = async ({ mediaId }: { mediaId: string }) => {
    if (fetchingMediaAnimation) {
      return
    }

    const mediaObject = conversationMedia?.find((obj) => obj?.id === mediaId)

    if (mediaObject?.animation_generation_status !== null) {
      return
    }

    try {
      setFetchingMediaAnimation(true)
      const req = await api.postGenerateCompanionMediaAnimation({ companionId: friend?.id || '', mediaId: mediaId })
      const data = req?.data
      setFetchingMediaAnimation(false)

      if (data === 'OK') {
        await updateUser()
        await updateMedia()
      }
    } catch (error) {
      setFetchingMediaAnimation(false)
      console.warn(error)
    }
  }

  const handleMediaBlurOpen = () => {
    setMediaBlurOpen(true)
  }

  const handleMediaBlurClose = () => {
    setMediaBlurOpen(false)
  }

  const handleCompanionEmotionEvent = async ({ companion_id, emotion }: { companion_id: string; emotion: string }) => {
    if (companion_id !== friend?.id) {
      return
    }

    if (emotion === 'blink') {
      setNextVideo(() => blinkVideoUrl ?? '')
    } else if (emotion === 'smile') {
      setNextVideo(() => smileVideoUrl ?? '')
    }
  }

  const handleCompanionMediaUpdate = async ({ companion_id, images }: { companion_id: string; images: any[] }) => {
    updateMedia()
  }

  useEffect(() => {
    if (!friendId) {
      router.push('/profile')
      return
    }

    if (!user?.companions || user?.companions?.length === 0) {
      router.push('/profile')
      return
    }

    updateMedia()
    updateUser()
    setAllowUser(true)
  }, [])

  useEffect(() => {
    updateConversationHistory()

    api.socketState?.on('companion_emotion', (event) => {
      handleCompanionEmotionEvent(event)
    })
    api.socketState?.on('companion_media_update', (event) => {
      handleCompanionMediaUpdate(event)
    })

    return () => {
      api.socketState?.off('companion_emotion')
      api.socketState?.off('companion_media_update')
    }
  }, [])

  useEffect(() => {
    viewRef?.current?.scrollToEnd({ animated: true })
  }, [messages, companionIsTyping])

  useEffect(() => {
    if (!companionIsTyping?.is_typing) {
      updateConversationHistory()
    }
  }, [companionIsTyping])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout keepSafePaddingOnMobile={false} disableRelative={true} mainZIndex={carouselData?.open || mediaBlurOpen ? 10 : 0}>
      {/* Blur background */}
      {carouselData?.open ? (
        <View className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[100]'>
          <BlurView className='w-[100%] h-[100%] items-center justify-center' style={{ backgroundColor: theme === 'light' ? themeVars.colors.white + themeVars.colors.opacity60 : themeVars.colors.dark2 + themeVars.colors.opacity60 }} intensity={20}>
            {/* Carousel */}
            {conversationMedia ? (
              <Carousel
                ref={carouselRef}
                loop
                width={breakpoints === 'desktop' ? 1172 : dimentions?.deviceWidth}
                height={breakpoints === 'desktop' ? 768 : dimentions?.deviceHeight}
                autoPlay={true}
                data={conversationMedia}
                defaultIndex={carouselData?.defaultIndex}
                autoPlayInterval={9995000}
                scrollAnimationDuration={1000}
                onSnapToItem={(event) =>
                  setCarouselData({
                    open: true,
                    defaultIndex: reduceByLimit({ number: event, limit: conversationMedia?.length }),
                  })
                }
                renderItem={({ item, index }) => {
                  const [size, setSize] = useState([121, 81])

                  Image.getSize(
                    item?.image,
                    (width, height) => {
                      const { width: newWidth, height: newHeight } = scaleToFit({ width, height, targetWidth: 1172, targetHeight: 768 })
                      const qwd = resizeToFitScreen({ imgWidth: newWidth, imgHeight: newHeight, screenWidth: dimentions.deviceWidth, screenHeight: dimentions.deviceHeight })
                      setSize(breakpoints === 'desktop' ? [newWidth, newHeight] : [qwd.width, qwd.height])
                    },
                    (error) => {
                      console.warn('Failed to get image size:', error)
                    }
                  )

                  return (
                    <>
                      {item?.animation_url ? (
                        <Video key={item?.created_at.toLocaleString() + index} source={{ uri: item?.animation_url }} resizeMode={ResizeMode.COVER} shouldPlay isLooping={true} isMuted useNativeControls={false} videoStyle={{ width: size[0], height: size[1] }} style={{ width: size[0], height: size[1], margin: 'auto' }} />
                      ) : (
                        <Image key={item?.created_at.toLocaleString() + index} source={{ uri: item?.image }} style={{ width: size[0], height: size[1], margin: 'auto' }} />
                      )}
                    </>
                  )
                }}
              />
            ) : (
              <></>
            )}

            {/* Carousel - END */}

            {/* Controls */}
            <View className='flex-row gap-[20px] absolute bottom-[40px] justify-center'>
              <Pressable
                className='w-[60px] h-[60px] items-center justify-center rounded-[9999] pr-[10px]'
                background='black/50_dark1'
                onPress={() => {
                  carouselRef.current?.prev()
                  setCarouselData({
                    open: true,
                    defaultIndex: reduceByLimit({ number: Number(carouselRef.current?.getCurrentIndex()), limit: conversationMedia?.length }),
                  })
                }}
              >
                <IconLeft width={35} height={35} theme={theme} />
              </Pressable>
              <Pressable
                className='w-[60px] h-[60px] items-center justify-center rounded-[9999] pr-[4px]'
                background='black/50_dark1'
                style={{ transform: [{ rotate: '180deg' }] }}
                onPress={() => {
                  carouselRef.current?.next()
                  setCarouselData({
                    open: true,
                    defaultIndex: reduceByLimit({ number: Number(carouselRef.current?.getCurrentIndex()), limit: conversationMedia?.length }),
                  })
                }}
              >
                <IconLeft width={35} height={35} theme={theme} />
              </Pressable>
              <Pressable
                className='w-[60px] h-[60px] items-center justify-center rounded-[9999]'
                background='black/50_dark1'
                onPress={() => {
                  handleCarouselDeleteClick({ mediaId: conversationMedia?.[carouselData?.defaultIndex]?.id })
                }}
              >
                <IconTrash width={35} height={35} />
              </Pressable>
              {conversationMedia?.[carouselData?.defaultIndex]?.animation_generation_status !== 'done' ? (
                <Pressable className='w-[60px] h-[60px] items-center justify-center rounded-[9999]' background='black/50_dark1' onPress={() => handleGenerateCompanionAnimation({ mediaId: conversationMedia?.[carouselData?.defaultIndex]?.id })}>
                  {conversationMedia?.[carouselData?.defaultIndex]?.animation_generation_status === null ? (
                    <>
                      <IconAnimationToggle />
                      <Text className='font-[600]' size='xs' color='grey6_light1'>
                        {user?.profile?.animation_generation_quota}
                      </Text>
                    </>
                  ) : (
                    <ActivityIndicator size='large' color={themeVars.colors.purple1} />
                  )}
                </Pressable>
              ) : (
                <></>
              )}
            </View>
            {/* Controls - END */}

            {/* Close button */}
            <Pressable className='w-[60px] h-[60px] absolute top-[40px] right-[40px] items-center justify-center rounded-[9999]' background='black/50_dark1' onPress={handleBlurClose}>
              <IconClose width={35} height={35} color={themeVars.colors.purple1} />
            </Pressable>
            {/* Close button - END */}
          </BlurView>
        </View>
      ) : (
        <></>
      )}
      {/* Blur background - END */}

      {/* Media blur */}
      {mediaBlurOpen ? (
        <View className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[99]'>
          <View className='w-[100%] h-[100%] items-center' background='grey6_dark7'>
            <Pressable className='w-[48px] h-[48px] mt-[16px] ml-auto mr-[24px] rounded-[20px] items-center justify-center' background='dark2/60' onPress={handleMediaBlurClose}>
              <IconClose width={28} height={28} color='white' />
            </Pressable>

            <View className='w-[100%] gap-[12px] px-[40px] mt-[30px]'>
              <View className='flex-row items-center justify-between'>
                <Text className='font-[600]' size='sm' color='grey1_light2'>
                  Shared images
                </Text>
                <View className='flex-row items-center gap-[16px]'>
                  <Pressable onPress={() => carouselSmallRef?.current?.prev()}>
                    <IconLeft theme={theme} />
                  </Pressable>
                  <Pressable style={{ transform: [{ rotate: '180deg' }] }} onPress={() => carouselSmallRef?.current?.next()}>
                    <IconLeft theme={theme} />
                  </Pressable>
                </View>
              </View>

              <Carousel
                ref={carouselSmallRef}
                loop={true}
                width={131}
                height={81}
                snapEnabled={true}
                pagingEnabled={true}
                autoPlayInterval={2000}
                data={conversationMedia}
                style={{ width: '100%' }}
                renderItem={({ item, index }) => (
                  <Pressable className='w-[121px] h-[81px] border-[1px] rounded-[12px] overflow-hidden' border='grey3_dark3' onPress={() => handleBlurOpen({ index })}>
                    <Image source={{ uri: item?.thumbnail }} style={{ width: 121, height: 81 }} />
                  </Pressable>
                )}
              />
            </View>
          </View>
        </View>
      ) : (
        <></>
      )}

      {/* Media blur - END */}

      <View className='base:flex-col phone:flex-row base:rounded-[0px] phone:rounded-lg' style={{ width: containerWidth, height: containerHeight }} background='grey6_dark1'>
        {/* Character */}
        <View className='base:p-[0] phone:p-[16px] gap-[40px]' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth } : breakpoints === 'tablet' ? { width: 300 } : { width: 664 }}>
          <View className='base:rounded-t-[0px] phone:rounded-t-md relative overflow-hidden relative' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }}>
            {emotionEnabled && friend?.emotions_animations?.enabled && activeVideo != null ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: activeVideo }}
                  posterSource={{ uri: friendBackgroundUrl }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={true}
                  isLooping={false}
                  isMuted
                  useNativeControls={false}
                  videoStyle={{
                    ...(breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 270, height: 440 } : { width: 634, height: 440 }),
                  }}
                  style={{
                    ...(breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 270, height: 440 } : { width: 634, height: 440 }),
                    zIndex: 11,
                    position: 'absolute',
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.isLoaded && status.didJustFinish) {
                      if (activeVideo === nextVideo) {
                        videoRef?.current?.playAsync()
                      } else {
                        if (nextVideo === blinkVideoUrl) {
                          setActiveVideo(blinkVideoUrl)
                          setNextVideo(blinkVideoUrl)
                        } else if (nextVideo === smileVideoUrl) {
                          setActiveVideo(smileVideoUrl)
                          setNextVideo(blinkVideoUrl ?? '')
                        }
                        videoRef?.current?.playAsync()
                      }
                    }
                  }}
                />
                <Image source={{ uri: friendBackgroundUrl }} className='base:rounded-t-[0px] phone:rounded-t-md absolute z-[10]' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }} />
              </>
            ) : (
              <Image source={{ uri: friendBackgroundUrl }} className='base:rounded-t-[0px] phone:rounded-t-md' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }} />
            )}

            <LinearGradient className='flex-1 h-[100px] absolute bottom-[0px] left-[0px] z-[100]' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ width: dimentions.deviceWidth }} />

            {/* Settings */}
            {breakpoints !== 'phone' ? (
              <Pressable className='w-[40px] h-[40px] absolute z-[999] top-[24px] right-[24px] rounded-[9999px] items-center justify-center pt-[3px] pr-[1px]' background='grey6/40_dark6/40' onPress={handleEdit}>
                <IconSettings />
              </Pressable>
            ) : (
              <></>
            )}
            {/* Settings - END */}

            {breakpoints === 'phone' && conversationMedia?.length > 0 ? (
              <Pressable className='w-[48px] h-[48px] absolute top-[16px] right-[24px] rounded-[20px] items-center justify-center' background='grey6/40_dark6/40' onPress={handleMediaBlurOpen}>
                <IconMedia />
              </Pressable>
            ) : (
              <></>
            )}

            <View className='w-[100%] h-[40px] overflow-visible flex-row items-center justify-between absolute bottom-[24px] left-[0px] z-[101] px-[24px]'>
              <View className='gap-[10px] flex-row items-center'>
                <Text className='text-[24px] font-[600]' color='grey1_light2'>
                  {friend?.name}
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
                {user?.profile?.is_age_verified ? (
                  <Pressable className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' background='black/50_dark1' onPress={handleNsfwToggle}>
                    {nsfwEnabled ? (
                      <>
                        <IconNsfwToggle />
                        <View className='border-[2px] rounded-[999px] absolute bottom-[-2px] right-[-2px]' border='transparent_dark1'>
                          <IconChecked className='rounded-[999px]' />
                        </View>
                      </>
                    ) : (
                      <View className='opacity-[0.4]'>
                        <IconNsfwToggle />
                      </View>
                    )}
                  </Pressable>
                ) : (
                  <></>
                )}

                <Pressable className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' background='black/50_dark1' onPress={handleAnimationToggle}>
                  {emotionEnabled ? (
                    <>
                      <IconAnimationToggle />
                      <View className='border-[2px] rounded-[999px] absolute bottom-[-2px] right-[-2px]' border='transparent_dark1'>
                        <IconChecked className='rounded-[999px]' />
                      </View>
                    </>
                  ) : (
                    <View className='opacity-[0.4]'>
                      <IconAnimationToggle />
                    </View>
                  )}
                </Pressable>

                <Pressable className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' background='black/50_dark1' onPress={handleClearClick}>
                  <IconClean />
                </Pressable>
              </View>
            </View>
          </View>
          {breakpoints !== 'phone' ? (
            <View className='flex-1 gap-[12px] px-[40px]'>
              <View className='flex-row items-center justify-between'>
                <Text className='font-[600]' size='sm' color='grey1_light2'>
                  Shared images
                </Text>
                <View className='flex-row items-center gap-[16px]'>
                  <Pressable onPress={() => carouselSmallRef?.current?.prev()}>
                    <IconLeft theme={theme} />
                  </Pressable>
                  <Pressable style={{ transform: [{ rotate: '180deg' }] }} onPress={() => carouselSmallRef?.current?.next()}>
                    <IconLeft theme={theme} />
                  </Pressable>
                </View>
              </View>

              <Carousel
                ref={carouselSmallRef}
                loop={true}
                width={131}
                height={81}
                snapEnabled={true}
                pagingEnabled={true}
                autoPlayInterval={2000}
                data={conversationMedia}
                style={{ width: '100%' }}
                renderItem={({ item, index }) => (
                  <Pressable className='w-[121px] h-[81px] border-[1px] rounded-[12px] overflow-hidden' border='grey3_dark3' onPress={() => handleBlurOpen({ index })}>
                    <Image source={{ uri: item?.thumbnail }} style={{ width: 121, height: 81 }} />
                  </Pressable>
                )}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
        {/* Character - END */}

        {/* Divider */}
        {breakpoints !== 'phone' ? <View className='w-[1px]' background='grey5_dark2' style={{ height: containerHeight }}></View> : <></>}
        {/* Divider - END */}

        {/* Chat container */}
        <View className='flex-1 px-[16px] base:py-[24px] phone:py-[32px]'>
          <View className='flex-1'>
            {/* Chat area */}
            <ScrollView ref={viewRef} className='w-[100%] max-w-[640px] mx-auto flex-1 mb-[16px] overflow-y-auto scrollbar-hide' contentContainerClassName='gap-[16px]'>
              <View className='w-[100%] max-w-[496px] rounded-[16px] px-[20px] py-[12px] mx-auto mb-[16px]' background='grey5_dark2'>
                <Text className='font-[500] text-center' size='md' color='grey2_light3'>
                  Please keep in mind that all of the interactions are fictional. Do not take actual advice you see in this chat.
                </Text>
              </View>

              {messages?.map((message, messageIndex) => {
                if (message?.role === 'companion' && message?.type === 'text') {
                  return (
                    <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center'>
                      <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px] mb-auto' />
                      <GradientPressable combinedClassname='flex-[unset] min-h-[32px] h-[unset] px-[10px] py-[6px] items-center justify-center' gradientClassname='rounded-[16px]' type='primary' isPressable={false}>
                        <Text className='font-[500] flex-1' size='md' color='light1'>
                          {message?.content}
                        </Text>
                      </GradientPressable>
                    </View>
                  )
                } else if (message?.role === 'companion' && message?.type === 'image') {
                  return (
                    <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center'>
                      <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px] mb-auto' />
                      <Image style={{ width: 200, height: 150, borderRadius: 16 }} source={{ uri: message?.content }} />
                    </View>
                  )
                } else if (message?.role === 'customer' && message?.type === 'error') {
                  return (
                    <Text key={message?.content + messageIndex} className='font-[500] text-end' size='md' color='red1'>
                      {message?.content}
                    </Text>
                  )
                }

                return (
                  <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center justify-end'>
                    <View className='h-[44px] px-[20px] items-center justify-center rounded-[16px]' background='light1_dark2'>
                      <Text className='font-[500]' size='md' color='grey1_light1'>
                        {message?.content}
                      </Text>
                    </View>
                  </View>
                )
              })}

              {companionIsTyping?.is_typing ? (
                <View className='gap-[16px] flex-row items-center'>
                  <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                  <Soul width={44} height={44} soulSize={44} />
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
          </View>

          {/* Input */}
          <View className='w-[100%] max-w-[640px] h-[60px] flex-row border-[1px] rounded-[31px] mx-auto relative' border='grey5_dark3' background='grey5_dark2'>
            <TextInput className='h-[60px] flex-1 text-[16px] pl-[24px] pr-[12px]' color='grey1_light1' placeholder='Type a message…' value={messageInput} onChangeText={(event) => setMessageInput(event)} onSubmitEditing={handleSendMessage} returnKeyType='send' />
            <View className='h-[60px] flex-row items-center gap-[10px] pr-[24px]'>
              <VoiceToText
                onChange={(text) => {
                  setMessageInput((prev) => ' ' + prev + text)
                }}
              />

              <Pressable className='' onPress={handleSendMessage}>
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
