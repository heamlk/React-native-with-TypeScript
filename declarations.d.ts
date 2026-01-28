// Files
declare module '*.html' {
  const content: string
  export default content
}

declare module '*.txt' {
  const content: string
  export default content
}

// Fonts
declare module '*.ttf' {
  const content: string
  export default content
}

// Videos
declare module '*.mp4' {
  const src: string
  export default src
}

// Sounds
declare module '*.mp3' {
  const src: string
  export default src
}

// Images
declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

declare module '*.jpg' {
  const value: any
  export default value
}

declare module '*.png' {
  const value: any
  export default value
}

declare module '*.jpeg' {
  const value: any
  export default value
}
