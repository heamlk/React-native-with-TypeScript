import * as Linking from 'expo-linking'
import { Dispatch, JSX, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import IconClose from '@/app/_assets/icons/close'
import { getThemeColor, Pressable, View } from '../_shared/components/reusable'
import { useTheme } from './theme'
import themeVars from '../_styles/theme/themeVars'

export type PopupType = {
  open: boolean
  content: JSX.Element
}

export type PopupContextType = {
  popup: PopupType
  setPopup: Dispatch<SetStateAction<PopupType>>
}
export type PopupProviderProps = { children: ReactNode }

const PopupContext = createContext<PopupContextType | null>(null)

export default function PopupProvider({ children }: PopupProviderProps) {
  const { theme } = useTheme()

  const [popup, setPopup] = useState<PopupType>({
    open: false,
    content: <></>,
  })

  const Popup = () => {
    return (
      <BlurView className='w-full h-full fixed z-[9999999] top-[0] left-[0] items-center justify-center p-[30]' style={popup.open ? { display: 'flex' } : { display: 'none' }}>
        <View className='base:w-[100%] tablet:w-[800px] h-fit max-h-full border-[1px] border-dark3 rounded-lg p-[50] relative' background='grey6_dark6'>
          <Pressable
            className='absolute right-[20] top-[20]'
            onPress={() => {
              setPopup((prev) => ({ ...prev, open: false }))
            }}
          >
            <IconClose width={24} height={24} color={theme === 'light' ? themeVars.colors.black : themeVars.colors.white} />
          </Pressable>
          <View className='w-full h-fit max-h-full overflow-y-auto'>{popup?.content}</View>
        </View>
      </BlurView>
    )
  }

  const value = { popup, setPopup }

  return (
    <PopupContext.Provider value={value}>
      <Popup />
      {children}
    </PopupContext.Provider>
  )
}

export const usePopup = () => {
  const context = useContext(PopupContext)
  if (!context) throw new Error("usePopup can't be null")
  return context
}
