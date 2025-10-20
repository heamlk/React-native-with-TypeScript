import useDimensions from '@/app/_hooks/dimensions'
import { View, Pressable, GradientPressable, getThemeBorder, Text } from '@/app/_shared/components/reusable'
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
import { type ReactNode, useRef } from 'react'
import { Animated, Image } from 'react-native'
import IconMenu from '@/app/_assets/icons/menu.svg'
import { usePopup } from '@/app/_context/popup'
import { useUser } from '@/app/_context/user'

export type AuthenticatedLayoutProps = {
  children: ReactNode
  keepMarginsOnMobile?: boolean
  keepSafePaddingOnMobile?: boolean
  disableRelative?: Boolean
  mainZIndex?: 10 | 0
}

export default function AuthenticatedLayout({ children, keepMarginsOnMobile = false, keepSafePaddingOnMobile = false, disableRelative = false, mainZIndex = 0 }: AuthenticatedLayoutProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const popup = usePopup()
  const { user } = useUser()

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
      href: '/marketplace',
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

  const handleSidebarLinkPress = ({ url }: { url: string }) => {
    if (pathname.includes('/friend/edit')) {
      popup.setPopup({
        open: true,
        maxWidth: 600,
        content: (
          <View className='gap-[24px]'>
            <Text className='text-[24px] font-[600]' color='grey1_light1'>
              Are you sure?
            </Text>
            <Text className='' size='md' color='grey1_light1'>
              You have unsaved changes. Are you sure you want to leave this page?
            </Text>
            <View className='flex-row gap-[16px]'>
              <GradientPressable
                className='w-[150px] h-[48px]'
                type='dark'
                onPress={() => {
                  popup.setPopup({ open: false })
                  router.navigate(url as any)
                }}
              >
                <Text className='font-[600]' size='md' color='grey1_light2'>
                  Ok
                </Text>
              </GradientPressable>
              <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={() => popup.setPopup({ open: false })}>
                <Text className='font-[600]' size='md' color='grey1_light2'>
                  Cancel
                </Text>
              </GradientPressable>
            </View>
          </View>
        ),
      })
      return
    }

    router.navigate(url as any)
  }

  const handleCompanionPress = () => {
    router.push(`/friend/${user?.activeCompanion?.id}`)
  }

  return (
    <View className='base:p-[0] phone:p-[30px]' style={{ width: dimentions.deviceWidth, minHeight: dimentions.deviceHeight, position: disableRelative ? 'static' : 'relative' }}>
      <View className='w-[100%] h-[100%]' style={{ position: disableRelative ? 'static' : 'relative' }}>
        {/* Header */}
        {breakpoints !== 'phone' ? (
          <View className='w-[100%] flex-row items-center justify-between'>
            <Pressable onPress={() => router.push('/friend')}>
              <IconLogo width={40} height={34} theme={theme} />
            </Pressable>
            <View className='flex-row items-center gap-[12px]'>
              <ThemeToggle />
              {user?.activeCompanion?.profile_picture?.thumbnail ? (
                <Pressable onPress={handleCompanionPress}>
                  <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} style={{ width: 48, height: 48, borderRadius: 9999 }} />
                </Pressable>
              ) : (
                <></>
              )}
            </View>
          </View>
        ) : (
          <></>
        )}
        {/* Header - END */}

        <View className='h-[100%] flex-1 flex-row' style={{ position: disableRelative ? 'static' : 'relative' }}>
          {/* Mobile burger menu */}
          {breakpoints === 'phone' ? (
            <Pressable className='w-[48px] h-[48px] items-center justify-center bg-dark2/60 rounded-[20px] absolute top-[24px] left-[24px] z-[1]' onPress={openSidebar}>
              <IconMenu />
            </Pressable>
          ) : (
            <></>
          )}
          {/* Mobile burger menu - END */}

          {/* Sidebar */}
          <Animated.View style={{ height: '100%', left: leftAnim, top: 0, position: breakpoints === 'phone' ? 'absolute' : 'relative', zIndex: 2 }}>
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
                      handleSidebarLinkPress({ url: page.href })
                    }}
                  >
                    {isSelected ? page?.iconSelected : page?.icon}
                  </GradientPressable>
                )
              })}

              {breakpoints === 'phone' ? (
                <>
                  <View className='w-[100%] h-[1px]' style={{ backgroundColor: getThemeBorder({ theme, border: 'grey4_dark4' }) }}></View>
                  {user?.activeCompanion?.profile_picture?.thumbnail ? (
                    <Pressable onPress={handleCompanionPress}>
                      <Image source={{ uri: user?.activeCompanion?.profile_picture?.thumbnail }} style={{ width: 48, height: 48, borderRadius: 9999 }} />
                    </Pressable>
                  ) : (
                    <></>
                  )}
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
            style={{
              cursor: 'auto',
              width: containerWidth,
              minHeight: containerHeight,
              marginTop: keepMarginsOnMobile && breakpoints === 'phone' ? 30 + 34 + 30 : breakpoints === 'phone' ? 0 : 30,
              paddingHorizontal: keepSafePaddingOnMobile && breakpoints === 'phone' ? 24 : 0,
              position: disableRelative ? 'static' : 'relative',
              zIndex: mainZIndex,
            }}
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
