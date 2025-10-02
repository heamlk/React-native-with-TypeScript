import { breakpointsNative } from '../styles/theme/breakpoints'
import useDimensions from './dimensions'

export default function useBreakpoints() {
  const { deviceWidth } = useDimensions()

  if (deviceWidth < breakpointsNative.phone) return 'phone'
  if (deviceWidth < breakpointsNative.tablet) return 'tablet'
  return 'desktop'
}
