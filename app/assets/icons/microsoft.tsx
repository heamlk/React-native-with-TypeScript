import svgIconDefaultProps, { type SvgIconType } from './_props'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <svg {...props} width={width} height={height} xmlns='http://www.w3.org/2000/svg' fill='' viewBox='3 3 24 24' data-icon='microsoft'>
    <rect x='5' y='15.7143' width='9.28571' height='9.28571' fill='#05A6F0'></rect>
    <rect x='5' y='5' width='9.28571' height='9.28571' fill='#F35325'></rect>
    <rect x='15.7143' y='15.7143' width='9.28571' height='9.28571' fill='#FFBA08'></rect>
    <rect x='15.7143' y='5' width='9.28571' height='9.28571' fill='#81BC06'></rect>{' '}
  </svg>
)

export default SvgComponent
