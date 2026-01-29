import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { Pressable } from 'react-native'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import Tooltip from 'react-native-walkthrough-tooltip'
import IconMicrophoneNew from '@/app/_assets/icons/ChatAudio.svg'
import themeVars from '@/app/_styles/theme/themeVars'
import { Text } from './reusable'
import { File } from 'expo-file-system'
import { stopAllAudio } from '@/app/_lib/utils'

type Props = {
  onChange: (data: { text: string; audioBase64: string | null }) => void
}

export type VoiceToTextRef = {
  start: () => Promise<void>
  stop: () => Promise<void>
  isRecording: boolean
}

const VoiceToText = forwardRef<VoiceToTextRef, Props>(({ onChange }, ref) => {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTooltipOpen, setVoiceTooltipOpen] = useState(false)
  const recordingRef = useRef<Audio.Recording | null>(null)

  const transcribeAudio = async (base64Wav: string): Promise<string> => {
    return ''
  }

  async function handleStart() {
    try {
      const permission = await Audio.requestPermissionsAsync()
      if (permission.status !== 'granted') {
        console.warn('Microphone permission not granted')
        return
      }

      stopAllAudio()

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      })

      console.log('Started recording')
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      recordingRef.current = recording
      setIsRecording(true)
    } catch (err) {
      console.log('Error recording: ', err)
      setIsRecording(false)
    }
  }

  const handleStop = async () => {
    if (!recordingRef.current) return

    setIsRecording(false)

    try {
      await recordingRef.current.stopAndUnloadAsync()
      const uri = recordingRef.current.getURI()
      if (!uri) return

      const file = new File(uri)
      const base64 = await file.base64()

      const transcript = await transcribeAudio(base64)

      onChange({
        text: transcript ?? '',
        audioBase64: base64,
      })
    } catch (err) {
      console.error('Stop recording error:', err)
    } finally {
      recordingRef.current = null
    }
  }

  useImperativeHandle(ref, () => ({
    start: handleStart,
    stop: handleStop,
    isRecording,
  }))

  return (
    <Tooltip isVisible={voiceTooltipOpen} content={<Text>Enable / Disable voice chat</Text>} backgroundColor='transparent'>
      <Pressable
        onPress={() => {
          if (isRecording) handleStop()
          else handleStart()
          setVoiceTooltipOpen(false)
        }}
        onLongPress={() => setVoiceTooltipOpen(true)}
        onPressOut={() => setVoiceTooltipOpen(false)}
      >
        <IconMicrophoneNew fill={isRecording ? themeVars.colors.purple3 : themeVars.colors.purple5} width={40} height={40} />
      </Pressable>
    </Tooltip>
  )
})

export default VoiceToText
