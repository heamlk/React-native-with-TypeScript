import type { ThemeType } from '@/app/_context/theme'
import svgIconDefaultProps, { type SvgIconType } from './_props'
import themeVars from '@/app/_styles/theme/themeVars'
import Svg, { Path, Circle } from 'react-native-svg'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, theme, ...props }: SvgIconType & { theme?: ThemeType }) => {
  const iconColor = color || (theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple1)
  
  return (
    <Svg {...props} width={width} height={height} viewBox='0 0 24 24' fill='none'>
      {/* Circular refresh arrow - modern design */}
      <Path
        d='M4 12a8 8 0 0 1 8-8V2l4 4-4 4V8a6 6 0 1 0 6 6h2a8 8 0 0 1-16 0z'
        stroke={iconColor}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      {/* Arrow head */}
      <Path
        d='M8 4l4 4-4 4'
        stroke={iconColor}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      {/* Energy sparkles */}
      <Circle cx='18' cy='6' r='1' fill={iconColor} opacity='0.8' />
      <Circle cx='6' cy='18' r='0.8' fill={iconColor} opacity='0.6' />
    </Svg>
  )
}

export default SvgComponent
