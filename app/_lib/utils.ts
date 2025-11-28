import { Audio } from 'expo-av'
import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system'

const soundResolvers = new WeakMap<Audio.Sound, (value: boolean) => void>()

export function capitalize({ value }: { value: string }) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getRandomNumber({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function scaleToFit({ width, height, targetWidth, targetHeight }: { width: number; height: number; targetWidth: number; targetHeight: number }) {
  const aspectRatio = width / height

  let newWidth = targetWidth
  let newHeight = newWidth / aspectRatio

  if (newHeight > targetHeight) {
    newHeight = targetHeight
    newWidth = newHeight * aspectRatio
  }

  return { width: newWidth, height: newHeight }
}

export function resizeToFitScreen({ imgWidth, imgHeight, screenWidth, screenHeight }: { imgWidth: number; imgHeight: number; screenWidth: number; screenHeight: number }) {
  let newWidth = screenWidth
  let newHeight = imgHeight * (screenWidth / imgWidth)

  if (newHeight > screenHeight) {
    newHeight = screenHeight
    newWidth = imgWidth * (screenHeight / imgHeight)
  }

  return { width: newWidth, height: newHeight }
}

export const encodeArrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
  const uint8 = new Uint8Array(arrayBuffer)
  let binary = ''
  const chunkSize = 0x8000

  for (let i = 0; i < uint8.length; i += chunkSize) {
    binary += String.fromCharCode(...uint8.subarray(i, i + chunkSize))
  }

  return btoa(binary)
}

export async function blobToFile(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const activeSounds: Audio.Sound[] = []

export async function playArrayBuffer(arrayBuffer: ArrayBuffer) {
  try {
    let uri: string

    if (Platform.OS === 'web') {
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
      uri = URL.createObjectURL(blob)
    } else {
      const filename = `temp-audio-${Date.now()}.mp3` // ← FIX: unique file
      const file = new File(Paths.cache, filename)
      await file.create({ overwrite: true })

      const uint8Array = new Uint8Array(arrayBuffer)
      await file.write(uint8Array)
      uri = file.uri
    }

    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true })

    activeSounds.push(sound)

    return new Promise((resolve) => {
      soundResolvers.set(sound, resolve)

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          cleanupSound(sound)
          await safeUnload(sound)

          if (Platform.OS === 'web') URL.revokeObjectURL(uri)

          resolve(true)
        }
      })
    })
  } catch (error) {
    console.error('Error playing sound:', error)
    throw error
  }
}

async function safeUnload(sound: Audio.Sound) {
  try {
    await sound.unloadAsync()
  } catch {}
}

function cleanupSound(sound: Audio.Sound) {
  const i = activeSounds.indexOf(sound)
  if (i !== -1) activeSounds.splice(i, 1)
}

export async function stopAllAudio() {
  for (const sound of [...activeSounds]) {
    try {
      const resolve = soundResolvers.get(sound)
      if (resolve) {
        resolve(true)
        soundResolvers.delete(sound)
      }

      await sound.stopAsync()
      await sound.unloadAsync()
    } catch {}

    cleanupSound(sound)
  }

  await new Promise((res) => setTimeout(res, 50))
}

export default function blank() {}
