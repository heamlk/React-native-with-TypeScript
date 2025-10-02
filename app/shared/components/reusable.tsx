import useBreakpoints from '@/app/hooks/breakpoints'
import themeVars from '@/app/styles/theme/themeVars'
import { Text as RNText, TextProps } from 'react-native'
import { fontSizeNative } from '@/app/styles/theme/fontSize'

export type CustomTextProps = TextProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function Text({ size = 'md', style, ...props }: CustomTextProps) {
  const breakpoints = useBreakpoints()

  const responsiveSizes = {
    xs: breakpoints === 'phone' ? fontSizeNative.xs : breakpoints === 'tablet' ? fontSizeNative.xs : fontSizeNative.xs,
    sm: breakpoints === 'phone' ? fontSizeNative.sm : breakpoints === 'tablet' ? fontSizeNative.sm : fontSizeNative.sm,
    md: breakpoints === 'phone' ? fontSizeNative.md : breakpoints === 'tablet' ? fontSizeNative.md : fontSizeNative.md,
    lg: breakpoints === 'phone' ? fontSizeNative.lg : breakpoints === 'tablet' ? fontSizeNative.lg : fontSizeNative.lg,
    xl: breakpoints === 'phone' ? fontSizeNative.xl : breakpoints === 'tablet' ? fontSizeNative.xl : fontSizeNative.xl,
    '2xl': breakpoints === 'phone' ? fontSizeNative.lg : breakpoints === 'tablet' ? fontSizeNative.xl : fontSizeNative['2xl'],
  }

  return <RNText {...props} style={[{ fontFamily: themeVars.fonts.dosis, fontSize: responsiveSizes[size] }, style]} />
}

export default function Blank() {}
