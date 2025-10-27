// hooks/useSounds.ts
import { useEffect, useRef } from 'react'
import { Audio } from 'expo-av'

type SoundMap = {
  [key: string]: number
}

export const useSounds = () => {
  const sounds = useRef<Record<string, Audio.Sound | null>>({})

  const soundFiles: SoundMap = {
    click: require('@/app/_assets/sounds/click.mp3'),
    error: require('@/app/_assets/sounds/error.mp3'),
    newMessage: require('@/app/_assets/sounds/new-message.mp3'),
    newImage: require('@/app/_assets/sounds/new-image.mp3'),
  }

  useEffect(() => {
    let isMounted = true

    const loadSounds = async () => {
      for (const [key, file] of Object.entries(soundFiles)) {
        try {
          const { sound } = await Audio.Sound.createAsync(file)
          if (isMounted) sounds.current[key] = sound
        } catch (err) {
          console.warn(`Failed to load sound "${key}"`, err)
        }
      }
    }

    loadSounds()

    return () => {
      isMounted = false
      Object.values(sounds.current).forEach((sound) => {
        if (sound) sound.unloadAsync()
      })
    }
  }, [])

  const playSound = async (key: string) => {
    const sound = sounds.current[key]
    if (!sound) {
      console.warn(`Sound "${key}" not loaded yet`)
      return
    }

    try {
      await sound.replayAsync()
    } catch (err) {
      console.warn(`Error playing sound "${key}"`, err)
    }
  }

  return {
    click: () => playSound('click'),
    error: () => playSound('error'),
    newMessage: () => playSound('newMessage'),
    newImage: () => playSound('newImage'),
  }
}
