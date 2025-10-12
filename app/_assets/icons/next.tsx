import type { ThemeType } from '@/app/_context/theme'
import svgIconDefaultProps, { type SvgIconType } from './_props'
import themeVars from '@/app/_styles/theme/themeVars'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, theme, ...props }: SvgIconType & { theme: ThemeType }) => (
  <svg {...props} width={width} height={height} fill='none' viewBox='0 0 24 24' strokeWidth='2.5' stroke={theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple1}>
    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5'></path>
  </svg>
)

export default SvgComponent
