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
import { ReactNode, useRef } from 'react'
import { Animated } from 'react-native'
import IconMenu from '@/app/_assets/icons/menu.svg'

export type AuthenticatedLayoutProps = {
  children: ReactNode
  keepMarginsOnMobile?: boolean
  keepSafePaddingOnMobile?: boolean
}

export default function AuthenticatedLayout({ children, keepMarginsOnMobile = false, keepSafePaddingOnMobile = false }: AuthenticatedLayoutProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 34 - 30

  const pages = [
    {
      href: '/friend',
      icon: <IconSmiley />,
      iconSelected: <IconSmileyFilled />,
    },
    {
      href: '/profile',
      icon: <IconPerson />,
      iconSelected: <IconPersonFilled />,
    },
    {
      href: '/market',
      icon: <IconMarket />,
      iconSelected: <IconMarketFilled />,
    },
  ]

  const leftAnim = useRef(new Animated.Value(breakpoints === 'phone' ? -95 : 0)).current

  const closeSidebar = () => {
    Animated.timing(leftAnim, {
      toValue: -95,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const openSidebar = () => {
    Animated.timing(leftAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  return (
    <View className='base:p-[0] phone:p-[30px] relative' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      {/* Blur background */}
      {/* <BlurView className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[999999]' style={{ display: blurActive ? 'flex' : 'none', backgroundColor: theme === 'light' ? themeVars.colors.white + themeVars.colors.opacity60 : themeVars.colors.dark2 + themeVars.colors.opacity60 }} intensity={5}></BlurView> */}
      {/* Blur background - END */}

      <View className='w-[100%] h-[100%]'>
        {/* Header */}
        {breakpoints !== 'phone' ? (
          <View className='w-[100%] flex-row items-center justify-between'>
            <IconLogo width={40} height={34} theme={theme} />
            <ThemeToggle />
          </View>
        ) : (
          <></>
        )}
        {/* Header - END */}

        <View className='h-[100%] flex-1 flex-row'>
          {/* Mobile burger menu */}
          {breakpoints === 'phone' ? (
            <Pressable className='w-[48px] h-[48px] items-center justify-center bg-dark2/60 rounded-[20px] absolute top-[24px] left-[24px] z-[11]' onPress={openSidebar}>
              <IconMenu />
            </Pressable>
          ) : (
            <></>
          )}
          {/* Mobile burger menu - END */}

          {/* Sidebar */}
          <Animated.View style={{ height: '100%', left: leftAnim, top: 0, position: breakpoints === 'phone' ? 'absolute' : 'relative', zIndex: 12 }}>
            <View className='h-[100%] base:p-[20px] phone:p-[0] base:mt-[0px] phone:mt-[30px] gap-[20px] base:rounded-r-md phone:rounded-[0]' background={breakpoints === 'phone' ? 'grey5_dark2' : 'transparent'}>
              {breakpoints === 'phone' ? (
                <>
                  <IconLogo width={40} height={34} theme={theme} />
                  <View className='w-[100%] h-[1px]' style={{ backgroundColor: getThemeBorder({ theme, border: 'grey4_dark4' }) }}></View>
                </>
              ) : (
                <></>
              )}

              {pages.map((page) => {
                const isSelected = pathname.startsWith(page.href)

                return (
                  <GradientPressable
                    key={page.href + 63546}
                    className='w-[48px] max-x-[48px] h-[48px] max-h-[48px] items-center justify-center'
                    gradientClassname='w-[48px] max-x-[48px] h-[48px] max-h-[48px] rounded-[20px]'
                    type={isSelected ? 'primary' : 'extraDark'}
                    onPress={() => {
                      router.navigate(page.href as any)
                    }}
                  >
                    {isSelected ? page?.iconSelected : page?.icon}
                  </GradientPressable>
                )
              })}

              {breakpoints === 'phone' ? (
                <>
                  <View className='w-[100%] h-[1px]' style={{ backgroundColor: getThemeBorder({ theme, border: 'grey4_dark4' }) }}></View>
                  <ThemeToggle />
                </>
              ) : (
                <></>
              )}
            </View>
          </Animated.View>
          {/* Sidebar - END */}

          {/* Main */}
          <Pressable
            className='flex-1 base:ml-[0px] phone:ml-[30px] base:mt-[0px] phone:mt-[30px] base:rounded-[0px] phone:rounded-lg relative cursor-default'
            style={{ cursor: 'auto', width: containerWidth, height: containerHeight, marginTop: keepMarginsOnMobile && breakpoints === 'phone' ? 30 + 34 + 30 : breakpoints === 'phone' ? 0 : 30, paddingHorizontal: keepSafePaddingOnMobile && breakpoints === 'phone' ? 24 : 0 }}
            onPress={() => {
              if (breakpoints === 'phone') {
                closeSidebar()
              }
            }}
          >
            {children}
          </Pressable>
          {/* Main - END */}
        </View>
      </View>
    </View>
  )
}
