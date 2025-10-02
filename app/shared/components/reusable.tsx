import themeVars from '@/app/styles/theme/themeVars'
import { Text as RNText, TextProps } from 'react-native'

export function Text(props: TextProps) {
  return <RNText {...props} style={[{ fontFamily: themeVars.fonts.dosis }, props.style]} />
}

export default function Blank() {}
