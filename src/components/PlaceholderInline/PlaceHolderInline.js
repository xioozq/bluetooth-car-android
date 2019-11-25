import React from 'react'
import configStyle from '~/style/config'

import Style from '../Style'
import Image from '../Image'
import Text from '../Text'
import Touch from '../Touch'
import View from '../View'
import Lottie from '../Lottie'

import Loading from '~/lottie/Loading'
const loading = Loading()

export default class PlaceholderInline extends React.Component {

  static defaultProps = {
    status: null,
    onRetry: null,
    emptyConfig: null,
    errorConfig: null,
    style: null,
    onLayout: null,
  }

  get statusConfig() {
    const { emptyConfig, errorConfig, status } = this.props

    const defaultConfig = defaultStatusConfig[status] || defaultStatusConfig['null']
    let customConfig = null

    switch (status) {
      case 'empty': {
        customConfig = emptyConfig
        break
      }
      case 'error': {
        customConfig = errorConfig
        break
      }
    }
    return {
      ...defaultConfig,
      ...customConfig,
    }
  }

  render() {

    const { style, onLayout } = this.props
    const { icon, title, visible, style: statusStyle, iconStyle, animate, animateStyle } = this.statusConfig

    return visible
      ? (
        <Touch onPress={this.handlePress} onLayout={onLayout} activeOpacity={1} style={[styles.container, style, statusStyle]}>
          {icon ? <Image style={[styles.icon, iconStyle]} source={icon} /> : null}
          {animate ? <Lottie style={[styles.animate, animateStyle]} source={animate} /> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </Touch>
      )
      : <View style={styles.emptyContainer} onLayout={onLayout} />
  }

  handlePress = () => {
    const { status, onRetry } = this.props
    if (status === 'error' && typeof onRetry === 'function') {
      onRetry()
    }
  }
}

const styles = Style.create({
  container: {
    alignItems: 'center',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 0,
  },
  icon: {
    width: 20,
    height: 20,
  },
  animate: {
    width: 120,
  },
  title: {
    marginLeft: 20,
    fontSize: 16,
    lineHeight: 22,
    color: '#999',
  },
})

const defaultStatusConfig = {
  'null': {
    title: '上拉加载更多',
    visible: true,
  },
  'empty': {
    visible: false,
  },
  'loadend': {
    title: '已经全部加载完了',
    visible: true,
  },
  'error': {
    icon: require('~/assets/image/icon_refresh.png'),
    iconStyle: { tintColor: configStyle.color.error },
    title: '加载失败， 请点击重试',
    visible: true,
  },
  'loading': {
    animate: loading,
    visible: true,
  },
}