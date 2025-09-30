import vars from '@/app/styles/vars'
import { Text as RNText, TextProps } from 'react-native'

export function Text(props: TextProps) {
  return <RNText {...props} style={[{ fontFamily: vars.fontText }, props.style]} />
}

export default function Blank() {}
