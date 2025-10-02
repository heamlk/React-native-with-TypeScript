import { View } from 'react-native'
import { Text } from '../components/reusable'

export default function Licenses() {
  return (
    <View className='gap-[24px]'>
      <Text className='text-[32px] text-white'>Open Source Licenses</Text>

      <Text className='text-[18px] text-white'>
        <ul>
          <li>
            <a href='https://github.com/comfyanonymous/ComfyUI/' target='_blank'>
              ComfyUI - Workflow tool
            </a>
            -&nbsp;<a href='https://github.com/comfyanonymous/ComfyUI/blob/master/LICENSE'>License</a>
          </li>
          <li>
            <a href='https://github.com/Gourieff/comfyui-reactor-node'>ComfyUI - Reactor Face Swap</a> - <a href='https://github.com/Gourieff/comfyui-reactor-node?tab=GPL-3.0-1-ov-file'>License</a>
          </li>
          <li>
            <a href='https://github.com/kijai/ComfyUI-LivePortraitKJ'>ComfyUI - LivePortraitKJ</a> - <a href='https://github.com/kijai/ComfyUI-LivePortraitKJ?tab=MIT-1-ov-file#readme'>License</a>
          </li>
        </ul>
      </Text>
    </View>
  )
}
