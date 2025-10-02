import svgIconDefaultProps, { type SvgIconType } from './_props'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <svg {...props} width={width} height={height} viewBox='0 0 24 24' stroke-width='2.5' stroke={color}>
    <path stroke-linecap='round' stroke-linejoin='round' d='M6 18 18 6M6 6l12 12'></path>
  </svg>
)

export default SvgComponent
