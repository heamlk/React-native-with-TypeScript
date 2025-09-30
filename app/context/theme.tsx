import React, { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import storage from '../shared/storage/storage'
export type ThemeType = 'light' | 'dark'
export type ThemeContextType = {
  theme: ThemeType
  setTheme: Dispatch<SetStateAction<ThemeType>>
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultTheme = 'dark'
  const [theme, setTheme] = useState<ThemeType>((storage.getString('app-theme') as ThemeType) || defaultTheme)

  useEffect(() => {
    storage.set('app-theme', theme)
  }, [theme])

  const value: ThemeContextType = {
    theme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme can't be null")
  return context
}
