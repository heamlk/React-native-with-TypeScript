import svgIconDefaultProps, { type SvgIconType } from './_props'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <svg {...props} width={width} height={height} fill='none'>
    <g>
      <path
        d='M24.636 3.16L2.585 10.752a1.32 1.32 0 0 0-.504 2.182l.027.027a2.17 2.17 0 0 0 .417.326l7.109 4.265a.54.54 0 0 0 .617-.041l6.943-5.555c.241-.193.588-.173.806.045s.237.565.045.806l-5.555 6.943a.54.54 0 0 0-.041.617l4.265 7.109c.091.152.201.292.326.417l.027.027a1.32 1.32 0 0 0 2.182-.504L26.84 5.364c.216-.627.055-1.322-.413-1.79s-1.164-.629-1.79-.413z'
        fill={color}
      ></path>
    </g>
    <defs>
      <radialGradient id='A' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(5.50012 3) rotate(41.1859) scale(42.5206 44.0465)'>
        <stop stopColor='#a948ff'></stop>
        <stop offset='1' stopColor='#860fef' stopOpacity='0'></stop>
      </radialGradient>
      <clipPath id='B'>
        <path fill='#fff' d='M0 0h30v30H0z'></path>
      </clipPath>
    </defs>
  </svg>
)

export default SvgComponent
