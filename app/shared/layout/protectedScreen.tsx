import useDimensions from '@/app/hooks/dimensions'
import { View } from '../components/reusable'
import { ReactNode } from 'react'

export default function ProtectedScreen({ children }: { children: ReactNode }) {
  const dimentions = useDimensions()

  return (
    <View style={{ width: dimentions.deviceWidth, height: dimentions.deviceHeight }} background='primary'>
      {children}
    </View>
  )
}
