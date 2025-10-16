import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'
import useDimensions from '@/app/_hooks/dimensions'
import { View, Text, Pressable, TextInput, Logo, getThemeBackground, GradientPressable } from '@/app/_shared/components/reusable'
import IconUser from '@/app/_assets/icons/user'
import IconPencil from '@/app/_assets/icons/pencil.svg'
import themeVars from '@/app/_styles/theme/themeVars'
import { useForm, Controller } from 'react-hook-form'
import { useRef, useState } from 'react'
import { useApi } from '@/app/_context/api'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Platform, Image } from 'react-native'
import Subscription from '../_shared/components/subscription'
import { useUser, type UserType } from '../_context/user'

export default function OnboardingPage() {
  const { theme } = useTheme()
  const { user, setUser } = useUser()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()
  const api = useApi()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const [confirmationError, setConfirmationError] = useState('')

  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { username: '', firstName: '', lastName: '', dateOfBirth: '', referalCode: '', interests: [] },
    reValidateMode: 'onChange',
  })

  const handleNativeImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      const uri = asset.uri
      const fileName = asset.fileName || uri.split('/').pop() || 'avatar.jpg'
      const type = asset.mimeType || 'image/jpeg'

      const file: any = {
        uri,
        name: fileName,
        type,
      }

      setPreview(uri)
      setAvatar(file)
    }
  }

  const handleWebImagePick = () => {
    fileInputRef.current?.click()
  }

  const handleWebImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPreview(null)
      setAvatar(null)
      return
    }

    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleImageChangePress = () => {
    if (Platform.OS === 'web') {
      handleWebImagePick()
    } else {
      handleNativeImagePick()
    }
  }

  const onStepChange = async ({ step }: { step: number }) => {
    const isValid = await trigger()

    if (!isValid) {
      return
    }

    if (step === 2 && selectedInterests.length === 0) {
      setError('interests', { message: 'At least one preference is required' })
      return
    }

    if (step === 2) {
      try {
        const splitDateOfBirth = getValues('dateOfBirth').split('/')
        const payload = {
          username: getValues('username'),
          first_name: getValues('firstName'),
          last_name: getValues('lastName'),
          date_of_birth: [splitDateOfBirth[2], splitDateOfBirth[0], splitDateOfBirth[1]].join('-'),
          referral_code: getValues('referalCode'),
          interests: selectedInterests.join(','),
          avatar,
        }

        const res = await api.postConfirmAccount(payload)
        const data = res?.data

        if (data === 'OK') {
          const [getProfileRes, getLifetimeInfoRes] = await Promise.all([api.getProfile(), api.getLifetimeInfo()])

          const newUser = { ...user, profile: getProfileRes.data?.customer, lifetimeInfo: getLifetimeInfoRes.data } as UserType
          setUser(newUser)
          setConfirmationError('')
        } else {
          setConfirmationError('An error occurred while setting up your account')
          return
        }
      } catch (error) {
        setConfirmationError('An error occurred while setting up your account')
        return
      }
    }

    clearErrors()
    setCurrentStep(step)
  }

  const handleInterestTrigger = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest)
      } else {
        clearErrors('interests')
        return [...prev, interest]
      }
    })
  }

  const handleFreeTrial = async () => {
    const res = await api.getAvailableAttributes()
    const data = res.data

    if (user) {
      const newUser = { ...user, companionAttributes: data?.attributes }
      setUser(newUser)
    }

    router.push('/friend')
  }

  return (
    <View className='min-h-fit items-center base:py-[48px] phone:py-[70px]' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      <Logo theme={theme} width={140} height={27} className='mb-[50px]' />

      {/* Header */}
      <View className='py-[40px]'>
        <Text className='font-[600] text-center' size='3xl' color='grey1_light1'>
          {currentStep === 0 ? 'Thank you for signing up!' : currentStep === 1 ? 'Please choose your interests.' : `You're all set to start your free trial!`}
        </Text>
        <Text className='mt-[16] text-center' size='md' color='grey2_light3'>
          {currentStep === 0 ? 'A few more steps and you will be ready to start meeting your new friend.' : currentStep === 1 ? 'We will use this to tailor your experience.' : `It's free for 20 minutes of use and then just $7.00/month.`}
        </Text>
      </View>
      {/* Header - END */}

      <View className='items-center'>
        {/* Avatar */}
        {currentStep === 0 ? (
          <View className='w-[128px] h-[128px] relative'>
            <View className='w-[128px] h-[128px] items-center justify-center border-[1px] rounded-[999999px] relative overflow-hidden' style={theme === 'light' ? { backgroundColor: themeVars.colors.grey6, borderColor: 'transparent' } : { borderColor: themeVars.colors.dark4 }}>
              <View className='w-[128px] h-[128px] absoulte top-0 bottom-0 left-0 right-0 m-auto border-[8px] z-[1] rounded-[999999px]' style={{ borderColor: theme === 'light' ? themeVars.colors.grey6 : getThemeBackground({ theme, breakpoints, background: 'primary' }) }}></View>

              {/* Profile picture */}
              {preview ? (
                Platform.OS === 'web' ? (
                  <img src={preview} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
                ) : (
                  <Image source={{ uri: preview }} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
                )
              ) : (
                <IconUser width={140} height={140} color={theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.dark4} className='absolute top-[20px]' />
              )}
            </View>
            {/* Profile picture - END */}

            {/* Hidden input */}
            {Platform.OS === 'web' && <input ref={fileInputRef} type='file' accept='image/*' style={{ display: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 11, borderRadius: '99999px' }} onChange={handleWebImageChange} />}
            {/* Hidden input - END */}

            {/* Pencil icon */}
            <Pressable
              onPress={handleImageChangePress}
              className='w-[38px] h-[38px] items-center justify-center rounded-[9999999px] border-[4px] absolute bottom-0 right-0 z-[2]'
              style={theme === 'light' ? { backgroundColor: themeVars.colors.grey1, borderColor: themeVars.colors.grey1 } : { backgroundColor: themeVars.colors.purple1, borderColor: getThemeBackground({ theme, breakpoints, background: 'primary' }) }}
            >
              <IconPencil style={{ transform: 'scale(0.9)' }} />
            </Pressable>
            {/* Pencil icon - END */}

            {/* Hidden overlay */}
            <Pressable style={{ opacity: 0, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 11, borderRadius: '99999px', backgroundColor: 'red' }} onPress={handleImageChangePress}></Pressable>
            {/* Hidden overlay - END */}
          </View>
        ) : (
          <></>
        )}
        {/* Avatar - END */}

        {/* Form */}
        <View className='base:w-[310px] phone:w-[440px] gap-[24px] mt-[24px]'>
          {currentStep === 0 ? (
            <>
              <View className='gap-[8px]'>
                <Text className='ml-[8px] font-[500]' size='md' color='grey1_light1'>
                  Username
                </Text>
                <Controller
                  control={control}
                  name='username'
                  rules={{ required: { value: true, message: 'Invalid username' }, minLength: { value: 4, message: 'Username must be at least 4 characters long' }, maxLength: { value: 20, message: 'Username must be at most 20 characters long' } }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                      background='input2'
                      color='input2'
                      placeholderColor='input2Placeholder'
                      border='input2'
                      borderFocus='input2Focus'
                      placeholder='Username'
                      autoComplete='username'
                      value={value}
                      onChangeText={(text) => {
                        onChange(text)
                        trigger('username')
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors?.username?.message ? <Text className='text-red1'>{errors?.username?.message}</Text> : null}
              </View>

              <View className='gap-[8px]'>
                <Text className='ml-[8px] font-[500]' size='md' color='grey1_light1'>
                  First name
                </Text>
                <Controller
                  control={control}
                  name='firstName'
                  rules={{ required: { value: true, message: 'Invalid first name' }, minLength: { value: 1, message: 'First name must be at least 1 characters long' }, maxLength: { value: 20, message: 'First name must be at most 20 characters long' } }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                      background='input2'
                      color='input2'
                      placeholderColor='input2Placeholder'
                      border='input2'
                      borderFocus='input2Focus'
                      placeholder='First name'
                      autoComplete='name-given'
                      value={value}
                      onChangeText={(text) => {
                        onChange(text)
                        trigger('firstName')
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors?.firstName?.message ? <Text className='text-red1'>{errors?.firstName?.message}</Text> : null}
              </View>

              <View className='gap-[8px]'>
                <Text className='ml-[8px] font-[500]' size='md' color='grey1_light1'>
                  Last name
                </Text>
                <Controller
                  control={control}
                  name='lastName'
                  rules={{ required: { value: true, message: 'Invalid last name' }, minLength: { value: 1, message: 'Last name must be at least 1 characters long' }, maxLength: { value: 20, message: 'Last name must be at most 20 characters long' } }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                      background='input2'
                      color='input2'
                      placeholderColor='input2Placeholder'
                      border='input2'
                      borderFocus='input2Focus'
                      placeholder='Last name'
                      autoComplete='name-family'
                      value={value}
                      onChangeText={(text) => {
                        onChange(text)
                        trigger('lastName')
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors?.lastName?.message ? <Text className='text-red1'>{errors?.lastName?.message}</Text> : null}
              </View>

              <View className='gap-[8px]'>
                <Text className='ml-[8px] font-[500]' size='md' color='grey1_light1'>
                  Date of birth
                </Text>
                <Controller
                  control={control}
                  name='dateOfBirth'
                  rules={{
                    required: { value: true, message: 'Birthdate is required' },
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
                      message: 'Birthdate is invalid (correct format: MM/DD/YYYY)',
                    },
                    validate: (value) => {
                      if (!value) return true
                      const [month, day, year] = value.split('/').map(Number)
                      const birthDate = new Date(year, month - 1, day)
                      const today = new Date()
                      const age = today.getFullYear() - birthDate.getFullYear()
                      const m = today.getMonth() - birthDate.getMonth()
                      const d = today.getDate() - birthDate.getDate()
                      if (age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)))) {
                        return true
                      }
                      return 'You must be at least 18 years old'
                    },
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                      background='input2'
                      color='input2'
                      placeholderColor='input2Placeholder'
                      border='input2'
                      borderFocus='input2Focus'
                      placeholder='MM/DD/YYYY'
                      autoComplete='birthdate-full'
                      value={value}
                      onChangeText={(text) => {
                        let cleaned = text.replace(/\D/g, '')

                        if (cleaned.length > 2 && cleaned.length <= 4) {
                          cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
                        } else if (cleaned.length > 4) {
                          cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
                        }

                        onChange(cleaned)
                        trigger('dateOfBirth')
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors?.dateOfBirth?.message ? <Text className='text-red1'>{errors?.dateOfBirth?.message}</Text> : null}
              </View>

              <View className='gap-[8px]'>
                <Text className='ml-[8px] font-[500]' size='md' color='grey1_light1'>
                  Referral code
                </Text>
                <Controller
                  control={control}
                  name='referalCode'
                  rules={{
                    required: false,
                    validate: (value) => {
                      if (value !== '' && !/^[0-9A-Z]{6}$/.test(value)) {
                        return 'Invalid referral code'
                      }
                      return true
                    },
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                      background='input2'
                      color='input2'
                      placeholderColor='input2Placeholder'
                      border='input2'
                      borderFocus='input2Focus'
                      placeholder='Referral code'
                      value={value}
                      onChangeText={(text) => {
                        onChange(text)
                        trigger('referalCode')
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors?.referalCode?.message ? <Text className='text-red1'>{errors?.referalCode?.message}</Text> : null}
              </View>
            </>
          ) : currentStep === 1 ? (
            <View className='flex-col gap-[4px] items-center'>
              <View className='w-[100%] flex flex-row flex-wrap justify-center gap-[8px]'>
                {Object.entries(user?.interests ?? {}).map(([key, value]) => {
                  const isSelected = selectedInterests.includes(key)

                  return (
                    <GradientPressable
                      key={key}
                      type={isSelected ? 'selected' : 'secondary'}
                      className='w-[fit-content] h-[36px] items-center justicy-center rounded-[99999px]'
                      combinedClassname='w-[fit-content]'
                      onPress={() => {
                        handleInterestTrigger(key)
                      }}
                    >
                      <Text size='lg' color='grey2_light3' style={isSelected ? { color: themeVars.colors.white } : {}}>
                        {value}
                      </Text>
                    </GradientPressable>
                  )
                })}
              </View>
              {errors?.interests?.message ? <Text className='text-red1'>{errors?.interests?.message}</Text> : null}
              {confirmationError ? <Text className='text-red1'>{confirmationError}</Text> : null}
            </View>
          ) : (
            <></>
          )}

          {currentStep < 2 ? (
            <View className='gap-[16px]'>
              <GradientPressable
                type='primary'
                className='h-[48px] items-center justicy-center rounded-[99999px]'
                onPress={() => {
                  onStepChange({ step: currentStep + 1 })
                }}
              >
                <Text className='font-[600]' size='md' color='white_light2'>
                  {currentStep === 0 ? 'Continue' : 'Get Started'}
                </Text>
              </GradientPressable>

              {currentStep === 1 ? (
                <GradientPressable
                  type='dark'
                  className='h-[48px] items-center justicy-center rounded-[99999px]'
                  onPress={() => {
                    onStepChange({ step: 0 })
                  }}
                >
                  <Text className='text-light2 font-[600]' size='md' color='grey1_light2'>
                    Back
                  </Text>
                </GradientPressable>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <View className='w-[100%] flex gap-[32px] items-center'>
              <GradientPressable type='primary' className='h-[48px] items-center justicy-center rounded-[99999px]' combinedStyle={{ width: '100%' }} onPress={handleFreeTrial}>
                <Text className='font-[600]' size='md' color='white_light2'>
                  Start free trial
                </Text>
              </GradientPressable>

              <Text size='md' color='grey1_light1'>
                or
              </Text>

              <Subscription />
            </View>
          )}
        </View>
        {/* Form - END */}
      </View>
    </View>
  )
}
