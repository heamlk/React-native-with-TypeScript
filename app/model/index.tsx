import { useEffect, useState } from 'react'
import { View, Text, Pressable, GradientPressable, TextInput } from '../_shared/components/reusable'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { useForm, Controller } from 'react-hook-form'
import { useApi } from '../_context/api'
import type { OwnModelParams } from '../_context/auth.types'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SubscriptionPage() {
  const insets = useSafeAreaInsets()
  const api = useApi()
  const router = useRouter()

  const [modelData, setModelData] = useState<OwnModelParams | null>(null)
  const [activeModel, setActiveModel] = useState<'bffl' | 'chatgpt' | 'claude' | 'gemini' | 'grok'>(modelData?.selected || 'bffl')
  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { chatgpt: modelData?.chatgpt_api_key, claude: modelData?.claude_api_key, gemini: modelData?.gemini_api_key, grok: modelData?.grok_api_key },
    reValidateMode: 'onChange',
  })

  const handleSave = async () => {
    setIsSaving(true)
    const selectedModel = activeModel
    const req = await api.postOwnModel({
      selected: selectedModel,
      chatgpt_api_key: getValues('chatgpt') || '',
      claude_api_key: getValues('claude') || '',
      gemini_api_key: getValues('gemini') || '',
      grok_api_key: getValues('grok') || '',
    })
    const data = req?.data
    setIsSaving(false)

    if (data === 'OK') {
      router.push('/profile')
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const req = await api.getOwnModel()
      const data = req?.data

      setModelData(data)
      reset({
        chatgpt: data?.chatgpt_api_key || '',
        claude: data?.claude_api_key || '',
        gemini: data?.gemini_api_key || '',
        grok: data?.grok_api_key || '',
      })
    }

    fetch()
  }, [])

  return (
    <AuthenticatedLayout keepMarginsOnMobile={true} keepSafePaddingOnMobile={true}>
      <View className='w-[100%] max-w-[440px] mx-auto gap-[32px]' style={{ paddingBottom: insets.bottom + 25 }}>
        <View className='gap-[16px]'>
          <Text className='font-[600] text-center' size='3xl' color='grey1_light1'>
            Bring your own model
          </Text>
          <Text className='font-[600] text-center' size='sm' color='grey3_light3'>
            Fill your API keys to use your own models.
          </Text>
        </View>

        <View className='gap-[24px]'>
          <Pressable className='flex-row self-start gap-[6px]' onPress={() => setActiveModel('bffl')}>
            <GradientPressable combinedClassname='w-[16px] h-[16px] rounded-[99999]' type={activeModel === 'bffl' ? 'primary' : 'dark'} style={activeModel === 'bffl' ? {} : {}}></GradientPressable>
            <Text size='md' color='grey1_light1'>
              BFFL Model
            </Text>
          </Pressable>

          <View className='gap-[10px]'>
            <Pressable className='flex-row self-start gap-[6px]' onPress={() => setActiveModel('chatgpt')}>
              <GradientPressable combinedClassname='w-[16px] h-[16px] rounded-[99999]' type={activeModel === 'chatgpt' ? 'primary' : 'dark'} style={activeModel === 'chatgpt' ? {} : {}}></GradientPressable>
              <Text size='md' color='grey1_light1'>
                ChatGPT
              </Text>
            </Pressable>
            <Controller
              control={control}
              name='chatgpt'
              rules={{ required: { value: true, message: 'An API key is required to select this model' } }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='gap-[6px]'>
                  <TextInput
                    className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                    background='input2'
                    color='input2'
                    placeholderColor='input2Placeholder'
                    border='input2'
                    borderFocus='input2Focus'
                    placeholder='API Key'
                    value={value}
                    onChangeText={(text) => {
                      onChange(text)
                      trigger('chatgpt')
                    }}
                    onBlur={onBlur}
                  />
                  {errors?.chatgpt?.message ? <Text className='text-red1'>{errors?.chatgpt?.message}</Text> : null}
                </View>
              )}
            />
          </View>

          <View className='gap-[10px]'>
            <Pressable className='flex-row self-start gap-[6px]' onPress={() => setActiveModel('claude')}>
              <GradientPressable combinedClassname='w-[16px] h-[16px] rounded-[99999]' type={activeModel === 'claude' ? 'primary' : 'dark'} style={activeModel === 'claude' ? {} : {}}></GradientPressable>
              <Text size='md' color='grey1_light1'>
                Claude
              </Text>
            </Pressable>
            <Controller
              control={control}
              name='claude'
              rules={{ required: { value: true, message: 'An API key is required to select this model' } }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='gap-[6px]'>
                  <TextInput
                    className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                    background='input2'
                    color='input2'
                    placeholderColor='input2Placeholder'
                    border='input2'
                    borderFocus='input2Focus'
                    placeholder='API Key'
                    value={value}
                    onChangeText={(text) => {
                      onChange(text)
                      trigger('claude')
                    }}
                    onBlur={onBlur}
                  />
                  {errors?.claude?.message ? <Text className='text-red1'>{errors?.claude?.message}</Text> : null}
                </View>
              )}
            />
          </View>

          <View className='gap-[10px]'>
            <Pressable className='flex-row self-start gap-[6px]' onPress={() => setActiveModel('gemini')}>
              <GradientPressable combinedClassname='w-[16px] h-[16px] rounded-[99999]' type={activeModel === 'gemini' ? 'primary' : 'dark'} style={activeModel === 'gemini' ? {} : {}}></GradientPressable>
              <Text size='md' color='grey1_light1'>
                Gemini
              </Text>
            </Pressable>
            <Controller
              control={control}
              name='gemini'
              rules={{ required: { value: true, message: 'An API key is required to select this model' } }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='gap-[6px]'>
                  <TextInput
                    className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                    background='input2'
                    color='input2'
                    placeholderColor='input2Placeholder'
                    border='input2'
                    borderFocus='input2Focus'
                    placeholder='API Key'
                    value={value}
                    onChangeText={(text) => {
                      onChange(text)
                      trigger('gemini')
                    }}
                    onBlur={onBlur}
                  />
                  {errors?.gemini?.message ? <Text className='text-red1'>{errors?.gemini?.message}</Text> : null}
                </View>
              )}
            />
          </View>

          <View className='gap-[10px]'>
            <Pressable className='flex-row self-start gap-[6px]' onPress={() => setActiveModel('grok')}>
              <GradientPressable combinedClassname='w-[16px] h-[16px] rounded-[99999]' type={activeModel === 'grok' ? 'primary' : 'dark'} style={activeModel === 'grok' ? {} : {}}></GradientPressable>
              <Text size='md' color='grey1_light1'>
                Grok
              </Text>
            </Pressable>
            <Controller
              control={control}
              name='grok'
              rules={{ required: { value: true, message: 'An API key is required to select this model' } }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='gap-[6px]'>
                  <TextInput
                    className='h-[56px] border-[2px] rounded-[99999px] px-[24px]'
                    background='input2'
                    color='input2'
                    placeholderColor='input2Placeholder'
                    border='input2'
                    borderFocus='input2Focus'
                    placeholder='API Key'
                    value={value}
                    onChangeText={(text) => {
                      onChange(text)
                      trigger('grok')
                    }}
                    onBlur={onBlur}
                  />
                  {errors?.grok?.message ? <Text className='text-red1'>{errors?.grok?.message}</Text> : null}
                </View>
              )}
            />
          </View>
        </View>

        <GradientPressable combinedClassname='h-[48px]' type='primary' onPress={handleSave} disabled={isSaving}>
          <Text className='font-[600]' size='md' color='light1_light2'>
            Save
          </Text>
        </GradientPressable>
      </View>
    </AuthenticatedLayout>
  )
}
