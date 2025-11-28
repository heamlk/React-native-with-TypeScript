import { SvgProps } from 'react-native-svg'

export type SvgIconType = {
  width?: string | number
  height?: string | number
  color?: string
} & SvgProps

const svgIconDefaultProps: SvgIconType = {
  width: '20px',
  height: '20px',
  color: '#000000',
}

export default svgIconDefaultProps
