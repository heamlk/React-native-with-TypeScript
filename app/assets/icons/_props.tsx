export type SvgIconType = {
  width?: string | number
  height?: string | number
  color?: string
} & React.SVGProps<SVGSVGElement>

export const svgIconDefaultProps: SvgIconType = {
  width: '20px',
  height: '20px',
  color: '#000000',
}
