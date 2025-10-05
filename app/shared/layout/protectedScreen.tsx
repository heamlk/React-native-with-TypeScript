import useDimensions from '@/app/hooks/dimensions'
import { View } from '../components/reusable'

export default function ProtectedScreen() {
  const dimentions = useDimensions()

  return <View style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }} background='primary'></View>
}
