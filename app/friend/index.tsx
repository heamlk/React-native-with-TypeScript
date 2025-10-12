import useDimensions from '@/app/_hooks/dimensions'
import { View, Pressable, GradientPressable, getThemeBorder } from '@/app/_shared/components/reusable'
import IconLogo from '@/app/_assets/icons/bfflLogo'
import ThemeToggle from '@/app/_shared/components/themeToggle'

import IconSmiley from '@/app/_assets/icons/smiley.svg'
import IconSmileyFilled from '@/app/_assets/icons/smiley-filled.svg'

import IconPerson from '@/app/_assets/icons/person.svg'
import IconPersonFilled from '@/app/_assets/icons/person-filled.svg'

import IconMarket from '@/app/_assets/icons/market.svg'
import IconMarketFilled from '@/app/_assets/icons/market-filled.svg'
import { usePathname, useRouter } from 'expo-router'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import { useRef, useState } from 'react'
import { Animated } from 'react-native'
import IconMenu from '@/app/_assets/icons/menu.svg'
import { BlurView } from 'expo-blur'

import Step0 from './_modules/step0'
import Step1 from './_modules/step1'
import themeVars from '../_styles/theme/themeVars'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'

export default function FriendPage() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()

  const [blurActive, setBlurActive] = useState(true)

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 34 - 30

  const [step, setStep] = useState(0)

  return (
    <AuthenticatedLayout>
      {step === 0 ? <Step0 containerWidth={containerWidth} containerHeight={containerHeight} setStep={setStep} /> : <></>}
      {/* {step === 1 ? <Step1 blurActive={blurActive} setBlurActive={setBlurActive} /> : <></>} */}
    </AuthenticatedLayout>
  )
}
