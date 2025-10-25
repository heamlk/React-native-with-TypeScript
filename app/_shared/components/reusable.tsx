import useBreakpoints, { type BreakpointsType } from '@/app/_hooks/breakpoints'
import themeVars from '@/app/_styles/theme/themeVars'
import { StyleSheet, Text as RNText, View as RNView, Pressable as RNPressable, TextInput as RNTextInput, type TextProps, type ViewProps, type PressableProps, type TextInputProps, ViewStyle } from 'react-native'
import { fontSizeNative } from '@/app/_styles/theme/fontSize'
import { type ThemeType, useTheme } from '@/app/_context/theme'
import svgIconDefaultProps from '@/app/_assets/icons/_props'
import { useState } from 'react'
import clsx from 'clsx'
import { LinearGradient } from 'expo-linear-gradient'
import { borderRadiusNative } from '@/app/_styles/theme/borderRadius'

// Background
export type GetThemeBackgroundProps = {
  theme: ThemeType
  background:
    | 'primary'
    | 'primaryAuthenticated'
    | 'transparent'
    | 'input'
    | 'input2'
    | 'button'
    | 'buttonOutline'
    | 'green1'
    | 'light1_dark1'
    | 'light1_dark2'
    | 'grey5_dark2'
    | 'grey5_dark3'
    | 'grey5_dark5'
    | 'grey6_transparent'
    | 'grey6_dark6'
    | 'grey6_dark7'
    | 'grey3_dark1'
    | 'grey3_purple3'
    | 'grey6_dark1'
    | 'grey5_purple2/40'
    | 'dark2/60'
    | 'dark6/30'
    | 'black/50_dark1'
    | 'grey6/40_dark6/40'
    | 'transparent_dark1'
  breakpoints: BreakpointsType
}

export const getThemeBackground = ({ theme, background, breakpoints }: GetThemeBackgroundProps) => {
  const backgroundColors = {
    primary: theme === 'light' ? themeVars.colors.light1 : breakpoints === 'phone' ? themeVars.colors.dark1 : themeVars.colors.dark2,
    primaryAuthenticated: theme === 'light' ? themeVars.colors.light1 : breakpoints === 'phone' ? themeVars.colors.dark6 : themeVars.colors.dark5,
    input: theme === 'light' ? themeVars.colors.light1 : themeVars.colors.input,
    input2: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark1,
    button: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.purple1,
    buttonOutline: theme === 'light' ? themeVars.colors.grey5 : 'transparent',

    green1: themeVars.colors.green1,
    light1_dark1: theme === 'light' ? themeVars.colors.light1 : themeVars.colors.dark1,
    light1_dark2: theme === 'light' ? themeVars.colors.light1 : themeVars.colors.dark2,
    grey3_dark1: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.dark1,
    grey3_purple3: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.purple3,
    grey5_dark2: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark2,
    grey5_dark3: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark3,
    grey5_dark5: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark5,
    grey6_dark1: theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark1,
    grey6_dark6: theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark6,
    grey6_dark7: theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark7,
    grey6_transparent: theme === 'light' ? themeVars.colors.grey6 : 'none',
    'dark2/60': themeVars.colors.dark2 + themeVars.colors.opacity60,
    'dark6/30': themeVars.colors.dark6 + themeVars.colors.opacity30,
    'grey5_purple2/40': theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.purple2 + themeVars.colors.opacity40,
    'grey6/40_dark6/40': theme === 'light' ? themeVars.colors.grey6 + themeVars.colors.opacity40 : themeVars.colors.dark6 + themeVars.colors.opacity40,
    'black/50_dark1': theme === 'light' ? themeVars.colors.black + themeVars.colors.opacity50 : themeVars.colors.dark1,
    transparent_dark1: theme === 'light' ? 'transparent' : themeVars.colors.dark1,
    transparent: 'transparent',
  }

  return backgroundColors[background]
}
// Background - END

// Border
export type GetThemeBorderProps = {
  theme: ThemeType
  border: 'form' | 'input2' | 'buttonOutline' | 'input2Focus' | 'grey3_transparent' | 'grey3_dark3' | 'grey4_dark4' | 'grey5_dark3' | 'grey6_dark3' | 'transparent_dark1' | 'transparent_light3' | 'transparent_dark3' | 'transparent_purple2/40' | 'transparent' | 'red1'
}

export const getThemeBorder = ({ theme, border }: GetThemeBorderProps) => {
  const borderColors = {
    form: theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity20,
    buttonOutline: theme === 'light' ? 'transparent' : themeVars.colors.purple1,
    input2: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark4,
    input2Focus: theme === 'light' ? themeVars.colors.grey4 : themeVars.colors.purple3,

    grey3_transparent: theme === 'light' ? themeVars.colors.grey3 : 'transparent',
    grey3_dark3: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.dark3,
    grey4_dark4: theme === 'light' ? themeVars.colors.grey4 : themeVars.colors.dark4,
    grey5_dark3: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.dark3,
    grey6_dark3: theme === 'light' ? themeVars.colors.grey6 : themeVars.colors.dark3,
    transparent_dark1: theme === 'light' ? 'transparent' : themeVars.colors.dark1,
    transparent_light3: theme === 'light' ? 'transparent' : themeVars.colors.light3,
    transparent_dark3: theme === 'light' ? 'transparent' : themeVars.colors.dark3,
    'transparent_purple2/40': theme === 'light' ? 'transparent' : themeVars.colors.purple2 + themeVars.colors.opacity40,
    red1: theme === 'light' ? themeVars.colors.red1 : themeVars.colors.red1,
    transparent: 'transparent',
  }

  return borderColors[border]
}
// Border - END

// Color
export type GetThemeColorProps = {
  theme: ThemeType
  color:
    | 'button'
    | 'buttonOutline'
    | 'input2'
    | 'light1'
    | 'grey1_purple1'
    | 'grey1_purple3'
    | 'grey1_light1'
    | 'white_light2'
    | 'white_light3'
    | 'grey1_light2'
    | 'grey1_light3'
    | 'grey2_light2'
    | 'grey2_light3'
    | 'grey3_light3'
    | 'grey3_purple5'
    | 'grey5_light3'
    | 'black_light5'
    | 'yellow1_purple3'
    | 'light1_light2'
    | 'light1_light3'
    | 'grey2_light3/50'
    | 'red1'
}

export const getThemeColor = ({ theme, color }: GetThemeColorProps) => {
  const colors = {
    button: theme === 'light' ? themeVars.colors.white : themeVars.colors.black,
    buttonOutline: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple1,
    input2: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.light2,

    light1: themeVars.colors.light1,
    white_light2: theme === 'light' ? themeVars.colors.white : themeVars.colors.light2,
    white_light3: theme === 'light' ? themeVars.colors.white : themeVars.colors.light3,
    grey1_purple3: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple3,
    grey1_purple1: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.purple1,
    grey1_light1: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.light1,
    grey1_light2: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.light2,
    grey1_light3: theme === 'light' ? themeVars.colors.grey1 : themeVars.colors.light3,
    grey2_light2: theme === 'light' ? themeVars.colors.grey2 : themeVars.colors.light2,
    grey2_light3: theme === 'light' ? themeVars.colors.grey2 : themeVars.colors.light3,
    grey3_light3: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.light3,
    grey3_purple5: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.purple5,
    grey5_light3: theme === 'light' ? themeVars.colors.grey5 : themeVars.colors.light3,
    black_light5: theme === 'light' ? themeVars.colors.black : themeVars.colors.light5,
    yellow1_purple3: theme === 'light' ? themeVars.colors.yellow1 : themeVars.colors.purple3,
    light1_light2: theme === 'light' ? themeVars.colors.light1 : themeVars.colors.light2,
    light1_light3: theme === 'light' ? themeVars.colors.light1 : themeVars.colors.light3,
    'grey2_light3/50': theme === 'light' ? themeVars.colors.grey2 : themeVars.colors.light3 + themeVars.colors.opacity50,
    red1: theme === 'light' ? themeVars.colors.red1 : themeVars.colors.red1,
  }

  return colors[color]
}
// Color - END

// Placeholder color
export type GetThemePlaceholderColorProps = {
  theme: ThemeType
  placeholderColor: 'input2Placeholder'
}

export const getThemePlaceholderColor = ({ theme, placeholderColor }: GetThemePlaceholderColorProps) => {
  const placeholderColors = {
    input2Placeholder: theme === 'light' ? themeVars.colors.grey3 : themeVars.colors.purple4,
  }

  return placeholderColors[placeholderColor]
}
// Placeholder color - END

// Logo
export type LogoProps = React.SVGProps<SVGSVGElement> & {
  theme: ThemeType
  width?: string | number
  height?: string | number
}

export const Logo = ({ theme, width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, ...props }: LogoProps) => {
  return (
    <svg {...props} width={width} height={height} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#a)'>
        <path
          d='M32.688 13.493a7.736 7.736 0 0 0 1.881-2.591 7.71 7.71 0 0 0 .066-6.102 7.78 7.78 0 0 0-1.704-2.528 7.88 7.88 0 0 0-2.553-1.69 7.951 7.951 0 0 0-3.013-.595h-6.696c-.554 0-1.085.217-1.477.605a2.054 2.054 0 0 0-.612 1.46c0 .548.22 1.074.612 1.461.392.388.923.605 1.477.605h6.696a3.71 3.71 0 0 1 2.609 1.069 3.628 3.628 0 0 1 1.08 2.58c0 .967-.389 1.895-1.08 2.579a3.71 3.71 0 0 1-2.61 1.069H20.67c-.554 0-1.085.217-1.477.605a2.054 2.054 0 0 0 0 2.923c.391.389.922.608 1.477.61h6.696a3.71 3.71 0 0 1 2.604 1.063 3.627 3.627 0 0 1 1.085 2.571c0 .968-.389 1.896-1.08 2.58a3.71 3.71 0 0 1-2.61 1.069H20.67c-.554 0-1.085.217-1.477.605a2.054 2.054 0 0 0-.612 1.46c0 .548.22 1.073.612 1.46.392.388.923.606 1.477.606h6.696a7.92 7.92 0 0 0 5.561-2.28 7.742 7.742 0 0 0 2.306-5.5 7.685 7.685 0 0 0-.67-3.11 7.763 7.763 0 0 0-1.874-2.584Z'
          fill={theme === 'light' ? themeVars.colors.black : themeVars.colors.white}
        />
        <path
          d='M14.475 26.993c-.53 0-1.04-.198-1.426-.556L.662 15.01a2.08 2.08 0 0 1-.67-1.517 2.052 2.052 0 0 1 .67-1.51L13.049.557a2.092 2.092 0 0 1 1.506-.568 2.109 2.109 0 0 1 1.467.66 2.062 2.062 0 0 1 .561 1.481 2.047 2.047 0 0 1-.662 1.44L5.208 13.5l10.747 9.931a2.052 2.052 0 0 1 .067 2.907 2.075 2.075 0 0 1-1.547.655Z'
          fill='#860FEF'
        />
        <path
          d='M39.886 24.405V2.907a2.16 2.16 0 0 1 .604-1.752A2.212 2.212 0 0 1 42.236.49h12.582a1.962 1.962 0 0 1 1.534.506 1.921 1.921 0 0 1 .615 1.48 1.908 1.908 0 0 1-.617 1.478 1.952 1.952 0 0 1-1.532.508H44.587v7.68h9.286a1.874 1.874 0 0 1 1.467.482 1.834 1.834 0 0 1 .589 1.412 1.816 1.816 0 0 1-.61 1.377 1.86 1.86 0 0 1-1.446.464h-9.286v8.508c0 1.536-.878 2.416-2.357 2.416-1.48 0-2.344-.867-2.344-2.396ZM60.074 24.398V2.907a2.163 2.163 0 0 1 .606-1.755A2.212 2.212 0 0 1 62.43.49h12.582a1.962 1.962 0 0 1 1.535.506 1.92 1.92 0 0 1 .614 1.48 1.908 1.908 0 0 1-.617 1.478 1.954 1.954 0 0 1-1.532.508H64.774v7.687h9.287a1.876 1.876 0 0 1 1.466.482 1.834 1.834 0 0 1 .59 1.412 1.818 1.818 0 0 1-.59 1.412 1.858 1.858 0 0 1-1.466.482h-9.287v8.507c0 1.536-.87 2.417-2.35 2.417s-2.35-.927-2.35-2.463ZM80.26 24.087V2.595a2.163 2.163 0 0 1 .607-1.754 2.212 2.212 0 0 1 1.75-.662c1.474 0 2.351.88 2.351 2.416v19.982h10.064a1.976 1.976 0 0 1 1.534.509 1.933 1.933 0 0 1 .622 1.478 1.902 1.902 0 0 1-.615 1.48 1.949 1.949 0 0 1-1.535.506H82.611a2.233 2.233 0 0 1-1.766-.68 2.18 2.18 0 0 1-.584-1.783Z'
          fill={theme === 'light' ? themeVars.colors.black : themeVars.colors.white}
        />
        <path
          d='M100.389 24.107a2.547 2.547 0 0 1 .761-1.843 2.596 2.596 0 0 1 1.864-.753 2.621 2.621 0 0 1 1.85.76 2.542 2.542 0 0 1 .754 1.836 2.55 2.55 0 0 1-1.6 2.403c-.318.13-.66.195-1.004.192a2.617 2.617 0 0 1-1.866-.75 2.55 2.55 0 0 1-.759-1.845ZM109.092 24.663a4.2 4.2 0 0 1 .308-1.424l7.64-20.525c.669-1.734 1.694-2.529 3.408-2.529s2.792.762 3.448 2.51l7.667 20.524c.187.455.291.94.308 1.43a2.136 2.136 0 0 1-.703 1.58 2.208 2.208 0 0 1-1.648.566c-1.279 0-2.008-.576-2.41-1.987l-1.721-4.959h-9.829l-1.728 4.94c-.442 1.403-1.131 1.986-2.357 1.986-1.439.033-2.383-.795-2.383-2.112Zm15.139-8.475-3.757-11.11h-.127l-3.702 11.11h7.586ZM135.293 24.391V2.59c0-1.536.891-2.417 2.35-2.417 1.46 0 2.35.88 2.35 2.417V24.39c0 1.53-.877 2.417-2.356 2.417a2.229 2.229 0 0 1-1.745-.665 2.166 2.166 0 0 1-.599-1.751Z'
          fill='#860FEF'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#ffffff' d='M0 0h140v27H0z' />
        </clipPath>
      </defs>
    </svg>
  )
}
// Logo - END

export type CustomTextProps = TextProps & {
  size?: keyof typeof themeVars.fontSize
  color?: GetThemeColorProps['color'] | null
  background?: GetThemeBackgroundProps['background'] | null
}

export function Text({ size, color = null, background = null, style, className, ...props }: CustomTextProps) {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  const responsiveSizes = {
    xs: breakpoints === 'phone' ? fontSizeNative.xs : breakpoints === 'tablet' ? fontSizeNative.xs : fontSizeNative.xs,
    sm: breakpoints === 'phone' ? fontSizeNative.sm : breakpoints === 'tablet' ? fontSizeNative.sm : fontSizeNative.sm,
    md: breakpoints === 'phone' ? fontSizeNative.md : breakpoints === 'tablet' ? fontSizeNative.md : fontSizeNative.md,
    lg: breakpoints === 'phone' ? fontSizeNative.md : breakpoints === 'tablet' ? fontSizeNative.lg : fontSizeNative.lg,
    xl: breakpoints === 'phone' ? fontSizeNative.xl : breakpoints === 'tablet' ? fontSizeNative.xl : fontSizeNative.xl,
    '2xl': breakpoints === 'phone' ? fontSizeNative.lg : breakpoints === 'tablet' ? fontSizeNative.xl : fontSizeNative['2xl'],
    '3xl': breakpoints === 'phone' ? fontSizeNative.xl : breakpoints === 'tablet' ? fontSizeNative['2xl'] : fontSizeNative['3xl'],
  }

  return (
    <RNText {...props} className={clsx('', className)} style={[{ fontFamily: themeVars.fonts.dosis }, size ? { fontSize: responsiveSizes[size] } : null, color ? { color: getThemeColor({ theme, color }) } : null, background ? { backgroundColor: getThemeBackground({ theme, breakpoints, background }) } : null, style]} />
  )
}

export type CustomViewProps = ViewProps & {
  background?: GetThemeBackgroundProps['background'] | null
  border?: GetThemeBorderProps['border'] | null
}

export function View({ background = null, border = null, style, className, ...props }: CustomViewProps) {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  return <RNView {...props} className={clsx('', className)} style={[{}, background ? { backgroundColor: getThemeBackground({ theme, breakpoints, background }) } : null, border ? { borderColor: getThemeBorder({ theme, border }) } : null, style]} />
}

export type CustomPressableProps = PressableProps & {
  background?: GetThemeBackgroundProps['background'] | null
  hoverBackground?: GetThemeBackgroundProps['background'] | null
  border?: GetThemeBorderProps['border'] | null
}

export function Pressable({ background = null, hoverBackground = null, border = null, style, className, ...props }: CustomPressableProps) {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  const [isHover, setIsHover] = useState(false)

  const handlHoverIn = () => {
    if (!hoverBackground) return
    setIsHover(true)
  }
  const handlHoverOut = () => {
    if (!hoverBackground) return
    setIsHover(false)
  }

  const currentBackground = isHover && hoverBackground ? getThemeBackground({ theme, breakpoints, background: hoverBackground }) : background ? getThemeBackground({ theme, breakpoints, background }) : null
  const currentBorder = border ? { borderColor: getThemeBorder({ theme, border }) } : null

  return <RNPressable {...props} onHoverIn={handlHoverIn} onHoverOut={handlHoverOut} className={clsx('', className)} style={typeof style === 'function' ? style : [{}, currentBackground ? { backgroundColor: currentBackground } : null, currentBorder, style]} />
}

export type CustomGradientPressableProps = PressableProps & {
  type: 'primary' | 'secondary' | 'dark' | 'extraDark' | 'selected'
  combinedStyle?: ViewStyle
  gradientClassname?: string
  combinedClassname?: string
  isPressable?: boolean
}

export function GradientPressable({ type, style, combinedStyle, gradientClassname, combinedClassname, className, isPressable = true, ...props }: CustomGradientPressableProps) {
  const { theme } = useTheme()

  const [hover, setHover] = useState(false)

  const styles = {
    primary: StyleSheet.create({
      gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: borderRadiusNative.md,
      },
      normal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: borderRadiusNative.md,
      },
    }),
    secondary: StyleSheet.create({
      gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: borderRadiusNative.md,
      },
      normal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: borderRadiusNative.md,
      },
    }),
    dark: StyleSheet.create({
      gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: borderRadiusNative.md,
      },
      normal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: borderRadiusNative.md,
      },
    }),
    extraDark: StyleSheet.create({
      gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: borderRadiusNative.md,
      },
      normal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: borderRadiusNative.md,
      },
    }),
    selected: StyleSheet.create({
      gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: borderRadiusNative.md,
      },
      normal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: borderRadiusNative.md,
      },
    }),
  }

  const gradientPrimary: any = theme === 'light' ? [themeVars.colors.grey3, themeVars.colors.grey3] : ['#aa4aff', '#860fef']
  const hoverGradientPrimary: any = theme === 'light' ? [themeVars.colors.grey2, themeVars.colors.grey2] : ['#d09aff', '#860fef']

  const gradientSecondary: any = theme === 'light' ? [themeVars.colors.grey5, themeVars.colors.grey5] : ['#392853ff', themeVars.colors.dark2]

  const gradientDark: any = theme === 'light' ? [themeVars.colors.grey5, themeVars.colors.grey5] : ['#3b2858ff', themeVars.colors.dark2]
  const hoverGradientDark: any = theme === 'light' ? [themeVars.colors.grey4, themeVars.colors.grey4] : ['#3b2858ff', themeVars.colors.dark3]

  const gradientSelected: any = theme === 'light' ? [themeVars.colors.grey3, themeVars.colors.grey3] : ['#aa4aff', '#860fef']

  const gradientExtraDark: any = theme === 'light' ? [themeVars.colors.grey6, themeVars.colors.grey6] : [themeVars.colors.dark1, themeVars.colors.dark1]

  return (
    <RNView className={clsx('relative', combinedClassname)} style={[combinedStyle]}>
      <LinearGradient
        className={clsx(gradientClassname)}
        colors={type === 'primary' ? (hover ? hoverGradientPrimary : gradientPrimary) : type === 'secondary' ? gradientSecondary : type === 'dark' ? (hover ? hoverGradientDark : gradientDark) : type === 'extraDark' ? gradientExtraDark : gradientSelected}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles[type]['gradient']]}
      />

      {!isPressable ? (
        <RNView {...props} className={clsx('', combinedClassname, className)} style={[{}, combinedStyle, styles[type]['normal'], style as ViewStyle]}>
          {props?.children as any}
        </RNView>
      ) : (
        <RNPressable
          {...props}
          className={clsx('', combinedClassname, className)}
          style={typeof style === 'function' ? style : [{}, combinedStyle, styles[type]['normal'], style]}
          onHoverIn={() => {
            setHover(true)
          }}
          onHoverOut={() => {
            setHover(false)
          }}
        >
          {props?.children}
        </RNPressable>
      )}
    </RNView>
  )
}

export type CustomTextInputProps = TextInputProps & {
  background?: GetThemeBackgroundProps['background'] | null
  border?: GetThemeBorderProps['border'] | null
  borderFocus?: GetThemeBorderProps['border'] | null
  color?: GetThemeColorProps['color'] | null
  placeholderColor?: GetThemePlaceholderColorProps['placeholderColor'] | null
}

export function TextInput({ background = null, border = null, borderFocus = null, color = null, placeholderColor = null, style, className, ...props }: CustomTextInputProps) {
  const { theme } = useTheme()
  const breakpoints = useBreakpoints()

  const [focused, setFocused] = useState(false)

  return (
    <RNTextInput
      {...props}
      className={clsx('w-[100%] h-[56px] px-[24px] rounded-[999999] outline-none', className)}
      style={[
        {
          fontFamily: themeVars.fonts.dosis,
        },
        background ? { backgroundColor: getThemeBackground({ theme, breakpoints, background }) } : null,
        border ? { borderColor: focused && borderFocus ? getThemeBorder({ theme, border: borderFocus }) : getThemeBorder({ theme, border }) } : null,
        color ? { color: getThemeColor({ theme, color }) } : null,
        style,
      ]}
      placeholderTextColor={placeholderColor ? getThemePlaceholderColor({ theme, placeholderColor: 'input2Placeholder' }) : ''}
      onFocus={(event) => {
        props?.onFocus && props?.onFocus(event)
        setFocused(true)
      }}
      onBlur={(event) => {
        props?.onBlur && props?.onBlur(event)
        setFocused(false)
      }}
    />
  )
}

export default function Blank() {}
