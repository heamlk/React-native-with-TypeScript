import { Text, View } from '@/app/_shared/components/reusable'
import Soul from '@/app/_shared/components/Soul'
import type { Dispatch, SetStateAction } from 'react'

export type Step1Props = {
  blurActive: boolean
  setBlurActive: Dispatch<SetStateAction<boolean>>
}

export default function Step1({ blurActive, setBlurActive }: Step1Props) {
  return (
    <View className='gap-[30]'>
      <Text className='mx-auto text-center' size='lg' color='grey1_light1'>
        Perfect, now let’s see what I should act and look like!
      </Text>
      <View className='flex-row justify-around'>
        {/* Soul */}
        <View className='w-[500px] h-[500px] items-center justify-center rounded-md' background='grey3_dark1'>
          <Soul width={200} height={200} soulSize={200} />
        </View>
        {/* Soul - END */}

        {/* Form */}
        <View className='gap-[40px]'>
          <Text size='xl'>Hi, I am from the universe.</Text>
        </View>
        {/* Form - END */}
      </View>
    </View>
  )
}
