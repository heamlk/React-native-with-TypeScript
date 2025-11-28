import svgIconDefaultProps, { type SvgIconType } from './_props'
import Svg, { Rect } from 'react-native-svg'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <Svg {...props} width={width} height={height} fill='' viewBox='3 3 24 24' data-icon='microsoft'>
    <Rect x='5' y='15.7143' width='9.28571' height='9.28571' fill='#05A6F0'></Rect>
    <Rect x='5' y='5' width='9.28571' height='9.28571' fill='#F35325'></Rect>
    <Rect x='15.7143' y='15.7143' width='9.28571' height='9.28571' fill='#FFBA08'></Rect>
    <Rect x='15.7143' y='5' width='9.28571' height='9.28571' fill='#81BC06'></Rect>
  </Svg>
)

export default SvgComponent
