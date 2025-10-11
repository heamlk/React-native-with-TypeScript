import { Pressable, Text, View } from '@/app/_shared/components/reusable'
import { Image } from 'react-native'
import ImageBackground from '@/app/_assets/images/background.jpg'

export type Step0Props = {
  containerWidth: number
  containerHeight: number
}

export default function Step0({ containerWidth, containerHeight }: Step0Props) {
  return (
    <View className='relative p-[25px]' style={{ cursor: 'auto', width: containerWidth, height: containerHeight }}>
      <Image source={ImageBackground} className='absolute top-[0] left-[0] base:rounded-[0px] phone:rounded-lg' resizeMode='cover' style={{ cursor: 'auto', width: containerWidth, height: containerHeight }} />
    </View>
  )
}
