import { Image, ImageBackground, Modal } from 'react-native'
import { GradientPressable, View, Text, getThemeBorder, Pressable, getThemeBackground } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import ImageMarketplace from '@/app/_assets/images/marketplace.jpg'
import { useTheme } from '../_context/theme'
import useDimensions from '../_hooks/dimensions'
import useBreakpoints from '../_hooks/breakpoints'
import { LinearGradient } from 'expo-linear-gradient'
import themeVars from '../_styles/theme/themeVars'
import { useEffect, useState } from 'react'
import { MarketplaceProduct, SubscriptionOption } from '../_context/auth.types'
import { useUser } from '../_context/user'
import { BlurView } from 'expo-blur'
import IconBack from '@/app/_assets/icons/arrow-narrow-left.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePayments } from '../_context/payments'

export default function Marketplace() {
  const { purchase } = usePayments()
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()
  const { user, updateUser } = useUser()

  const containerWidth = breakpoints === 'phone' ? dimentions.deviceWidth : dimentions.deviceWidth - 60 - 48 - 30
  const containerHeight = breakpoints === 'phone' ? dimentions.deviceHeight : dimentions.deviceHeight - 60 - 48 - 30

  const [popup, setPopup] = useState<null | { product: MarketplaceProduct; subscriptionOption: SubscriptionOption }>(null)
  const [activating, setActivating] = useState<null | MarketplaceProduct['id']>(null)

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

  const handlePopupOpen = ({ product, subscriptionOption }: { product: MarketplaceProduct; subscriptionOption: SubscriptionOption }) => {
    setPopup({ product, subscriptionOption })
  }

  const handlePopupClose = () => {
    setPopup(null)
  }

  const activateSubscription = async ({ productId }: { productId: MarketplaceProduct['id'] }) => {
    if (activating || !productId) {
      return
    }

    setActivating(productId)

    const offerings: { [key: string]: MarketplaceProduct['id'] } = {
      nsfw_capability: 'nsfw_capability',
      text_2_voice: 'advanced_voices',
      additional_ai: 'monthly_subscription',
      advanced_animation: 'advanced_animation',
      anime_universe: 'anime_universe',
      goth_universe: 'goth_universe',
      neon_universe: 'neon_glow_universe',
      fashion_universe: 'fashion_universe',
    }

    const pkgIdentifiers: { [key: string]: MarketplaceProduct['id'] } = {
      nsfw_capability: '$rc_monthly',
      text_2_voice: '$rc_monthly',
      additional_ai: '$rc_monthly',
      advanced_animation: '$rc_monthly',
      anime_universe: '$rc_lifetime',
      goth_universe: '$rc_lifetime',
      neon_universe: '$rc_lifetime',
      fashion_universe: '$rc_lifetime',
    }

    const offering = offerings?.[productId]
    const pkgIdentifier = pkgIdentifiers?.[productId]

    console.log('offering: ', offering)
    console.log('pkgIdentifier: ', pkgIdentifier)

    const transaction = await purchase({ offering, pkgIdentifier })
    console.log('transaction: ', transaction)

    setActivating(null)
    handlePopupClose()
  }

  // const activateSubscription = async ({ product, subscriptionOption }: { product: MarketplaceProduct; subscriptionOption: SubscriptionOption }) => {
  //   if (activating) {
  //     return
  //   }

  //   const isSubscription = product?.type === 'subscription'
  //   setActivating(product?.id)
  //   const req = isSubscription ? await api.postAddSubscriptionOption({ productId: product?.id, success_url: redirectUrl, cancel_url: redirectUrl }) : await api.postGetPaymentUrl({ productId: product?.id, success_url: redirectUrl, cancel_url: redirectUrl })
  //   const data = req?.data
  //   setActivating(null)

  //   if (data !== 'OK' && data?.url !== null) {
  //     if (Platform.OS === 'web') {
  //       window.location.href = data?.url
  //     } else {
  //       await Linking.openURL(data.url)
  //     }
  //   } else {
  //     await new Promise((resolve) => {
  //       setTimeout(() => {
  //         handlePopupClose()
  //       }, 3000)
  //     })
  //     await updateUser()
  //   }
  // }

  useEffect(() => {
    updateUser()
  }, [])

  return (
    <AuthenticatedLayout>
      {popup ? (
        <Modal visible={!!popup} transparent={true} animationType='none'>
          <Pressable className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[100] cursor-default' onPress={handlePopupClose}>
            <BlurView className='w-[100%] h-[100%] items-center justify-center' style={{ backgroundColor: theme === 'light' ? themeVars.colors.white + themeVars.colors.opacity60 : themeVars.colors.dark2 + themeVars.colors.opacity60 }} intensity={20}>
              <View className='w-[100%] max-w-[500px] base:h-[250px] phone:h-[500px] flex-row gap-[16px]'>
                {breakpoints !== 'phone' ? (
                  <Pressable className='w-[48px] h-[48px] rounded-[20px] items-center justify-center' background='dark2/60' onPress={handlePopupClose}>
                    <IconBack />
                  </Pressable>
                ) : (
                  <></>
                )}

                <Pressable className='flex-1 rounded-md border-[1px] cursor-default' background='grey6_dark6' border='transparent_dark3' onPress={(e) => e.preventDefault()}>
                  {breakpoints !== 'phone' ? (
                    <View className='relative' style={{ width: 436, height: 240 }}>
                      <LinearGradient className='flex-1 base:h-[118px] phone:h-[146px] absolute bottom-[0px] left-[1px] z-[100]' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ width: 432 }} />
                      <Image source={{ uri: popup?.product?.banner_image }} style={{ width: 432, height: 240, borderTopLeftRadius: themeVars.borderRadius.md, borderTopRightRadius: themeVars.borderRadius.md }} />
                    </View>
                  ) : (
                    <></>
                  )}

                  <View className='flex-1 gap-[24px] px-[24px] pb-[24px] base:pt-[24px] phone:pt-[0]'>
                    <Text className='font-[600] text-[24px]' color='grey1_light1'>
                      {popup?.product?.name}
                    </Text>
                    <View className='border-t-[1px] border-b-[1px] py-[24px]' border='grey3_dark3'>
                      <Text size='md' color='grey1_light1'>
                        {popup?.product?.description}
                      </Text>
                    </View>
                    <View className='flex-1 justify-end'>
                      <View className='flex-row justify-between'>
                        <Text className='font-[600]' size='md' color='grey1_light1'>
                          ${popup?.product?.price}
                          {popup?.product?.type === 'subscription' ? '/Month' : ''}
                        </Text>

                        {popup?.subscriptionOption?.active_until >= Math.floor(Date.now() / 1000) ? (
                          <Pressable className='h-[24px] self-start items-center justify-center px-[12px] rounded-[12px]' background='green1'>
                            <Text className='font-[600]' size='xs' color='light1_light2'>
                              ACTIVE
                            </Text>
                          </Pressable>
                        ) : (
                          <GradientPressable className='px-[20px]' combinedClassname='self-start h-[32px]' type={theme === 'light' ? 'dark' : 'primary'} onPress={() => activateSubscription({ productId: popup?.product?.id })}>
                            <Text className='font-[600] text-light1' size='sm'>
                              {activating ? 'Loading...' : 'Activate'}
                            </Text>
                          </GradientPressable>
                        )}
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>
            </BlurView>
          </Pressable>
        </Modal>
      ) : (
        <></>
      )}

      <View className='w-[100%] gap-[24px]' style={{ paddingBottom: insets.bottom + 25 }}>
        {/* Banner */}
        <View className='w-[100%] relative'>
          <ImageBackground className='base:rounded-[0px] phone:rounded-t-lg overflow-hidden' style={{ width: containerWidth - 2, minHeight: breakpoints === 'phone' ? 200 - 2 : 230 - 2 }} source={ImageMarketplace} resizeMode='cover'></ImageBackground>
          <LinearGradient className='w-[100%] base:h-[200px] phone:h-[230px] absolute top-[0px] left-[0px] base:rounded-[0px] phone:rounded-t-lg' colors={[theme === 'light' ? themeVars.colors.light1 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0.5 }} />
          <Text className='font-[600] absolute base:left-[0px] base:right-[0px] base:mx-auto base:text-center phone:left-[26px] bottom-[26px]' color='grey1_light1' size='xl'>
            Marketplace
          </Text>
        </View>
        {/* Banner */}

        <View className='base:flex-col tablet:flex-row px-[20px] gap-[40px]'>
          {/* Filters */}
          <View className='base:w-[100%] phone:w-[230px] base:gap-[16px] phone:gap-[24px]'>
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
          <View className='flex-1 gap-[64px] overflow-auto scrollbar-hide' style={breakpoints === 'phone' ? {} : { height: containerHeight - 230 - 24 }}>
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

                          let isSubscribed = false
                          let subscriptionOption: any = {}

                          Object.entries(user?.profile?.subscription?.options || {})?.forEach(([key, value]) => {
                            if (product?.id === key) {
                              subscriptionOption = value
                              const active_until = value?.active_until
                              isSubscribed = active_until >= Math.floor(Date.now() / 1000)
                            }
                          })

                          return (
                            <View key={index + 99518} className='base:h-[118px] phone:h-[146px] flex-1 flex-row relative border-[1px] rounded-md' border='transparent_dark3' background='grey6_dark7'>
                              <View className='relative rounded-l-md overflow-hidden' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }}>
                                <ImageBackground className='absolute top-[0px] left-[0px]' style={breakpoints === 'phone' ? { width: 168, height: 116 } : { width: 190, height: 142 }} source={{ uri: product?.thumbnail_image || '' }} resizeMode='cover'></ImageBackground>
                                <LinearGradient className='w-[100%] base:h-[118px] phone:h-[146px] absolute top-[0px] left-[0px] rounded-l-md' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} />
                              </View>
                              <View className='h-[100%] flex-1 justify-between pt-[16px] pb-[16px] px-[24px]'>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  {product?.name}
                                </Text>
                                {product?.status === 'available' ? (
                                  isSubscribed ? (
                                    <Pressable className='h-[24px] self-start items-center justify-center px-[12px] rounded-[12px]' background='green1' onPress={() => handlePopupOpen({ product, subscriptionOption })}>
                                      <Text className='font-[600]' size='xs' color='light1_light2'>
                                        ACTIVE
                                      </Text>
                                    </Pressable>
                                  ) : (
                                    <GradientPressable className='px-[20px]' combinedClassname='self-start h-[32px]' type='primary' onPress={() => handlePopupOpen({ product, subscriptionOption })}>
                                      <Text className='font-[600] text-light1' size='sm'>
                                        ${product?.price}/Month
                                      </Text>
                                    </GradientPressable>
                                  )
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

                          let isSubscribed = false
                          let subscriptionOption: any = {}

                          Object.entries(user?.profile?.subscription?.options || {})?.forEach(([key, value]) => {
                            if (product?.id === key) {
                              subscriptionOption = value

                              const active_until = value?.active_until
                              isSubscribed = active_until >= Math.floor(Date.now() / 1000)
                            }
                          })

                          return (
                            <View key={index + 34668} className='base:h-[118px] phone:h-[146px] flex-1 flex-row relative border-[1px] rounded-md' border='transparent_dark3' background='grey6_dark7'>
                              <View className='relative rounded-l-md overflow-hidden' style={breakpoints === 'phone' ? { width: 170, height: 118 } : { width: 192, height: 144 }}>
                                <ImageBackground className='absolute top-[0px] left-[0px]' style={breakpoints === 'phone' ? { width: 168, height: 116 } : { width: 190, height: 142 }} source={{ uri: product?.thumbnail_image || '' }} resizeMode='cover'></ImageBackground>
                                <LinearGradient className='w-[100%] base:h-[118px] phone:h-[146px] absolute top-[0px] left-[0px] rounded-l-md' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} />
                              </View>
                              <View className='h-[100%] flex-1 self-start justify-between pt-[16px] pb-[16px] px-[24px]'>
                                <Text className='font-[600]' size='md' color='grey1_light1'>
                                  {product?.name}
                                </Text>
                                {product?.status === 'available' ? (
                                  isSubscribed ? (
                                    <Pressable className='h-[24px] self-start items-center justify-center px-[12px] rounded-[12px]' background='green1' onPress={() => handlePopupOpen({ product, subscriptionOption })}>
                                      <Text className='font-[600]' size='xs' color='light1_light2'>
                                        ACTIVE
                                      </Text>
                                    </Pressable>
                                  ) : (
                                    <GradientPressable combinedClassname='base:max-w-[80px] h-[32px]' type='primary' onPress={() => handlePopupOpen({ product, subscriptionOption })}>
                                      <Text className='font-[600] text-light1' size='sm'>
                                        ${product?.price}
                                      </Text>
                                    </GradientPressable>
                                  )
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
