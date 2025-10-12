import type { ThemeType } from '@/app/_context/theme'
import svgIconDefaultProps, { type SvgIconType } from './_props'
import themeVars from '@/app/_styles/theme/themeVars'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, theme, ...props }: SvgIconType & { theme: ThemeType }) => (
  <svg {...props} width={width} height={height} fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke={theme === 'light' ? themeVars.colors.grey2 : themeVars.colors.purple3}>
    <path stroke-linecap='round' stroke-linejoin='round' d='M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6'></path>
  </svg>
)

export default SvgComponent
