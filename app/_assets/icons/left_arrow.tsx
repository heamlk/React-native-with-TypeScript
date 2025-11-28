import type { ThemeType } from '@/app/_context/theme'
import svgIconDefaultProps, { type SvgIconType } from './_props'
import themeVars from '@/app/_styles/theme/themeVars'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, theme, ...props }: SvgIconType & { theme: ThemeType }) => (
  <Svg {...props} width={width} height={height} fill='none' viewBox='0 0 24 24' strokeWidth='2.5' stroke={theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple1}>
    <Path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5'></Path>
  </Svg>
)

export default SvgComponent