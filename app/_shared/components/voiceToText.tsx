import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Text } from './reusable'
import { Pressable as RNPressable } from 'react-native'
import IconMicrophoneNew from '@/app/_assets/icons/ChatAudio.svg'
import themeVars from '@/app/_styles/theme/themeVars'
import { encodeArrayBufferToBase64, stopAllAudio } from '@/app/_lib/utils'
import audioBufferToWav from 'audiobuffer-to-wav'
import Tooltip from 'react-native-walkthrough-tooltip'

const VoiceToText = forwardRef(({ onChange }: { onChange: (data: { text: string; audioBase64: string | null }) => void }, ref) => {
  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [voiceTooltipOpen, setVoiceTooltipOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const finalTextRef = useRef<string>('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recog = new SpeechRecognition()
      recog.continuous = true
      recog.interimResults = true
      recog.lang = 'en-US'

      recog.onresult = (event: any) => {
        let finalTranscript = ''
        let tempInterim = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            tempInterim += transcript
          }
        }

        if (finalTranscript) {
          finalTextRef.current += finalTranscript.trim() + ' '
          handleStop(true)
          setTimeout(() => handleStart(), 500)
        }
        setInterimText(tempInterim)
      }

      recog.onend = () => {
        // Auto-restart if still recording
        if (isRecording) recog.start()
      }

      recognitionRef.current = recog
    } else {
      alert('Web Speech API is not supported in this browser.')
    }
  }, [])

  const handleStart = async () => {
    setIsRecording(true)
    finalTextRef.current = '' // reset transcript
    audioChunksRef.current = []

    // Start speech recognition
    recognitionRef.current?.start()

    // Start audio recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
  }

  const handleStop = async (returnOnchange?: boolean) => {
    setIsRecording(false)
    recognitionRef.current?.stop()
    setInterimText('')

    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    const stream = mediaRecorder.stream
    stream.getTracks().forEach((track) => track.stop())

    mediaRecorder.stop()
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const arrayBuffer = await blob.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const wav = audioBufferToWav(audioBuffer)
      const base64 = encodeArrayBufferToBase64(wav)

      const finalText = finalTextRef.current.trim()

      if (returnOnchange) {
        onChange({
          text: finalText,
          audioBase64: base64,
        })
      }

      finalTextRef.current = ''
      audioChunksRef.current = []
    }
  }

  useImperativeHandle(ref, () => ({
    start: handleStart,
    stop: handleStop,
    isRecording,
  }))

  return (
    <Tooltip isVisible={voiceTooltipOpen} content={<Text>Enable / Disable voice chat </Text>} backgroundColor='transparent'>
      <RNPressable
        onPress={() => {
          if (isRecording) {
            handleStop(false)
            setVoiceTooltipOpen(false)
          } else {
            handleStart()
            setVoiceTooltipOpen(false)
            stopAllAudio()
          }
        }}
        onHoverIn={() => {
          setVoiceTooltipOpen(true)
        }}
        onHoverOut={() => {
          setVoiceTooltipOpen(false)
        }}
      >
        <IconMicrophoneNew style={{ pointerEvents: 'none' }} fill={isRecording ? themeVars.colors.purple3 : themeVars.colors.purple5} width={40} height={40} />
      </RNPressable>
    </Tooltip>
  )
})

export default VoiceToText
