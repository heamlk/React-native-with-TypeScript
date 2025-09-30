import { type SvgIconType, svgIconDefaultProps } from './_props'

const SvgComponent = ({ width = svgIconDefaultProps.width, height = svgIconDefaultProps.height, color = svgIconDefaultProps.color, ...props }: SvgIconType) => (
  <svg {...props} width={width} height={height} viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='' data-icon='google'>
    <path d='m19.6 10.2274c0-.70912-.0636-1.39092-.1818-2.04552h-9.4182v3.86822h5.3818c-.2318 1.25-.9363 2.3091-1.9954 3.0182v2.5091h3.2318c1.8909-1.7409 2.9818-4.3046 2.9818-7.35z' fill='#4285f4'></path>
    <path d='m10 19.9999c2.7 0 4.9636-.8955 6.6181-2.4227l-3.2318-2.5091c-.8954.6-2.0409.9545-3.3863.9545-2.6046 0-4.8091-1.7591-5.5955-4.1227h-3.3409v2.5909c1.6455 3.2682 5.0273 5.5091 8.9364 5.5091z' fill='#34a853'></path>
    <path d='m4.4045 11.8999c-.2-.6-.3136-1.2409-.3136-1.89997 0-.6591.1136-1.3.3136-1.9v-2.5909h-3.3409c-.6772 1.35-1.0636 2.8773-1.0636 4.4909 0 1.61357.3864 3.14087 1.0636 4.49087z' fill='#fbbc04'></path>
    <path d='m10 3.9773c1.4681 0 2.7863.5045 3.8227 1.4954l2.8682-2.8682c-1.7318-1.6136-3.9955-2.6045-6.6909-2.6045-3.9091 0-7.2909 2.2409-8.9364 5.5091l3.3409 2.5909c.7864-2.3636 2.9909-4.1227 5.5955-4.1227z' fill='#e94235'></path>
  </svg>
)

export default SvgComponent
