import React from 'react'
import { styleMerge } from '~/utils'
import configStyle from '~/style/config'

import Loader from '../Loader'
import View from '../View'
import Image from '../Image'
import Text from '../Text'
import Touch from '../Touch'
import Style from '../Style'

const sizes = {
  lg: 70,
  md: 60,
  sm: 50,
  xs: 40,
  xxs: 30,
}

const fontSizes = {
  lg: 20,
  md: 16,
  sm: 15,
  xs: 12,
  xxs: 10,
}

export default class Button extends React.PureComponent {

  static defaultProps = {
    style: {},
    activeType: undefined, // 点击效果 opacity highlight null
    activeOpacity: undefined, // 透明模式 点击透明度
    activeColor: undefined, // 高亮模式 点击颜色
    pressInterval: undefined, // 点击间隔
    innerStyle: {},
    bodyStyle: {},
    textStyle: {},
    highlight: true,
    disabled: false,
    loading: false,
    theme: 'primary',
    type: 'rect', // circle simple rect
    size: 'md',
    fontSize: 'md',
    text: '',
    icon: null,
    iconStyle: null,
    onPress: null,
  }

  render() {
    const {
      style,
      innerStyle,
      textStyle,
      text,
      highlight,
      size,
      fontSize,
      disabled,
      loading,
      children,
      theme,
      type,
      activeType,
      activeOpacity,
      activeColor,
      pressInterval,
      onPress,
      iconStyle,
      icon,
    } = this.props

    const Wrapper = disabled || loading
      ? View
      : Touch

    const height = typeof size === 'string'
      ? sizes[size] || sizes['md']
      : size

    const borderRadius = type === 'simple'
      ? 0
      : (type === 'rect' ? 10 : height / 2)

    const color = configStyle.color[theme] || theme || configStyle.color['primary']

    const _wrapperStyle = {
      width: type === 'circle' ? height : 'auto',
      height,
      borderRadius,
      borderColor: color,
      borderWidth: highlight || type === 'simple' ? 0 : 1,
      backgroundColor: type === 'simple' ? 'transparent' : (highlight ? color : '#fff'),
    }

    const _innerStyle = {
      borderRadius,
      backgroundColor: 'transparent',
      paddingHorizontal: type === 'circle' ? 0 : 10,
    }

    const _textStyle = {
      color: highlight && type !== 'simple' ? '#fff' : color,
      fontSize: typeof fontSize === 'string'
        ? fontSizes[fontSize] || fontSizes['md']
        : fontSize
    }

    const _iconStyle = {
      marginHorizontal: type === 'circle' ? 0 : 5,
      tintColor: _textStyle.color,
    }

    const childrenText = this.parseText(children);

    return (
      <Wrapper
        ref="wrapper"
        type={activeType || (highlight ? 'opacity' : 'highlight')}
        activeOpacity={activeOpacity}
        activeColor={activeColor}
        pressInterval={pressInterval}
        style={styleMerge(styles.wrapper, _wrapperStyle, style, disabled || loading ? styles.disabledWrapper : null)}
        onPress={this.onPress}
      >
        <View style={styleMerge(styles.inner, _innerStyle, innerStyle)} >
          {
            icon && !loading
              ? <Image source={icon} style={[styles.icon, _iconStyle, iconStyle]} />
              : null
          }
          {
            loading
              ? <Loader size={5} color={highlight && type !== 'simple' ? '#fff' : color} />
              : (text || (typeof childrenText === 'string' && childrenText)
                ? <Text style={styleMerge(styles.text, _textStyle, textStyle)}>{text || childrenText}</Text>
                : children
              )
          }
        </View>
      </Wrapper>
    )
  }

  onPress = (e) => {
    const { onPress } = this.props
    typeof onPress === 'function' && onPress(e)
  }

  measure = (callback) => {
    if (!this.refs.wrapper) {
      return false
    }
    this.refs.wrapper.measure(callback)
  }

  // 新版text也可能是数组
  parseText = (value) => {
    let ret = ''

    if (typeof value === 'string') {
      return value
    }
    if (value instanceof Array) {
      for (let item of value) {
        if (typeof item === 'string') {
          ret += item
        } else {
          return false
        }
      }
    }
    return ret
  }
}

const styles = Style.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  disabledWrapper: {
    opacity: .6,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {},
  icon: {
    width: 20,
    height: 20,
  },
})
