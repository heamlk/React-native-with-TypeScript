import { ImageBackground } from 'react-native'
import { GradientPressable, View, Text, getThemeBorder, Pressable, getThemeBackground } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import ImageMarketplace from '@/app/_assets/images/marketplace.jpg'
import { useTheme } from '../_context/theme'
import { usePathname, useRouter } from 'expo-router'
import useDimensions from '../_hooks/dimensions'
import useBreakpoints from '../_hooks/breakpoints'
import { LinearGradient } from 'expo-linear-gradient'
import themeVars from '../_styles/theme/themeVars'
import { useAuth } from '../_context/auth'
import { useEffect, useState } from 'react'
import { MarketplaceProduct } from '../_context/auth.types'

export default function Marketplace() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const { user } = useAuth()

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 34 - 30

  const [activeFilters, setActiveFilters] = useState<('monthly' | 'oneTime' | 'active')[]>([])
  const filters: ('monthly' | 'oneTime' | 'active')[] = ['active', 'monthly', 'oneTime']

  const toggleFilter = ({ filter }: { filter: 'monthly' | 'oneTime' | 'active' }) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((item) => item !== filter)
      } else {
        return [...prev, filter]
      }
    })
  }

  return (
    <AuthenticatedLayout keepMarginsOnMobile={breakpoints === 'phone' ? false : true} keepSafePaddingOnMobile={breakpoints === 'phone' ? false : true}>
      <View className='w-[100%] gap-[24px]'>
        {/* Banner */}
        <View className='w-[100%] relative'>
          <ImageBackground className='base:rounded-[0px] phone:rounded-t-lg overflow-hidden' style={{ width: containerWidth, height: breakpoints === 'phone' ? 200 : 230 }} source={ImageMarketplace} resizeMode='cover'></ImageBackground>
          <LinearGradient className='w-[100%] base:h-[200px] phone:h-[230px] absolute top-[0px] left-[0px] base:rounded-[0px] phone:rounded-t-lg' colors={[theme === 'light' ? themeVars.colors.light1 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0.5 }} />
          <Text className='font-[600] absolute base:left-[0px] base:right-[0px] base:mx-auto base:text-center phone:left-[26px] bottom-[26px]' color='grey1_light1' size='xl'>
            Marketplace
          </Text>
        </View>
        {/* Banner */}

        <View className='base:flex-col tablet:flex-row px-[20px] gap-[40px]'>
          {/* Filters */}
          <View className='base:w-[100%] phone::w-[230px] base:gap-[16px] phone:gap-[24px]'>
            <Text className='font-[600]' color='grey1_light1' size='sm'>
              FILTERS
            </Text>
            <View className='px-[24px] py-[24px] border-[1px] rounded-lg base:gap-[8px] phone:gap-[12px]' style={{ borderColor: getThemeBorder({ theme, border: 'grey6_dark3' }) }}>
              {filters?.map((filter, index) => {
                const isSelected = activeFilters?.includes(filter)

                return (
                  <Pressable key={index + 25013} className='w-auto self-start flex-row items-center gap-[12px]' onPress={() => toggleFilter({ filter })}>
                    <View className='w-[16px] h-[16px] rounded-[5px] border-[1px] relative' style={{ borderColor: isSelected ? getThemeBackground({ theme, breakpoints, background: 'grey3_purple3' }) : themeVars.colors.dark4 }}>
                      {theme === 'dark' ? <LinearGradient className='w-[100%] h-[100%] absolute top-[0px] left-[0px] rounded-[5px]' colors={[themeVars.colors.dark4, 'transparent']} start={{ x: 0, y: 0.5 }} end={{ x: 0, y: 1 }} /> : <></>}
                      {isSelected ? <View className='w-[100%] h-[100%] absolute top-[0px] left-[0px] z-[1] rounded-[5px]' background='grey3_purple3'></View> : <></>}
                    </View>
                    <Text className='font-[600]' color='grey1_light1' size='md'>
                      {filter === 'active' ? ' Active only' : filter === 'monthly' ? 'Monthly' : 'One-time fee'}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
          {/* Filters - END */}

          {/* Market */}
          <View className='flex-1 gap-[64px] overflow-auto scrollbar-hide' style={{ height: containerHeight - 230 - 24 }}>
            {activeFilters.includes('monthly') || !activeFilters.includes('oneTime') ? (
              <View className='base:gap-[16px] phone:gap-[24px]'>
                <Text className='font-[600]' color='grey1_light1' size='sm'>
                  MONTHLY SUBSCRIPTION
                </Text>

                <View className='flex-1 gap-[20px]'>
                  {(() => {
                    const filteredProducts =
                      user?.products?.filter((product) => {
                        if (product.type !== 'subscription') return false
                        if (activeFilters.includes('active') && product.status !== 'available') return false
                        if (!user?.profile?.is_age_verified && product.is_nsfw) return false
                        if (user?.profile?.nsfw_disabled_since && product.is_nsfw) return false
                        return true
                      }) || []

                    const rows =
                      breakpoints === 'desktop'
                        ? filteredProducts.reduce<MarketplaceProduct[][]>((rows, product, index, array) => {
                            if (index % 2 === 0) rows.push(array.slice(index, index + 2))
                            return rows
                          }, [])
                        : filteredProducts.map((product) => [product])

                    // Adding placeholder if the last row has one product
                    if (rows.length && rows[rows.length - 1].length === 1 && breakpoints === 'desktop') {
                      rows[rows.length - 1].push(null as any)
                    }

                    return rows.map((row, rowIndex) => (
                      <View key={rowIndex + 84896} className='flex-row gap-[20px]'>
                        {row.map((product, index) => {
                          if (!product) {
                            return <View key={index + 76787} className='flex-1'></View>
                          }

                          return (
                            <View key={index + 99518} className='base:h-[118px] phone:h-[146px] flex-1 flex-row relative border-[1px] rounded-md' border='transparent_dark3' background='grey6_dark7'>
                              <View className='relative rounded-l-md overflow-hidden' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }}>
                                <ImageBackground className='absolute top-[0px] left-[0px]' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }} source={{ uri: product?.thumbnail_image || '' }} resizeMode='cover'></ImageBackground>
                                <LinearGradient className='w-[100%] base:h-[118px] phone:h-[146px] absolute top-[0px] left-[0px] rounded-l-md' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} />
                              </View>
                              <View className='h-[100%] flex-1 justify-between pt-[16px] pb-[16px] px-[24px]'>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  {product?.name}
                                </Text>
                                {product?.status === 'available' ? (
                                  <GradientPressable className='px-[20px]' combinedClassname='self-start h-[32px]' type='primary'>
                                    <Text className='font-[600] text-light1' size='sm'>
                                      {product?.price}/Month
                                    </Text>
                                  </GradientPressable>
                                ) : (
                                  <></>
                                )}
                                {product?.status === 'coming_soon' ? (
                                  <View className='self-start h-[24px] items-center justify-center px-[12px] rounded-md' background='grey5_dark3'>
                                    <Text className='font-[600] text-light1' size='xs' color='grey2_light2'>
                                      COMING SOON
                                    </Text>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </View>
                            </View>
                          )
                        })}
                      </View>
                    ))
                  })()}
                </View>
              </View>
            ) : (
              <></>
            )}

            {activeFilters.includes('oneTime') || !activeFilters.includes('monthly') ? (
              <View className='base:gap-[16px] phone:gap-[24px]'>
                <Text className='font-[600]' color='grey1_light1' size='sm'>
                  ONE-TIME FEE
                </Text>

                <View className='flex-1 gap-[20px]'>
                  {(() => {
                    const filteredProducts =
                      user?.products?.filter((product) => {
                        if (product.type !== 'one_time') return false
                        if (activeFilters.includes('active') && product.status !== 'available') return false
                        if (!user?.profile?.is_age_verified && product.is_nsfw) return false
                        if (user?.profile?.nsfw_disabled_since && product.is_nsfw) return false
                        return true
                      }) || []

                    const rows =
                      breakpoints === 'desktop'
                        ? filteredProducts.reduce<MarketplaceProduct[][]>((rows, product, index, array) => {
                            if (index % 2 === 0) rows.push(array.slice(index, index + 2))
                            return rows
                          }, [])
                        : filteredProducts.map((product) => [product])

                    // Adding placeholder if the last row has one product
                    if (rows.length && rows[rows.length - 1].length === 1 && breakpoints === 'desktop') {
                      rows[rows.length - 1].push(null as any)
                    }

                    return rows.map((row, rowIndex) => (
                      <View key={rowIndex + 37846} className='flex-row gap-[20px]'>
                        {row.map((product, index) => {
                          if (!product) {
                            return <View key={index + 78945} className='flex-1'></View>
                          }

                          return (
                            <View key={index + 34668} className='base:h-[118px] phone:h-[146px] flex-1 flex-row relative border-[1px] rounded-md' border='transparent_dark3' background='grey6_dark7'>
                              <View className='relative rounded-l-md overflow-hidden' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }}>
                                <ImageBackground className='absolute top-[0px] left-[0px]' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }} source={{ uri: product?.thumbnail_image || '' }} resizeMode='cover'></ImageBackground>
                                <LinearGradient className='w-[100%] base:h-[118px] phone:h-[146px] absolute top-[0px] left-[0px] rounded-l-md' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} />
                              </View>
                              <View className='h-[100%] flex-1 justify-between pt-[16px] pb-[16px] px-[24px]'>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  {product?.name}
                                </Text>
                                {product?.status === 'available' ? (
                                  <GradientPressable className='px-[20px]' combinedClassname='self-start h-[32px]' type='primary'>
                                    <Text className='font-[600] text-light1' size='sm'>
                                      {product?.price}/Month
                                    </Text>
                                  </GradientPressable>
                                ) : (
                                  <></>
                                )}
                                {product?.status === 'coming_soon' ? (
                                  <View className='self-start h-[24px] items-center justify-center px-[12px] rounded-md' background='grey5_dark3'>
                                    <Text className='font-[600] text-light1' size='xs' color='grey2_light2'>
                                      COMING SOON
                                    </Text>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </View>
                            </View>
                          )
                        })}
                      </View>
                    ))
                  })()}
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
          {/* Market - END */}
        </View>
      </View>
    </AuthenticatedLayout>
  )
}
