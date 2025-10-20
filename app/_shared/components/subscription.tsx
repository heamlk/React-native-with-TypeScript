import { useState } from 'react'
import { Pressable, View, Text, getThemeBackground, GradientPressable } from '@/app/_shared/components/reusable'
import IconCheckGreen from '@/app/_assets/icons/check-green.svg'
import { useTheme } from '@/app/_context/theme'
import useBreakpoints from '@/app/_hooks/breakpoints'

export default function Subscription() {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  const [selectedSubscription, setSelectedSubscription] = useState(0)

  return (
    <View className='w-[100%] p-[24px] border-[1px] rounded-sm' border='grey5_dark3' background='grey6_dark7'>
      <View className='gap-[16px]'>
        <View className='flex-row items-center gap-[10px]'>
          <Pressable
            className='w-[16px] h-[16px] rounded-[9999px] border-[1px] cursor-pointer'
            style={{ borderColor: getThemeBackground({ theme, breakpoints, background: 'button' }), backgroundColor: selectedSubscription === 0 ? getThemeBackground({ theme, breakpoints, background: 'button' }) : 'transparent' }}
            onPress={() => setSelectedSubscription(0)}
          />
          <Text className='font-[600]' size='xl' color='grey1_light1'>
            $7.00
            <Text size='md' color='grey1_light1'>
              /month
            </Text>
          </Text>
        </View>

        <View className='gap-[8px]'>
          <View className='w-[100%] flex-row items-center justify-between'>
            <Text size='sm' color='grey2_light3'>
              Unlimited Text & upscaled friend image generation
            </Text>
            <IconCheckGreen />
          </View>
          <View className='w-[100%] flex-row items-center justify-between'>
            <Text size='sm' color='grey2_light3'>
              The option to age verify to unlock more capabilities
            </Text>
            <IconCheckGreen />
          </View>
        </View>
      </View>

      <View className='w-[100%] h-[1px] mb-[16px] mt-[20px] border-t-[1px]' border='grey5_dark3'></View>

      <View className='gap-[16px]'>
        <View className='flex-row items-center gap-[10px]'>
          <Pressable
            className='w-[16px] h-[16px] rounded-[9999px] border-[1px] cursor-pointer'
            style={{ borderColor: getThemeBackground({ theme, breakpoints, background: 'button' }), backgroundColor: selectedSubscription === 1 ? getThemeBackground({ theme, breakpoints, background: 'button' }) : 'transparent' }}
            onPress={() => setSelectedSubscription(1)}
          />
          <Text className='font-[600] flex flex-col' size='xl' color='grey1_light1'>
            250 for life
            <Text className='font-[400]' size='sm' color='black_light5'>
              100 are left
            </Text>
          </Text>
        </View>

        <View className='gap-[8px]'>
          <View className='w-[100%] flex-row items-center justify-between'>
            <Text size='sm' color='grey2_light3'>
              Unlimited Text & upscaled friend image generation
            </Text>
            <IconCheckGreen />
          </View>
          <View className='w-[100%] flex-row items-center justify-between'>
            <Text size='sm' color='grey2_light3'>
              The option to age verify to unlock more capabilities
            </Text>
            <IconCheckGreen />
          </View>
        </View>

        <GradientPressable type='dark' className='h-[48px] items-center justicy-center rounded-[99999px]' combinedStyle={{ width: '100%' }}>
          <Text className='font-[600]' size='md' color='grey1_light2'>
            Subscribe
          </Text>
        </GradientPressable>
        <Text className='opacity-70' size='md' color='grey2_light3'>
          Cancel anytime. Plan automatically renews until cancelled.
        </Text>
      </View>
    </View>
  )
}
