import React from 'react'
import { StatusBar as RNStatusBar } from 'react-native'
import { isIphoneX, styleMerge } from '~/utils'
import View from '../View'

function getCurrentHeight() {
  return RNStatusBar.currentHeight || (isIphoneX ? 44 : 20)
}

export default class StatusBar extends React.Component {
  static defaultProps = {
    backgroundColor: 'transparent',
    translucent: true,
    barStyle: 'dark-content', // default light-content dark-content
    height: null,
    style: null,
  }

  render() {
    const { translucent, backgroundColor, height, style } = this.props
    return (
      <View style={styleMerge({
        height: typeof height === 'number' ? height : getCurrentHeight(),
        backgroundColor: translucent ? backgroundColor : 'transparent',
      }, style)}>
        <RNStatusBar {...this.props} backgroundColor={translucent ? 'transparent' : backgroundColor} />
      </View>
    )
  }
}

Object.defineProperty(StatusBar, 'currentHeight', {
  get() {
    return getCurrentHeight()
  },
})
