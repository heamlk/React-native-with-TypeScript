import { GradientPressable, Pressable, Text, TextInput, View } from '@/app/_shared/components/reusable'
import Soul from '@/app/_shared/components/Soul'
import AuthenticatedLayout from '@/app/_shared/layout/authenticatedLayout'
import { BlurView } from 'expo-blur'
import { useTheme } from '@/app/_context/theme'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useDimensions from '@/app/_hooks/dimensions'
import useBreakpoints from '@/app/_hooks/breakpoints'
import { useEffect, useState } from 'react'
import themeVars from '@/app/_styles/theme/themeVars'
import { findNodeHandle, type GestureResponderEvent, UIManager, Platform, Image } from 'react-native'
import { useApi } from '@/app/_context/api'
import { capitalize, getRandomNumber } from '@/app/_lib/utils'
import IconDices from '@/app/_assets/icons/dices.svg'
import IconTrash from '@/app/_assets/icons/trash.svg'
import { useUser, UserType } from '@/app/_context/user'
import { CompanionAttributes, CompanionInfos } from '@/app/_context/auth.types'
import { usePopup } from '@/app/_context/popup'
import { LinearGradient } from 'expo-linear-gradient'

export type SelcetInputType = {
  open: boolean
  position: {
    x: number
    y: number
  }
  type: 'input' | 'select'
  inputPlaceholder: string
  value: string
  selectOptions: { name: string; value: string }[]
  onChange: (string: string) => void
}

export const defaultSelcetInput: SelcetInputType = {
  open: false,
  position: {
    x: 0,
    y: 0,
  },
  type: 'input',
  value: '',
  inputPlaceholder: '',
  selectOptions: [],
  onChange: (string: string) => {},
}

export default function NewFriendPage() {
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId

  const { theme } = useTheme()
  const dimentions = useDimensions()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const { user, setUser, updateUser } = useUser()
  const api = useApi()
  const { setPopup } = usePopup()

  const [friend, setFriend] = useState(user?.companions?.find((obj) => obj?.id === friendId))
  const [socketEvent, setSocketEvent] = useState('')
  const [blurActive, setBlurActive] = useState(false)
  const [mainZIndex, setMainZIndex] = useState<0 | 10>(0)
  const [inputSelect, setInputSelect] = useState<SelcetInputType>(defaultSelcetInput)
  const [availableAttributes, setAvailableAttributes] = useState<Record<string, any>>({})
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleBlurClose = () => {
    setBlurActive(false)
    setMainZIndex(0)
    setInputSelect(defaultSelcetInput)
  }

  const handleSelectInputOpen = ({ event, attribute, type, inputPlaceholder }: { event: GestureResponderEvent; attribute: string; type: 'input' | 'select'; inputPlaceholder?: string }) => {
    setBlurActive(true)
    setMainZIndex(10)

    let top = 0
    let left = 0

    if (Platform.OS === 'web') {
      // @ts-ignore
      const rect = event?.currentTarget?.getBoundingClientRect?.()
      top = rect?.top || 0
      left = rect?.left || 0
    } else {
      // @ts-ignore
      const handle = findNodeHandle(event?.currentTarget)
      if (handle)
        UIManager?.measure(handle, (x, y, width, height, pageX, pageY) => {
          // console.log('Native measure:', { x, y, width, height, pageX, pageY })
        })
    }

    if (type === 'select') {
      const currentAttributeOptions = availableAttributes?.[attribute]
      const listHeight = currentAttributeOptions?.length * 36

      setInputSelect({
        open: true,
        position: { x: left, y: top - listHeight / 2 + 18 },
        inputPlaceholder: '',
        type: 'select',
        value: attribute,
        selectOptions: currentAttributeOptions?.map((option: { key: string; value: string }) => {
          return {
            name: option?.value,
            value: option?.key,
          }
        }),
        onChange: (newVal) => {
          setSelectedAttributes((prev) => ({ ...prev, [attribute]: newVal }))
          handleBlurClose()
        },
      })
    } else if (type === 'input') {
      setInputSelect({
        open: true,
        position: { x: left, y: top + 18 },
        inputPlaceholder: inputPlaceholder || '',
        type: 'input',
        value: attribute,
        selectOptions: [],
        onChange: (newVal) => {
          setSelectedAttributes((prev) => ({ ...prev, [attribute]: newVal }))
        },
      })
    }
  }

  const handleGo = async () => {
    const keyNames: Record<string, string> = {
      age: 'Age',
      ancestral_region: 'Ancestral region',
      attire: 'Attire',
      eye_color: 'Eye color',
      facial_hair: 'Facial hair',
      gender: 'Gender',
      hair_color: 'Hair color',
      hair_length: 'Hair length',
      name: 'Companion name',
      personality: 'Personality',
      skin_tone: 'Skin tone',
      universe: 'Universe',
    }

    const errors: string[] = []

    Object.entries(availableAttributes)?.map(([key, value]) => {
      if (['optional_attributes', 'politics'].includes(key)) return

      const keyValue = selectedAttributes?.[key]
      if (key === 'name') {
        const value = selectedAttributes?.[key]
        if (!keyValue) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} is required`)
        } else if (keyValue?.length < 1) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} must have at lest 1 character`)
        } else if (keyValue?.length > 30) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} can't have more than 30 characters`)
        }
      } else if (key === 'age') {
        if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(keyValue)) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} must be a number`)
        } else if (Number(keyValue) < 21) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} can't be less than 21`)
        } else if (Number(keyValue) > 100) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} can't be more than 100`)
        }
      } else {
        if (!keyValue) {
          errors.push(`${capitalize({ value: keyNames?.[key] || '' })} is required`)
        }
      }
    })

    setValidationErrors(errors)
    if (errors?.length > 0) {
      return
    }

    if (friend?.id) {
      // Updating companion
      try {
        setSocketEvent('Editing friend...')
        const updateCompanionReq = await api.postEditCompanion({
          age: Number(selectedAttributes?.age),
          ancestral_region: selectedAttributes?.ancestral_region,
          attire: selectedAttributes?.attire,
          eye_color: selectedAttributes?.eye_color,
          gender: selectedAttributes?.gender,
          hair_color: selectedAttributes?.hair_color,
          hair_length: selectedAttributes?.hair_length,
          facial_hair: selectedAttributes?.facial_hair,
          name: selectedAttributes?.name,
          personality: selectedAttributes?.personality,
          skin_tone: selectedAttributes?.skin_tone,
          universe: selectedAttributes?.universe,
          companionId: friend?.id,
        })
        const getProfileReq = await api.getProfile()
        const newUser = { ...user, profile: getProfileReq.data?.customer, companions: getProfileReq?.data?.companions } as UserType
        setUser(newUser)
      } catch (error) {
        setSocketEvent('')
        console.warn(error)
      }
    } else {
      // Creating companion
      try {
        setSocketEvent('Creating friend...')
        const createCompanionReq = await api.postCreateCompanion({
          age: Number(selectedAttributes?.age),
          ancestral_region: selectedAttributes?.ancestral_region,
          attire: selectedAttributes?.attire,
          eye_color: selectedAttributes?.eye_color,
          gender: selectedAttributes?.gender,
          hair_color: selectedAttributes?.hair_color,
          hair_length: selectedAttributes?.hair_length,
          facial_hair: selectedAttributes?.facial_hair,
          name: selectedAttributes?.name,
          personality: selectedAttributes?.personality,
          skin_tone: selectedAttributes?.skin_tone,
          universe: selectedAttributes?.universe,
        })
        const getProfileReq = await api.getProfile()
        const newUser = { ...user, profile: getProfileReq.data?.customer, companions: getProfileReq?.data?.companions } as UserType
        setUser(newUser)
      } catch (error) {
        setSocketEvent('')
        console.warn(error)
      }
    }
  }

  const handleRandomize = () => {
    const defaultNames: { male: string[]; female: string[]; other: string[] } = availableAttributes?.['name']?.find((val: any) => val?.key === 'default_names')?.value
    const randomGender: 'male' | 'female' | 'other' = availableAttributes['gender'][getRandomNumber({ min: 0, max: availableAttributes['gender']?.length - 1 })]?.key
    const randomName = defaultNames?.[randomGender]?.[getRandomNumber({ min: 0, max: defaultNames?.[randomGender]?.length - 1 })]

    const randomUniverse = availableAttributes['universe'][getRandomNumber({ min: 0, max: availableAttributes['universe']?.length - 1 })]?.key
    const randomAge = Math.floor(Math.random() * (100 - 21 + 1)) + 21
    const randomHairColor = availableAttributes['hair_color'][getRandomNumber({ min: 0, max: availableAttributes['hair_color']?.length - 1 })]?.key
    const randomHairLength = availableAttributes['hair_length'][getRandomNumber({ min: 0, max: availableAttributes['hair_length']?.length - 1 })]?.key
    const randomFacialHair = availableAttributes['facial_hair'][getRandomNumber({ min: 0, max: availableAttributes['facial_hair']?.length - 1 })]?.key
    const randomSkinTone = availableAttributes['skin_tone'][getRandomNumber({ min: 0, max: availableAttributes['skin_tone']?.length - 1 })]?.key
    const randomEyeColor = availableAttributes['eye_color'][getRandomNumber({ min: 0, max: availableAttributes['eye_color']?.length - 1 })]?.key
    const randomAncestralRegion = availableAttributes['ancestral_region'][getRandomNumber({ min: 0, max: availableAttributes['ancestral_region']?.length - 1 })]?.key
    const randomAttire = availableAttributes['attire'][getRandomNumber({ min: 0, max: availableAttributes['attire']?.length - 1 })]?.key
    const randomPersonality = availableAttributes['personality'][getRandomNumber({ min: 0, max: availableAttributes['personality']?.length - 1 })]?.key

    setSelectedAttributes({
      name: randomName,
      gender: randomGender,
      universe: randomUniverse,
      age: String(randomAge),
      hair_color: randomHairColor,
      hair_length: randomHairLength,
      facial_hair: randomFacialHair,
      skin_tone: randomSkinTone,
      eye_color: randomEyeColor,
      ancestral_region: randomAncestralRegion,
      attire: randomAttire,
      personality: randomPersonality,
    })
    setValidationErrors([])
  }

  const handleDelete = async () => {
    try {
      setSocketEvent('Deleting friend...')

      const req = await api.deleteCompanion({ id: friend?.id || '' })
      const data = req?.data

      if (data === 'OK') {
        await updateUser()
        setSocketEvent('')

        router.push('/friend')
      }
    } catch (error) {
      setSocketEvent('')
      console.warn(error)
    }
  }

  const handleDeletePopup = () => {
    setPopup({
      open: true,
      maxWidth: 600,
      content: (
        <View className='gap-[24px]'>
          <Text className='text-[24px] font-[600]' color='grey1_light1'>
            Delete friend
          </Text>
          <Text className='' size='md' color='grey1_light1'>
            Are you sure you want to delete this friend?
          </Text>
          <View className='flex-row gap-[16px]'>
            <GradientPressable
              className='w-[150px] h-[48px]'
              type='dark'
              onPress={async () => {
                setPopup({ open: false })
                handleDelete()
              }}
            >
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Ok
              </Text>
            </GradientPressable>
            <GradientPressable className='w-[150px] h-[48px]' type='dark' onPress={() => setPopup({ open: false })}>
              <Text className='font-[600]' size='md' color='grey1_light2'>
                Cancel
              </Text>
            </GradientPressable>
          </View>
        </View>
      ),
    })
  }

  const GetSelectedAttribute = ({ attribute, def }: { attribute: string; def: string }) => {
    const selectedAttribute = availableAttributes?.[attribute]?.find((att: any) => att?.key === selectedAttributes?.[attribute])?.value || selectedAttributes?.[attribute] || ''
    return breakpoints === 'phone' ? (
      <GradientPressable type='dark' isPressable={false}>
        <Text className='base:text-[20px] phone:text-[24px]' color='light1_light2'>
          {selectedAttribute || def}
        </Text>
      </GradientPressable>
    ) : (
      <Text className='base:text-[20px] phone:text-[24px]' color='red1'>
        {selectedAttribute || def}
      </Text>
    )
  }

  useEffect(() => {
    const getAttributes = async () => {
      const res = await api.getAvailableAttributes()
      const data = res.data

      setUser((prev) => ({
        ...(prev as UserType),
        companionAttributes: data?.attributes,
      }))

      let attributesObject: Record<string, any> = {}
      Object.entries(data?.attributes)?.forEach(([attributeKey, attributeValue]: [string, any]) => {
        const attribute = data?.attributes?.[attributeKey]

        attributesObject[attributeKey] = []
        Object.entries(attribute)?.forEach(([attributeEntryKey, attributeEntryValue]: [string, any]) => {
          attributesObject[attributeKey].push({
            key: attributeEntryKey,
            value: attributeEntryValue,
          })
        })
      })
      setAvailableAttributes(attributesObject)
    }

    getAttributes()
  }, [])

  useEffect(() => {
    const onCompanionUpdateEvent: any = async ({ companion }: { companion: CompanionInfos }) => {
      router.push(`/friend/confirm/${companion?.id}`)
      setSocketEvent('')
    }

    api.socketState?.on('companion_update', onCompanionUpdateEvent)

    return () => {
      api.socketState?.off('companion_update')
    }
  }, [api.socketState?.active])

  useEffect(() => {
    if (friendId && friendId !== 'new') {
      const activeFriend = user?.companions?.find((companion) => companion?.id === friendId)
      if (activeFriend) {
        setFriend(activeFriend)
        setSelectedAttributes({
          name: activeFriend?.name || '',
          gender: activeFriend?.gender || '',
          universe: activeFriend?.universe || '',
          age: String(activeFriend?.age) || '21',
          hair_color: activeFriend?.hair_color || '',
          hair_length: activeFriend?.hair_length || '',
          facial_hair: activeFriend?.facial_hair || '',
          skin_tone: activeFriend?.skin_tone || '',
          eye_color: activeFriend?.eye_color || '',
          ancestral_region: activeFriend?.ancestral_region || '',
          attire: activeFriend?.attire || '',
          personality: activeFriend?.personality || '',
        })
      }
    }
  }, [user])

  return (
    <AuthenticatedLayout disableRelative={true} mainZIndex={mainZIndex}>
      {/* Blur background */}
      {blurActive ? (
        <Pressable className='w-[100%] h-[100%] absolute top-[0] left-[0] z-[100]' onPress={handleBlurClose}>
          <BlurView className='w-[100%] h-[100%]' style={{ backgroundColor: theme === 'light' ? themeVars.colors.white + themeVars.colors.opacity60 : themeVars.colors.dark2 + themeVars.colors.opacity60 }} intensity={20}></BlurView>
        </Pressable>
      ) : (
        <></>
      )}
      {/* Blur background - END */}

      {inputSelect?.open ? (
        <View
          className='w-[fit-content] h-[fit-content] absolute z-[101] border-[1px] rounded-sm m-auto'
          style={{ ...(breakpoints === 'phone' ? { left: 0, right: 0, top: 0, bottom: 0 } : { left: inputSelect?.position?.x, top: inputSelect?.position?.y }), borderColor: theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity40 }}
          background='grey6_dark1'
        >
          {inputSelect?.type === 'select' ? (
            <View className=''>
              {inputSelect?.selectOptions?.map((option, index) => {
                const isSelected = selectedAttributes?.[inputSelect?.value] === option?.value

                return (
                  <Pressable
                    key={option?.value + 72487}
                    className='px-[16px] py-[8px]'
                    hoverBackground='grey5_purple2/40'
                    background={isSelected ? 'grey5_purple2/40' : 'transparent'}
                    onPress={() => inputSelect?.onChange(option?.value)}
                    style={index === 0 ? { borderTopStartRadius: themeVars.borderRadius.sm, borderTopEndRadius: themeVars.borderRadius.sm } : index === inputSelect?.selectOptions?.length - 1 ? { borderBottomStartRadius: themeVars.borderRadius.sm, borderBottomEndRadius: themeVars.borderRadius.sm } : {}}
                  >
                    <Text className='text-[18px]' color='grey1_light3'>
                      {option?.name}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          ) : (
            <></>
          )}

          {inputSelect?.type === 'input' ? (
            <View className='flex-row items-center'>
              <TextInput className='max-h-[38px] px-[16px] text-[18px]' color='grey1_light3' placeholder={inputSelect?.inputPlaceholder} onChangeText={(newText) => inputSelect?.onChange(newText)} keyboardType={inputSelect?.value === 'age' ? 'numeric' : 'default'} />
              <Pressable onPress={() => handleBlurClose()}>
                <Text className='pr-[16px]' size='md' color='grey1_light3'>
                  Ok
                </Text>
              </Pressable>
            </View>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <></>
      )}

      {socketEvent ? (
        <View className='gap-[10px] items-center justify-center m-auto'>
          <Text className='font-[600]' size='3xl' color='grey3_light3'>
            {socketEvent}
          </Text>
          <Soul width={80} height={80} soulSize={80} />
        </View>
      ) : (
        <View className='gap-[30]'>
          <Text className='base:hidden phone:flex mx-auto text-center' size='lg' color='grey1_light1'>
            Perfect, now let’s see what I should act and look like!
          </Text>
          <View className='base:flex-col tablet:flex-row justify-center base:items-center base:gap-[30px] tablet:gap-[90px]'>
            {/* Soul */}
            <View className='base:w-[100%] base:w-[unset] phone:min-w-[300px] tablet:min-w-[500px] desktop:min-w-[500px] base:h-[300px] tablet:h-[500px] items-center justify-center rounded-md' background={breakpoints === 'phone' ? 'transparent' : 'grey3_dark1'}>
              {friendId !== 'new' && friend?.profile_picture?.image ? (
                <Image
                  source={{ uri: friend?.profile_picture?.image }}
                  style={{
                    ...(breakpoints === 'phone' ? { width: dimentions?.deviceWidth, height: 300, borderRadius: 0 } : breakpoints === 'tablet' ? { width: 300, height: 300, borderRadius: themeVars.borderRadius.md } : { width: 500, height: 500, borderRadius: themeVars.borderRadius.md }),
                  }}
                />
              ) : (
                <Soul width={200} height={200} soulSize={200} />
              )}

              {breakpoints === 'phone' && friendId !== 'new' ? <LinearGradient className='w-[100%] h-[80px] absolute bottom-[0px] left-[0px]' colors={[theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7, 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} /> : <></>}
            </View>
            {/* Soul - END */}

            {/* Form */}
            <View className='w-[100%] max-w-[600px] gap-[40px]'>
              <View className='px-[50px] base:gap-[24px] phone:gap-[0px]'>
                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  Hi, I am from the{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'universe', type: 'select' })}>
                    <GetSelectedAttribute attribute='universe' def='Universe' />
                  </Pressable>{' '}
                  universe.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  My name is{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'name', type: 'input', inputPlaceholder: 'First name' })}>
                    <GetSelectedAttribute attribute='name' def='First name' />
                  </Pressable>{' '}
                  .
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I am excited to be your new best friend!
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  Let me tell you about myself, I am{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'gender', type: 'select' })}>
                    <GetSelectedAttribute attribute='gender' def='Gender' />
                  </Pressable>
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  and I am{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'age', type: 'input', inputPlaceholder: 'Age' })}>
                    <GetSelectedAttribute attribute='age' def='Age' />
                  </Pressable>{' '}
                  years old.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I have{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'hair_color', type: 'select' })}>
                    <GetSelectedAttribute attribute='hair_color' def='Color' />
                  </Pressable>{' '}
                  hair.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I have{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'hair_length', type: 'select' })}>
                    <GetSelectedAttribute attribute='hair_length' def='Length' />
                  </Pressable>{' '}
                  hair.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I have{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'facial_hair', type: 'select' })}>
                    <GetSelectedAttribute attribute='facial_hair' def='Facial' />
                  </Pressable>{' '}
                  hair.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  a{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'skin_tone', type: 'select' })}>
                    <GetSelectedAttribute attribute='skin_tone' def='Color-ish' />
                  </Pressable>{' '}
                  skin tone.
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  My eyes are{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'eye_color', type: 'select' })}>
                    <GetSelectedAttribute attribute='eye_color' def='Color' />
                  </Pressable>{' '}
                  .
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  My ancestral region is{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'ancestral_region', type: 'select' })}>
                    <GetSelectedAttribute attribute='ancestral_region' def='Ancestral region' />
                  </Pressable>{' '}
                  .
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I like to wear{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'attire', type: 'select' })}>
                    <GetSelectedAttribute attribute='attire' def='Attire' />
                  </Pressable>{' '}
                  .
                </Text>

                <Text className='base:text-center phone:text-start base:text-[20px] phone:text-[24px]' color='grey1_light1'>
                  I have a{' '}
                  <Pressable onPress={(event) => handleSelectInputOpen({ event, attribute: 'personality', type: 'select' })}>
                    <GetSelectedAttribute attribute='personality' def='Blank' />
                  </Pressable>{' '}
                  personality.
                </Text>

                <View className='gap-[4px] mt-[14px]'>
                  {validationErrors?.map((error) => {
                    return (
                      <Text key={error + 46454} size='md' color='red1'>
                        {error}
                      </Text>
                    )
                  })}
                </View>
              </View>

              {breakpoints !== 'phone' ? (
                <View className='flex-row gap-[20px]'>
                  <Pressable className='w-[100%] max-w-[290px] h-[92px] items-center justify-center rounded-md border-[2px]' background='grey3_dark1' border='transparent_purple2/40' onPress={handleGo}>
                    <Text className='text-[24px] font-[600]' color='light1_light3'>
                      Go
                    </Text>
                  </Pressable>

                  {friend && friendId !== 'new' ? (
                    <Pressable className='w-[100%] max-w-[290px] h-[92px] items-center justify-center rounded-md border-[2px]' background='transparent_dark1' border='red1' onPress={handleDeletePopup}>
                      <Text className='text-[24px] font-[600]' color='red1'>
                        Delete
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable className='w-[100%] max-w-[290px] h-[92px] items-center justify-center rounded-md border-[2px]' background='grey3_dark1' border='transparent_purple2/40' onPress={handleRandomize}>
                      <Text className='text-[24px] font-[600]' color='light1_light3'>
                        Randomize
                      </Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <></>
              )}

              {breakpoints === 'phone' ? (
                <View className='px-[35px] gap-[10px]'>
                  <GradientPressable className='w-[100%] h-[70px]' type='primary' onPress={handleGo}>
                    <Text className='font-[600]' size='lg' color='light1_light2'>
                      Go
                    </Text>
                  </GradientPressable>
                </View>
              ) : (
                <></>
              )}
            </View>
            {/* Form - END */}

            {breakpoints === 'phone' ? (
              <Pressable className='w-[48px] h-[48px] bg-dark2/60 items-center justify-center rounded-[20px] absolute top-[24px] right-[24px]' onPress={friend && friendId !== 'new' ? handleDelete : handleRandomize}>
                {friend && friendId !== 'new' ? <IconTrash /> : <IconDices />}
              </Pressable>
            ) : (
              <></>
            )}
          </View>
        </View>
      )}
    </AuthenticatedLayout>
  )
}
