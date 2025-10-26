import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { GradientPressable, Pressable, Text, TextInput, View } from '../_shared/components/reusable'
import { useEffect, useRef, useState } from 'react'
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
import { ResizeMode, Video } from 'expo-av'
import { useApi } from '../_context/api'
import { usePopup } from '../_context/popup'
import Soul from '../_shared/components/Soul'
import VoiceToText from '../_shared/components/voiceToText'

export default function User() {
  const { theme } = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId
  const { user, setUser, updateUser } = useUser()
  const breakpoints = useBreakpoints()
  const dimentions = useDimensions()
  const api = useApi()
  const { popup, setPopup } = usePopup()

  const videoRef = useRef<Video | null>(null)

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 48 - 30

  const [allowUser, setAllowUser] = useState(false)
  const [companionTyping, setCompanionTyping] = useState(false)

  const [defaultVideo, setDefaultVideo] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [emotionEnabled, setEmotionEnabled] = useState(user?.activeCompanion?.emotions_animations?.enabled || false)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<
    {
      content: string
      created_at: string
      role: 'customer' | 'companion'
      type: 'text' | 'image'
    }[]
  >([])

  const [clearingChat, setClearingChat] = useState(false)
  const [updatingEmotionsStatus, setUpdatingEmotionsStatus] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  const updateConversationHistory = async () => {
    try {
      const req = await api.getConversationsHistory({ companionId: user?.activeCompanion?.id || '' })
      const data = req?.data

      if (data?.status === 'OK') {
        setMessages(data?.conversation)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const handleEdit = () => {
    router.push(`/friend/edit/${user?.activeCompanion?.id}`)
  }

  const handleAnimationToggle = async () => {
    if (updatingEmotionsStatus) {
      return
    }

    try {
      setUpdatingEmotionsStatus(true)
      const req = await api.postUpdateAnimationStatue({ companionId: user?.activeCompanion?.id || '', enabled: !emotionEnabled })
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
      const req = await api.postClearChat({ companionId: user?.activeCompanion?.id || '' })
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

    setMessageInput('')
    setMessages((prev) => [
      ...prev,
      {
        content: message,
        created_at: new Date().toString(),
        role: 'customer',
        type: 'text',
      },
    ])

    try {
      const req = await api.postSendMessage({ companionId: user?.activeCompanion?.id || '', message: message })
      const data = req?.data
    } catch (error) {
      console.warn(error)
    }
  }

  const handleCompanionTypingEvent = async ({ companion_id, is_typing }: { companion_id: string; is_typing: boolean }) => {
    if (companion_id === user?.activeCompanion?.id) {
      if (!is_typing) {
        await updateConversationHistory()
      }

      setCompanionTyping(is_typing)
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

    updateUser()
    setAllowUser(true)
  }, [])

  useEffect(() => {
    const blinkVideoUrl = user?.activeCompanion?.emotions_animations?.urls.blink

    if (defaultVideo !== blinkVideoUrl) {
      setDefaultVideo(() => blinkVideoUrl ?? null)
    }
  }, [user?.activeCompanion, defaultVideo])

  useEffect(() => {
    updateConversationHistory()

    api.socketState?.on('companion_emotion', (event) => {
      console.log('Socket event (companion_emotion): ', event)
    })
    api.socketState?.on('companion_is_typing', (event) => {
      handleCompanionTypingEvent(event)
    })

    return () => {
      api.socketState?.off('companion_emotion')
      api.socketState?.off('companion_is_typing')
    }
  }, [])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout keepSafePaddingOnMobile={false}>
      <View className='base:flex-col phone:flex-row base:rounded-[0px] phone:rounded-lg' style={{ width: containerWidth, height: containerHeight }} background='grey6_dark1'>
        {/* Character */}
        <View className='base:p-[0] phone:p-[16px]' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth } : breakpoints === 'tablet' ? { width: 300 } : { width: 664 }}>
          <View className='base:rounded-t-[0px] phone:rounded-t-md relative overflow-hidden' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }}>
            {emotionEnabled && user?.activeCompanion?.emotions_animations?.enabled && defaultVideo != null ? (
              <Video
                ref={videoRef}
                source={{ uri: defaultVideo || '' }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={isVideoReady}
                isLooping
                isMuted
                useNativeControls={false}
                onLoad={() => setIsVideoReady(true)}
                videoStyle={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }}
                style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }}
              />
            ) : (
              <Image source={{ uri: user?.activeCompanion?.profile_picture?.image }} className='base:rounded-t-[0px] phone:rounded-t-md' style={breakpoints === 'phone' ? { width: dimentions.deviceWidth, height: 240 } : breakpoints === 'tablet' ? { width: 300 - 30, height: 440 } : { width: 664 - 30, height: 440 }} />
            )}

            <LinearGradient className='flex-1 h-[100px] absolute bottom-[0px] left-[0px] z-[100]' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ width: dimentions.deviceWidth }} />

            {/* Settings */}
            {breakpoints !== 'phone' ? (
              <Pressable className='w-[40px] h-[40px] absolute top-[24px] right-[24px] rounded-[9999px] items-center justify-center pt-[3px] pr-[1px]' background='grey6/40_dark6/40' onPress={handleEdit}>
                <IconSettings />
              </Pressable>
            ) : (
              <></>
            )}
            {/* Settings - END */}

            <View className='w-[100%] h-[40px] overflow-visible flex-row items-center justify-between absolute bottom-[24px] left-[0px] z-[101] px-[24px]'>
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
        </View>
        {/* Character - END */}

        {/* Divider */}
        {breakpoints !== 'phone' ? <View className='w-[1px]' background='grey5_dark2' style={{ height: containerHeight }}></View> : <></>}
        {/* Divider - END */}

        {/* Chat container */}
        <View className='flex-1 px-[16px] base:py-[24px] phone:py-[32px]'>
          <View className='flex-1'>
            {/* Chat area */}
            <View className='w-[100%] max-w-[640px] mx-auto flex-1 gap-[16px] mb-[16px] overflow-y-auto scrollbar-hide'>
              <View className='w-[100%] max-w-[496px] rounded-[16px] px-[20px] py-[12px] mx-auto mb-[16px]' background='grey5_dark2'>
                <Text className='font-[500] text-center' size='md' color='grey2_light3'>
                  Please keep in mind that all of the interactions are fictional. Do not take actual advice you see in this chat.
                </Text>
              </View>

              {messages?.map((message, messageIndex) => {
                if (message?.role === 'companion' && message?.type === 'text') {
                  return (
                    <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center'>
                      <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                      <GradientPressable combinedClassname='flex-1 min-h-[44px] h-[unset] px-[10px] py-[6px] items-center justify-center' gradientClassname='rounded-[16px]' type='primary' isPressable={false}>
                        <Text className='font-[500]' size='md' color='light1'>
                          {message?.content}
                        </Text>
                      </GradientPressable>
                    </View>
                  )
                } else if (message?.role === 'companion' && message?.type === 'image') {
                  return (
                    <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center'>
                      <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                      <Image style={{ width: 200, height: 150, borderRadius: 16 }} source={{ uri: message?.content }} />
                    </View>
                  )
                }

                return (
                  <View key={message?.content + messageIndex} className='gap-[16px] flex-row items-center justify-end'>
                    <View className='h-[44px] px-[20px] items-center justify-center rounded-[16px]' background='light1_dark2'>
                      <Text className='font-[500]' size='md' color='light1'>
                        {message?.content}
                      </Text>
                    </View>
                  </View>
                )
              })}

              {companionTyping ? (
                <View className='gap-[16px] flex-row items-center'>
                  <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} className='w-[44px] h-[44px] rounded-[9999px]' />
                  <Soul width={44} height={44} soulSize={44} />
                </View>
              ) : (
                <></>
              )}
            </View>
            {/* Chat area - END */}
          </View>

          {/* Input */}
          <View className='w-[100%] max-w-[640px] h-[60px] flex-row border-[1px] rounded-[31px] mx-auto relative' border='grey5_dark3' background='grey5_dark2'>
            <TextInput className='h-[60px] flex-1 text-[16px] pl-[24px] pr-[12px]' color='grey1_light1' placeholder='Type a message…' value={messageInput} onChangeText={(event) => setMessageInput(event)} onSubmitEditing={handleSendMessage} returnKeyType='send' />
            <View className='h-[60px] flex-row items-center gap-[10px] pr-[24px]'>
              <VoiceToText
                onChange={(text) => {
                  console.log('textL ', text)
                  console.log('messageInput + text ', messageInput + text)
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
