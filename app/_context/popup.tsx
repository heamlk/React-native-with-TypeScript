import { Dispatch, JSX, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { BlurView } from 'expo-blur'
import IconClose from '@/app/_assets/icons/close'
import { Pressable, View } from '../_shared/components/reusable'
import { useTheme } from './theme'
import themeVars from '../_styles/theme/themeVars'

export type PopupType = {
  open: boolean
  maxWidth?: number
  content?: JSX.Element
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
    maxWidth: 800,
    content: <></>,
  })

  const Popup = () => {
    return (
      <BlurView className='w-full h-full absolute z-[9999999] top-[0px] left-[0px] items-center justify-center p-[30px]' style={{ display: popup.open ? 'flex' : 'none' }}>
        <View className='base:w-[100%] h-fit max-h-full border-[1px] border-dark3 rounded-lg p-[32px] relative' background='grey6_dark6' style={{ maxWidth: popup?.maxWidth || 800 }}>
          <Pressable
            className='absolute right-[20px] top-[20px]'
            onPress={() => {
              setPopup((prev) => ({ ...prev, open: false }))
            }}
          >
            <IconClose width={24} height={24} color={theme === 'light' ? themeVars.colors.black : themeVars.colors.white} />
          </Pressable>
          <View className='w-full h-fit max-h-full overflow-y-auto'>{popup?.content || <></>}</View>
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
