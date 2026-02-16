import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { GradientPressable, Pressable, Text, TextInput, View } from '../_shared/components/reusable'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
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
import IconRefresh from '@/app/_assets/icons/refresh.svg'
import AnimatedRegenIcon from '../_shared/components/animatedRegenIcon'
import themeVars from '../_styles/theme/themeVars'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../_context/theme'
import { ResizeMode, Video } from 'expo-av'
import { useApi } from '../_context/api'
import { usePopup } from '../_context/popup'
import Soul from '../_shared/components/Soul'
import VoiceToText from '../_shared/components/voiceToText'
import type { ImageMedia, CompanionInfos } from '../_context/auth.types'
import { BlurView } from 'expo-blur'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { resizeToFitScreen, scaleToFit } from '../_lib/utils'
import VoiceToTextMobile from '../_shared/components/voiceToTextMobile'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import storage from '../_shared/storage/storage'

export default function FriendIdPage() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
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
  const voiceBase64Ref = useRef('')
  const friendRef = useRef<CompanionInfos | undefined>(undefined)

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 48 - 30

  const [friend, setFriend] = useState(user?.companions?.find((obj) => obj?.id === friendId))
  
  // Keep friendRef in sync with friend state for use in socket handlers
  useEffect(() => {
    friendRef.current = friend
  }, [friend])
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
      media_id?: string
    }[]
  >([])
  const [conversationMedia, setConversationMedia] = useState<ImageMedia[]>([])
  const [mediaBlurOpen, setMediaBlurOpen] = useState(false)
  const [animationContextMenuOpen, setAnimationContextMenuOpen] = useState(false)
  const [regeneratingAnimations, setRegeneratingAnimations] = useState(false)
  const regeneratingAnimationsRef = useRef(false)
  const animationContextMenuPositionRef = useRef<{ x: number; y: number } | null>(null)
  const [cooldownUpdateTrigger, setCooldownUpdateTrigger] = useState(0)

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
      console.warn('updateConversationHistory error: ', error)
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
      console.warn('handleNsfwToggle error: ', error)
    }
  }

  const handleAnimationToggle = async () => {
    if (updatingEmotionsStatus) {
      return
    }

    // Close context menu if open
    setAnimationContextMenuOpen(false)

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
      console.warn('handleAnimationToggle error: ', error)
    }
  }

  const canRerunAnimations = () => {
    if (!friend?.id) return false
    
    const lastRerunKey = `animation_rerun_${friend.id}`
    const lastRerunTimestamp = storage.getString(lastRerunKey)
    
    if (!lastRerunTimestamp) return true
    
    const oneHourInMs = 60 * 60 * 1000 // 1 hour
    const timeSinceLastRerun = Date.now() - parseInt(lastRerunTimestamp)
    
    return timeSinceLastRerun >= oneHourInMs
  }

  const getRerunCooldownRemaining = () => {
    if (!friend?.id) return 0
    
    const lastRerunKey = `animation_rerun_${friend.id}`
    const lastRerunTimestamp = storage.getString(lastRerunKey)
    
    if (!lastRerunTimestamp) return 0
    
    const oneHourInMs = 60 * 60 * 1000 // 1 hour
    const timeSinceLastRerun = Date.now() - parseInt(lastRerunTimestamp)
    const remaining = oneHourInMs - timeSinceLastRerun
    
    return Math.max(0, Math.ceil(remaining / 1000 / 60)) // Return minutes remaining
  }

  const handleRerunAnimations = async () => {
    if (!friend?.id || regeneratingAnimations || !canRerunAnimations()) {
      return
    }

    try {
      setRegeneratingAnimations(true)
      regeneratingAnimationsRef.current = true
      // Keep menu open to show loading state
      
      // Determine which animation is currently playing
      let currentEmotion: string | undefined = undefined
      if (activeVideo === blinkVideoUrl) {
        currentEmotion = 'blink'
      } else if (activeVideo === smileVideoUrl) {
        currentEmotion = 'smile'
      }
      
      // Only proceed if we can determine the current emotion
      if (!currentEmotion) {
        console.warn('Could not determine current animation emotion, aborting regeneration')
        setRegeneratingAnimations(false)
        regeneratingAnimationsRef.current = false
        setAnimationContextMenuOpen(false)
        return
      }
      
      // Call the endpoint to regenerate only the current animation
      await api.generateCompanionEmotionsAnimations({ 
        companionId: friend.id,
        emotion: currentEmotion 
      })
      
      // Store timestamp for rate limiting
      const lastRerunKey = `animation_rerun_${friend.id}`
      storage.set(lastRerunKey, Date.now().toString())
      
      // Don't close menu or reset loading state here - wait for socket event
      // The companion_update event will be received via socket and update the UI
    } catch (error) {
      console.error('handleRerunAnimations error: ', error)
      setRegeneratingAnimations(false)
      regeneratingAnimationsRef.current = false
      setAnimationContextMenuOpen(false)
      // TODO: Show user-friendly error message
    }
    // Don't reset regeneratingAnimations in finally - wait for socket update
  }

  const handleAnimationContextMenu = (event?: any) => {
    // Only show menu if animations are enabled
    if (!emotionEnabled || !friend?.emotions_animations?.enabled) {
      return
    }

    if (Platform.OS === 'web' && event) {
      // Prevent default context menu
      if (event.preventDefault) {
        event.preventDefault()
      }
    }
    
    setAnimationContextMenuOpen(true)
  }

  const handleCloseContextMenu = () => {
    setAnimationContextMenuOpen(false)
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
      console.warn('handleClear error: ', error)
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
            <GradientPressable className='w-[120px] h-[48px]' type='dark' onPress={handleClear}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable className='w-[120px] h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Cancel
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  const handleSendMessage = async (event?: any) => {
    if (sendingMessage) {
      return
    }

    if (voiceBase64Ref.current) {
      try {
        const base64 = voiceBase64Ref.current
        voiceBase64Ref.current = ''
        const req = await api.postSendVoiceMessage({ companionId: friend?.id || '', audioBase64: base64 })
        const data = req?.data
        console.log('req: ', req)
        console.log('sending message')

        if (data !== 'OK') {
          console.warn('Failed to send voice message')
        }
      } catch (error) {
        console.warn('send message error: ', error)
      }
    } else if (messageInput) {
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
        const req = await api.postSendMessage({ companionId: friend?.id || '', message: message })
        const data = req?.data
        let errorMessage = ''

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
        console.warn('send message error: ', error)
      }
    }

    event?.target?.focus()
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
      console.warn('updateMedia error: ', error)
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
      console.warn('handleCarouselDelete error: ', error)
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
            <GradientPressable className='w-[120px] h-[48px]' type='dark' onPress={() => handleCarouselDelete({ mediaId })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable className='w-[120px] h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
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
      console.warn('handleGenerateCompanionAnimation error: ', error)
    }
  }

  const handleMediaBlurOpen = () => {
    setMediaBlurOpen(true)
  }

  const handleMediaBlurClose = () => {
    setMediaBlurOpen(false)
  }

  const handleCompanionEmotionEvent = async ({ companion_id, emotion }: { companion_id: string; emotion: string }) => {
    const currentFriend = friendRef.current
    if (companion_id !== currentFriend?.id) {
      return
    }

    // Get the latest video URLs from the current friend state
    const blinkUrl = currentFriend?.emotions_animations?.urls?.blink
    const smileUrl = currentFriend?.emotions_animations?.urls?.smile

    if (emotion === 'blink') {
      setNextVideo(() => blinkUrl ?? '')
    } else if (emotion === 'smile') {
      setNextVideo(() => smileUrl ?? '')
    }
  }

  const handleCompanionMediaUpdate = async ({ companion_id, images }: { companion_id: string; images: any[] }) => {
    updateMedia()
  }

  const handleCompanionUpdate = async ({ companion }: { companion: CompanionInfos }) => {
    const currentFriend = friendRef.current
    if (companion?.id !== currentFriend?.id) {
      return
    }

    // Check if we're regenerating (use ref to avoid stale closure)
    const isRegenerating = regeneratingAnimationsRef.current

    // Update the friend state with the new companion data
    setFriend(companion)

    // If emotions_animations URLs are now available, update the active video
    if (companion?.emotions_animations?.urls?.blink || companion?.emotions_animations?.urls?.smile) {
      // Set active video if we don't have one, or if regenerating
      setActiveVideo((current: string | null) => {
        if (!current && companion.emotions_animations?.urls?.blink) {
          return companion.emotions_animations.urls.blink
        }
        // If regenerating, update to the new URL for the current emotion
        if (isRegenerating) {
          const currentEmotion = current === blinkVideoUrl ? 'blink' : current === smileVideoUrl ? 'smile' : null
          if (currentEmotion === 'blink' && companion.emotions_animations?.urls?.blink) {
            return companion.emotions_animations.urls.blink
          } else if (currentEmotion === 'smile' && companion.emotions_animations?.urls?.smile) {
            return companion.emotions_animations.urls.smile
          }
        }
        return current
      })
    }

    // Reset loading state and close menu when update is received
    if (isRegenerating) {
      setRegeneratingAnimations(false)
      regeneratingAnimationsRef.current = false
      setAnimationContextMenuOpen(false)
    }

    // Update emotionEnabled state if emotions_animations enabled status changed
    if (companion?.emotions_animations?.enabled !== undefined) {
      setEmotionEnabled(companion.emotions_animations.enabled)
    }
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
    api.getPingCompanion({ companionId: friend?.id || '' })

    api.socketState?.on('companion_emotion', (event) => {
      handleCompanionEmotionEvent(event)
    })
    api.socketState?.on('companion_media_update', (event) => {
      handleCompanionMediaUpdate(event)
    })
    api.socketState?.on('companion_update', (event) => {
      handleCompanionUpdate(event)
    })

    return () => {
      api.socketState?.off('companion_emotion')
      api.socketState?.off('companion_media_update')
      api.socketState?.off('companion_update')
    }
  }, [])

  // Update cooldown timer every minute when on cooldown
  useEffect(() => {
    if (!canRerunAnimations() && animationContextMenuOpen) {
      const interval = setInterval(() => {
        // Force re-render to update cooldown display
        setCooldownUpdateTrigger((prev) => prev + 1)
      }, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [friend?.id, animationContextMenuOpen, cooldownUpdateTrigger])

  // Close context menu when clicking outside
  useEffect(() => {
    if (!animationContextMenuOpen) return

    const handleClickOutside = () => {
      setAnimationContextMenuOpen(false)
    }

    // Use setTimeout to avoid immediate closure
    const timeoutId = setTimeout(() => {
      if (Platform.OS === 'web') {
        document.addEventListener('click', handleClickOutside)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (Platform.OS === 'web') {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [animationContextMenuOpen])

  useEffect(() => {
    viewRef?.current?.scrollToEnd({ animated: true })
  }, [messages, companionIsTyping])

  useEffect(() => {
    if (!companionIsTyping?.is_typing) {
      updateConversationHistory()
    }
  }, [companionIsTyping])

  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (messages.length === 0 && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        updateConversationHistory()
      }, 1500)
    }

    if (messages.length > 0 && intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [messages])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout keepSafePaddingOnMobile={false} disableRelative={true} mainZIndex={carouselData?.open || mediaBlurOpen ? 10 : 0} hideSidebar={Platform.OS === 'web' ? false : mediaBlurOpen || carouselData?.open}>
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
                        <Video
                          key={item?.created_at.toLocaleString() + index}
                          source={{ uri: item?.animation_url }}
                          resizeMode={ResizeMode.COVER}
                          shouldPlay={true}
                          isLooping={true}
                          isMuted
                          useNativeControls={false}
                          videoStyle={{ width: size[0], height: size[1] }}
                          style={{ width: size[0], height: size[1], margin: 'auto' }}
                        />
                      ) : (
                        <Image key={item?.id + item?.animation_url} source={{ uri: item?.image }} style={{ width: size[0], height: size[1], margin: 'auto' }} />
                      )}
                    </>
                  )
                }}
              />
            ) : null}
            {/* Carousel - END */}

            {/* Controls */}
            <View className='flex-row gap-[20px] absolute justify-center' style={{ bottom: 40 + insets.bottom }}>
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
              ) : null}
            </View>
            {/* Controls - END */}

            {/* Close button */}
            <Pressable className='w-[60px] h-[60px] absolute right-[40px] items-center justify-center rounded-[9999]' style={{ top: 40 + insets.top }} background='black/50_dark1' onPress={handleBlurClose}>
              <IconClose width={35} height={35} color={themeVars.colors.purple1} />
            </Pressable>
            {/* Close button - END */}
          </BlurView>
        </View>
      ) : null}
      {/* Blur background - END */}

      {/* Media blur */}
      {mediaBlurOpen ? (
        <View className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[99]'>
          <View className='w-[100%] h-[100%] items-center' background='grey6_dark7'>
            <Pressable className='w-[48px] h-[48px] ml-auto mr-[24px] rounded-[20px] items-center justify-center' style={{ marginTop: 16 + insets.top }} background='dark2/60' onPress={handleMediaBlurClose}>
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
      ) : null}
      {/* Media blur - END */}

      <View className='base:flex-col phone:flex-row base:rounded-[0px] phone:rounded-lg' style={{ width: containerWidth, height: containerHeight, paddingBottom: insets.bottom }} background='grey6_dark1'>
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
            ) : null}
            {/* Settings - END */}

            {breakpoints === 'phone' && conversationMedia?.length > 0 ? (
              <Pressable className='w-[48px] h-[48px] absolute right-[24px] rounded-[20px] items-center justify-center' background='grey6/40_dark6/40' style={{ top: 16 + insets.top }} onPress={handleMediaBlurOpen}>
                <IconMedia />
              </Pressable>
            ) : null}

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
                ) : null}
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
                ) : null}

                {blinkVideoUrl ? (
                  <View className='relative'>
                    <Pressable 
                      className='w-[40px] h-[40px] rounded-[9999px] items-center justify-center relative' 
                      background='black/50_dark1' 
                      onPress={handleAnimationToggle}
                      onLongPress={handleAnimationContextMenu}
                      {...(Platform.OS === 'web' ? {
                        onContextMenu: handleAnimationContextMenu
                      } : {})}
                    >
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
                    
                    {/* Context Menu */}
                    {animationContextMenuOpen && emotionEnabled && friend?.emotions_animations?.enabled ? (
                      <>
                        {Platform.OS === 'web' ? (
                          <Pressable 
                            className='fixed top-0 left-0 right-0 bottom-0 z-[9999]' 
                            style={{ position: 'fixed', backgroundColor: 'transparent' }}
                            onPress={handleCloseContextMenu}
                          />
                        ) : (
                          <Pressable 
                            className='absolute top-0 left-0 right-0 bottom-0 z-[9999]' 
                            style={{ backgroundColor: 'transparent' }}
                            onPress={handleCloseContextMenu}
                          />
                        )}
                        <View 
                          className='absolute z-[10000] rounded-sm border-[1px] overflow-hidden'
                          background='grey6_dark7' 
                          border='grey5_dark3'
                          style={{
                            bottom: 50,
                            right: 0,
                            shadowColor: theme === 'light' ? '#000' : '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 12,
                            minWidth: 200,
                          }}
                        >
                          <Pressable
                            className='px-[24px] py-[14px] flex-row items-center gap-[12px]'
                            background='transparent'
                            onPress={handleRerunAnimations}
                            disabled={!canRerunAnimations() || regeneratingAnimations}
                          >
                            {regeneratingAnimations ? (
                              <>
                                <View className='items-center justify-center' style={{ width: 20, height: 20 }}>
                                  <ActivityIndicator size='small' color={themeVars.colors.purple1} />
                                </View>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  Regenerating animation...
                                </Text>
                              </>
                            ) : !canRerunAnimations() ? (
                              <>
                                <View className='items-center justify-center' style={{ width: 20, height: 20 }}>
                                  <AnimatedRegenIcon width={18} height={18} isAnimating={false} />
                                </View>
                                <View className='flex-1'>
                                  <Text className='font-[600]' size='md' color='grey1_light1'>
                                    Regen Animation
                                  </Text>
                                  <Text className='font-[400]' size='sm' color='grey2_light3' style={{ marginTop: 2 }}>
                                    {getRerunCooldownRemaining()} minute{getRerunCooldownRemaining() !== 1 ? 's' : ''} cooldown remaining
                                  </Text>
                                </View>
                              </>
                            ) : (
                              <>
                                <View className='items-center justify-center' style={{ width: 20, height: 20 }}>
                                  <AnimatedRegenIcon width={18} height={18} isAnimating={true} />
                                </View>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  Regen Animation
                                </Text>
                              </>
                            )}
                          </Pressable>
                        </View>
                      </>
                    ) : null}
                  </View>
                ) : null}

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
          ) : null}
        </View>
        {/* Character - END */}

        {/* Divider */}
        {breakpoints !== 'phone' ? <View className='w-[1px]' background='grey5_dark2' style={{ height: containerHeight }}></View> : null}
        {/* Divider - END */}

        {/* Chat container */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={-24} style={{ flex: 1 }}>
          <View className='flex-1 px-[16px]' style={{ paddingVertical: breakpoints === 'phone' ? 24 : 32 }}>
            {/* Chat area */}
            <ScrollView ref={viewRef} className='scrollbar-hide'>
              <View className='w-[100%] max-w-[640px] mx-auto gap-[16px]' onStartShouldSetResponder={() => true}>
                <View className='w-[100%] max-w-[496px] rounded-[16px] px-[20px] py-[12px] mx-auto mb-[16px]' background='grey5_dark2'>
                  <Text className='font-[500] text-center' size='md' color='grey2_light3'>
                    Please keep in mind that all of the interactions are fictional. Do not take actual advice you see in this chat.
                  </Text>
                </View>

                {messages?.map((message) => {
                  if (message?.role === 'companion' && message?.type === 'text') {
                    return Platform.OS === 'web' ? (
                      <View key={message?.content + message?.created_at} className='gap-[16px] flex-row'>
                        <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] max-w-[44px] min-h-[44px] min-w-[44px] h-[44px] max-h-[44px] rounded-[9999px] mb-auto flex flex-1' />
                        <View className='flex flex-1'>
                          <GradientPressable combinedClassname='flex-1' containerClassname='mr-auto' className='py-[10px]' gradientClassname='' type='primary' isPressable={false}>
                            <Text className='w-[auto] font-[500] ml-auto self-start shrink flex' size='md' color='light1'>
                              {message?.content}
                            </Text>
                          </GradientPressable>
                        </View>
                      </View>
                    ) : (
                      <View key={message?.content + message?.created_at} className='flex flex-1 gap-[16px] flex-row'>
                        <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] max-w-[44px] min-h-[44px] min-w-[44px] h-[44px] max-h-[44px] rounded-[9999px] mb-auto flex flex-1' />
                        <View className='flex flex-1'>
                          <GradientPressable combinedClassname='flex-1' containerClassname='mr-auto' className='py-[10px]' gradientClassname='' type='primary' isPressable={false}>
                            <Text className='w-[auto] font-[500] ml-auto self-start shrink flex' size='md' color='light1'>
                              {message?.content}
                            </Text>
                          </GradientPressable>
                        </View>
                      </View>
                    )
                  } else if (message?.role === 'companion' && message?.type === 'image') {
                    return (
                      <View key={message?.content + message?.created_at} className='gap-[16px] flex-row items-center'>
                        <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px] mb-auto' />
                        <Pressable
                          onPress={() => {
                            handleBlurOpen({ index: [...conversationMedia]?.findIndex((obj) => obj?.id === message?.media_id) })
                          }}
                        >
                          <Image source={{ uri: message?.content + `?cache=${message?.created_at}` }} style={{ width: 200, height: 150, borderRadius: 16 }} />
                        </Pressable>
                      </View>
                    )
                  } else if (message?.role === 'customer' && message?.type === 'error') {
                    return (
                      <Text key={message?.content + message?.created_at} className='font-[500] text-end' size='md' color='red1'>
                        {message?.content}
                      </Text>
                    )
                  }

                  return (
                    <View key={message?.content + message?.created_at} className='gap-[16px] ml-auto'>
                      <View className=' px-[20px] py-[10px] rounded-[16px]' background='light1_dark2'>
                        <Text className='font-[500]' size='md' color='grey1_light1'>
                          {message?.content}
                        </Text>
                      </View>
                    </View>
                  )
                })}

                {(companionIsTyping?.is_typing && companionIsTyping?.companion_id === friend?.id) || messages?.length === 0 ? (
                  <View className='gap-[16px] flex-row'>
                    <Image source={{ uri: friend?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                    <View className='w-[44px] h-[44px]'>
                      <Soul width={44} height={44} soulSize={44} />
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>

            {/* Input */}
            <View className='w-[100%] max-w-[640px] h-[60px] flex-row border-[1px] rounded-[31px] mx-auto mt-[24px] relative overflow-hidden' border='grey5_dark3' background='grey5_dark2'>
              <TextInput className='text-[16px] flex-1 px-[24px] text-base' placeholder='Type a message…' color='grey1_light3' placeholderColor='grey1_light3' value={messageInput} onChangeText={setMessageInput} onSubmitEditing={handleSendMessage} returnKeyType='send' autoCorrect={true} autoFocus={true} />

              <View className='h-full flex-row items-center gap-[12px] pr-[20px]'>
                {Platform.OS === 'web' ? (
                  <VoiceToText
                    onChange={(event) => {
                      voiceBase64Ref.current = event?.audioBase64 || ''
                      handleSendMessage()
                    }}
                  />
                ) : (
                  <VoiceToTextMobile
                    onChange={(event) => {
                      voiceBase64Ref.current = event?.audioBase64 || ''
                      handleSendMessage()
                    }}
                  />
                )}

                <Pressable onPress={handleSendMessage} className='p-2'>
                  <IconMessage width={30} height={30} color={themeVars.colors.purple1} />
                </Pressable>
              </View>
            </View>
            {/* Input - END */}
          </View>
        </KeyboardAvoidingView>
        {/* Chat container - END */}
      </View>
    </AuthenticatedLayout>
  )
}
