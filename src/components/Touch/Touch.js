import React from 'react'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import configStyle from '~/style/config'
import { styleMerge, throttle } from '~/utils'
import View from '../View'

export default class extends React.Component {

  static defaultProps = {
    type: 'opacity', // 点击效果 opacity, highlight
    activeOpacity: .6,
    activeColor: configStyle.color.background,
    pressInterval: 250, // 点击间隔， 防连击
    onPress: null,
    style: {},
    onLayout: null,
  }

  constructor() {
    super(...arguments)
    this.state = {
      active: false,
    }
    this.lastPressTime = null
    this.throttledClearHighlight = throttle(this.clearHighlight, 30)
  }

  render() {
    const {
      type,
      style,
      activeOpacity,
      activeColor,
      onLayout,
    } = this.props
    const { active } = this.state
    const { onPress } = this

    const params = {
      onPress,
      activeOpacity,
      onPressIn: this.onPressIn,
      onPressOut: this.onPressOut,
    }

    return type === 'opacity'
      ? (
        <TouchableOpacity onLayout={onLayout} {...params} style={style} ref="wrapper">
          {this.props.children}
        </TouchableOpacity>
      )
      : (
        <TouchableWithoutFeedback onLayout={onLayout} {...params} >
          <View ref="wrapper" style={styleMerge(style, active ? { backgroundColor: activeColor } : null)}>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback >
      )
  }

  onPress = (...params) => {
    const { pressInterval, onPress } = this.props
    const now = Date.now()

    if (this.lastPressTime && now - this.lastPressTime < pressInterval) {
      return false
    }

    if (typeof onPress === 'function') {
      this.lastPressTime = now
      onPress(...params)
    }
  }

  onPressIn = () => {
    const { type } = this.props
    type === 'highlight' && this.setState({
      active: true,
    })
  }

  onPressOut = () => {
    const { type } = this.props
    type === 'highlight' && this.throttledClearHighlight()
  }

  clearHighlight = () => {
    this.setState({
      active: false,
    })
  }

  measure = (callback) => {
    return this.refs.wrapper && this.refs.wrapper.measure(callback)
  }
}
