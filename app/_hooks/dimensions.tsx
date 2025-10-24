import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export default function useDimensions() {
  const [dimensions, setDimensions] = useState({
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        deviceWidth: window.width,
        deviceHeight: window.height,
      })
    })

    return () => {
      subscription?.remove?.()
    }
  }, [])

  return dimensions
}
