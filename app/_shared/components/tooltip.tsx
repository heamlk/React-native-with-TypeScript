import React, { useState } from 'react'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Pressable, View } from './reusable'

interface TooltipProps {
  content: any
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false)

  return (
    <View className='relative items-center'>
      <Pressable
        onHoverIn={() => {
          console.log(1)
        }}
        // onHoverOut={() => setVisible(false)}
        className='z-10'
      >
        {children}
      </Pressable>

      {visible && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className={`absolute px-3 py-2 bg-black rounded-xl max-w-[200px]
            ${position === 'top' ? 'bottom-full mb-2' : position === 'bottom' ? 'top-full mt-2' : position === 'left' ? 'right-full mr-2' : 'left-full ml-2'}
          `}
        >
          {content}
          <View
            className={`absolute w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black
              ${position === 'top' ? 'bottom-[-4px]' : ''}
              ${position === 'bottom' ? 'top-[-4px] rotate-180' : ''}
              ${position === 'left' ? 'right-[-4px] rotate-90' : ''}
              ${position === 'right' ? 'left-[-4px] -rotate-90' : ''}
            `}
          />
        </Animated.View>
      )}
    </View>
  )
}

export default Tooltip
