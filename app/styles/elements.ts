import vars from './vars'
import type { TextStyle } from 'react-native'

const elements: { [style: string]: TextStyle } = {
  title: {
    fontSize: 26,
    fontWeight: 600,
    // color: theme === 'dark' ? vars.light1 : vars.grey1,
  },
  description: {
    fontSize: 16,
    // color: theme === 'dark' ? vars.light3 + vars.opacity70 : vars.grey2,
  },
}

export default elements
