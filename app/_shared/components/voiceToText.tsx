// VoiceToText.js
import React, { useState, useEffect } from 'react'
import { Button, Platform, View } from 'react-native'
import { Pressable } from './reusable'
import IconMicrophone from '@/app/_assets/icons/microphone'
import themeVars from '@/app/_styles/theme/themeVars'

export default function VoiceToText({ onChange }: { onChange: (str: string) => void }) {
  const [text, setText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (Platform.OS === 'web') {
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
            setText('')
            onChange(finalTranscript)
          }
          setInterimText(tempInterim)
        }

        setRecognition(recog)
      } else {
        alert('Web Speech API is not supported in this browser.')
      }
    }
  }, [])

  const handleStart = () => {
    setIsRecording(true)
    if (Platform.OS === 'web') {
      ;(recognition as any)?.start()
    }
  }

  const handleStop = () => {
    setIsRecording(false)
    if (Platform.OS === 'web') {
      ;(recognition as any)?.stop()
      setInterimText('')
    }
  }

  return (
    <>
      <Pressable
        onPress={() => {
          isRecording ? handleStop() : handleStart()
        }}
      >
        <View style={{ width: 24, height: 24 }}></View>
        <IconMicrophone style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none' }} width={24} height={24} color={isRecording ? themeVars.colors.purple3 : themeVars.colors.purple5} hoverColor={themeVars.colors.purple3} />
      </Pressable>
    </>
  )
}
