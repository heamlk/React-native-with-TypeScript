import { View, Text, Pressable, getThemeBackground, TextInput, GradientPressable, getThemeColor } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import IconUser from '@/app/_assets/icons/user'
import IconPencil from '@/app/_assets/icons/pencil.svg'
import themeVars from '@/app/_styles/theme/themeVars'
import { Platform, Image, ActivityIndicator } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../_context/theme'
import * as ImagePicker from 'expo-image-picker'
import useBreakpoints from '../_hooks/breakpoints'
import { Controller, useForm } from 'react-hook-form'
import { useApi } from '../_context/api'
import { useRouter } from 'expo-router'
import { useUser, type UserType } from '../_context/user'

export default function EditProfilePage() {
  const { theme } = useTheme()
  const { user, setUser } = useUser()
  const router = useRouter()
  const breakpoints = useBreakpoints()
  const api = useApi()

  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [confirmationError, setConfirmationError] = useState('')

  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    control,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { firstName: user?.profile?.first_name || '', lastName: user?.profile?.last_name || '', dateOfBirth: [user?.profile?.date_of_birth?.split('-')?.[1], user?.profile?.date_of_birth?.split('-')?.[2], user?.profile?.date_of_birth?.split('-')?.[0]].join('/') || '', interests: [] },
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

  const handleSaveChanges = async () => {
    const isValid = await trigger()

    if (!isValid) {
      return
    }

    if (selectedInterests.length === 0) {
      setError('interests', { message: 'At least one preference is required' })
      return
    }

    try {
      setSaving(true)
      const splitDateOfBirth = getValues('dateOfBirth').split('/')
      const payload = {
        first_name: getValues('firstName'),
        last_name: getValues('lastName'),
        date_of_birth: [splitDateOfBirth[2], splitDateOfBirth[0], splitDateOfBirth[1]].join('-'),
        interests: selectedInterests.join(','),
        avatar,
      }

      const res = await api.postUpdateProfile(payload)
      const data = res?.data

      setSaving(false)

      if (data === 'OK') {
        const [getProfileRes, getLifetimeInfoRes] = await Promise.all([api.getProfile(), api.getLifetimeInfo()])

        clearErrors()
        setUser((prev) => ({ ...(prev as any), profile: getProfileRes?.data?.customer }))
        router.push('/profile')
        setConfirmationError('')
      } else {
        setConfirmationError('An error occurred while setting up your account')
        return
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    user?.profile?.interests?.forEach((interest) => {
      const selectedInterest = user?.interests[interest]
      if (selectedInterest) {
        handleInterestTrigger(interest)
      }
    })
  }, [])

  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] h-[100%] relative'>
        {saving ? (
          <View className='w-[100%] h-[100%] absolute left-[0px] right-[0px] top-[0px] bottom-[0px] m-auto justify-center gap-[12px]'>
            <Text className='text-center font-[500]' size='3xl' color='grey3_light3'>
              Saving changes...
            </Text>
            <ActivityIndicator color={getThemeColor({ theme, color: 'grey1_purple1' })} size={50} />
          </View>
        ) : (
          <></>
        )}

        {!saving ? (
          <View className='w-[100%] max-w-[440px] h-[100%] mx-auto gap-[24px]'>
            {/* Avatar */}
            <View className='w-[128px] h-[128px] relative mx-auto'>
              <View className='w-[128px] h-[128px] items-center justify-center border-[1px] rounded-[999999px] relative overflow-hidden' style={theme === 'light' ? { backgroundColor: themeVars.colors.grey6, borderColor: 'transparent' } : { borderColor: themeVars.colors.dark4 }}>
                <View className='w-[128px] h-[128px] absoulte top-0 bottom-0 left-0 right-0 m-auto border-[8px] z-[1] rounded-[999999px]' style={{ borderColor: theme === 'light' ? themeVars.colors.grey6 : getThemeBackground({ theme, breakpoints, background: 'primary' }) }}></View>

                {/* Profile picture */}
                {preview || user?.profile?.avatar ? (
                  Platform.OS === 'web' ? (
                    <img src={preview || user?.profile?.avatar} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
                  ) : (
                    <Image source={{ uri: preview || user?.profile?.avatar }} className='w-[128px] h-[128px] object-cover absolute top-0 left-0' />
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
            {/* Avatar - END */}

            {/* Form */}
            <View className='gap-[24px]'>
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
                      className='h-[56px] border-[1px] rounded-[99999px] px-[24px]'
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
                      className='h-[56px] border-[1px] rounded-[99999px] px-[24px]'
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
                      className='h-[56px] border-[1px] rounded-[99999px] px-[24px]'
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
            </View>
            {/* Form - END */}

            {/* Interests */}
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
            {/* Interests - END */}

            <GradientPressable type='primary' combinedClassname='w-[100%] h-[48px] items-center justify-center' onPress={handleSaveChanges}>
              <Text className='font-[600] text-white' size='md'>
                Save Changes
              </Text>
            </GradientPressable>
          </View>
        ) : (
          <></>
        )}
      </View>
    </AuthenticatedLayout>
  )
}
