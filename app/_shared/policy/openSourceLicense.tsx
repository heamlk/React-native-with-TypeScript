import { Pressable, View, Text } from '../components/reusable'
import * as Linking from 'expo-linking'

export default function OpenSourceLicense() {
  return (
    <View className='w-full h-fit gap-[24px]'>
      <Text size='2xl' color='grey1_light1' className='font-[500]'>
        Open Source Licenses
      </Text>

      <View className='gap-[4px]'>
        <View className='flex-row'>
          <Pressable onPress={() => Linking.openURL('https://github.com/comfyanonymous/ComfyUI/')}>
            <Text size='md' color='yellow1_purple3'>
              ComfyUI - Workflow tool
            </Text>
          </Pressable>
          <Text size='md' color='grey1_light1'>
            {' '}
            -{' '}
          </Text>
          <Pressable onPress={() => Linking.openURL('https://github.com/comfyanonymous/ComfyUI/blob/master/LICENSE')}>
            <Text size='md' color='yellow1_purple3'>
              License
            </Text>
          </Pressable>
        </View>

        <View className='flex-row'>
          <Pressable onPress={() => Linking.openURL('https://github.com/Gourieff/comfyui-reactor-node')}>
            <Text size='md' color='yellow1_purple3'>
              ComfyUI - Reactor Face Swap
            </Text>
          </Pressable>
          <Text size='md' color='grey1_light1'>
            {' '}
            -{' '}
          </Text>
          <Pressable onPress={() => Linking.openURL('https://github.com/Gourieff/comfyui-reactor-node?tab=GPL-3.0-1-ov-file')}>
            <Text size='md' color='yellow1_purple3'>
              License
            </Text>
          </Pressable>
        </View>

        <View className='flex-row'>
          <Pressable onPress={() => Linking.openURL('https://github.com/kijai/ComfyUI-LivePortraitKJ')}>
            <Text size='md' color='yellow1_purple3'>
              ComfyUI - LivePortraitKJ
            </Text>
          </Pressable>
          <Text size='md' color='grey1_light1'>
            {' '}
            -{' '}
          </Text>
          <Pressable onPress={() => Linking.openURL('https://github.com/kijai/ComfyUI-LivePortraitKJ?tab=MIT-1-ov-file#readme')}>
            <Text size='md' color='yellow1_purple3'>
              License
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
