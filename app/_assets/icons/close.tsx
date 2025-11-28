import svgIconDefaultProps, { type SvgIconType } from './_props'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <Svg {...props} width={width} height={height} viewBox='0 0 24 24' strokeWidth='2.5' stroke={color}>
    <Path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12'></Path>
  </Svg>
)

export default SvgComponent
