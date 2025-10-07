import { useTheme } from './context/theme'
import useBreakpoints from './hooks/breakpoints'
import useDimensions from './hooks/dimensions'
import { View, Text, Pressable, TextInput, Logo, getThemeBackground, getThemeColor, GradientPressable } from './shared/components/reusable'
import IconUser from '@/app/assets/icons/user'
import IconPencil from '@/app/assets/icons/pencil.svg'
import themeVars from './styles/theme/themeVars'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { useAuth } from './context/auth'

export default function Onboarding() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const dimentions = useDimensions()
  const breakpoints = useBreakpoints()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

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

  const onSubmit = (data: any) => {
    console.log('onSubmit')
    // console.log(data)
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

    clearErrors()
    setCurrentStep(step)
  }

  const handleAvatarUpload = () => {
    console.log('handleAvatarUpload')
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

  return (
    <View className='min-h-fit items-center base:py-[70px] phone:py-[85px]' style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }}>
      <Logo theme={theme} width={140} height={27} className='mb-[50px]' />

      {/* Header */}
      <View className='py-[40px]'>
        <Text className='font-[600] text-center' size='3xl' color='light1'>
          {currentStep === 0 ? 'Thank you for signing up!' : 'Please choose your interests.'}
        </Text>
        <Text className='mt-[16] text-center' size='md' color='light3'>
          {currentStep === 0 ? 'A few more steps and you will be ready to start meeting your new friend.' : 'We will use this to tailor your experience.'}
        </Text>
      </View>
      {/* Header - END */}

      <View className='items-center'>
        {/* Avatar */}
        {currentStep === 0 ? (
          <View className='w-[128px] h-[128px] relative'>
            <View className='w-[128px] h-[128px] items-center justify-center border-[1px] rounded-[999999px] relative overflow-hidden' style={theme === 'light' ? { backgroundColor: themeVars.colors.grey6, borderColor: 'transparent' } : { borderColor: themeVars.colors.dark4 }}>
              <IconUser width={140} height={140} color={theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.dark4} className='absolute top-[20px]' />
              <Pressable className='w-[128px] h-[128px] absoulte top-0 bottom-0 left-0 right-0 m-auto border-[8px] z-[1] rounded-[999999px]' style={{ borderColor: theme === 'light' ? themeVars.colors.grey6 : getThemeBackground({ theme, breakpoints, background: 'primary' }) }} onPress={handleAvatarUpload}></Pressable>
            </View>

            <View
              className='w-[38px] h-[38px] items-center justify-center rounded-[9999999px] border-[4px] absolute bottom-0 right-0 z-[2]'
              style={theme === 'light' ? { backgroundColor: themeVars.colors.grey1, borderColor: themeVars.colors.grey1 } : { backgroundColor: themeVars.colors.purple1, borderColor: getThemeBackground({ theme, breakpoints, background: 'primary' }) }}
            >
              <IconPencil style={{ transform: 'scale(0.9)' }} />
            </View>
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
                <Text className='ml-[8px] font-[500]' size='md' color='light1'>
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
                <Text className='ml-[8px] font-[500]' size='md' color='light1'>
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
                <Text className='ml-[8px] font-[500]' size='md' color='light1'>
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
                <Text className='ml-[8px] font-[500]' size='md' color='light1'>
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
                <Text className='ml-[8px] font-[500]' size='md' color='light1'>
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
            <View className='w-[100%] flex flex-row flex-wrap justify-center gap-[8px]'>
              {Object.entries(user?.interests ?? {}).map(([key, value]) => {
                return (
                  <GradientPressable
                    key={key}
                    type={selectedInterests.includes(key) ? 'selected' : 'secondary'}
                    className='w-[fit-content] h-[36px] items-center justicy-center rounded-[99999px]'
                    combinedClassname='w-[fit-content]'
                    onPress={() => {
                      handleInterestTrigger(key)
                    }}
                  >
                    <Text size='lg' color='light3'>
                      {value}
                    </Text>
                  </GradientPressable>
                )
              })}
              {errors?.interests?.message ? <Text className='text-red1'>{errors?.interests?.message}</Text> : null}
            </View>
          ) : (
            <></>
          )}

          <View className='gap-[16px]'>
            <GradientPressable
              type='primary'
              className='h-[48px] items-center justicy-center rounded-[99999px]'
              onPress={() => {
                onStepChange({ step: currentStep + 1 })
              }}
            >
              <Text className='text-md text-light2 font-[600]'>{currentStep === 0 ? 'Continue' : 'Get Started'}</Text>
            </GradientPressable>

            {currentStep === 1 ? (
              <GradientPressable
                type='dark'
                className='h-[48px] items-center justicy-center rounded-[99999px]'
                onPress={() => {
                  onStepChange({ step: 0 })
                }}
              >
                <Text className='text-md text-light2 font-[600]'>Back</Text>
              </GradientPressable>
            ) : (
              <></>
            )}
          </View>
        </View>
        {/* Form - END */}
      </View>
    </View>
  )
}
