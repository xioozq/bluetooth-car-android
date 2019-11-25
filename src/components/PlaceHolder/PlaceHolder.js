import React from 'react'

import Style from '../Style'
import Image from '../Image'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import Lottie from '../Lottie'

import Loading from '~/lottie/Loading'
const loading = Loading()
const iconRefresh = require('~/assets/image/icon_refresh.png')

export default class Placeholder extends React.Component {

  static defaultProps = {
    status: null,
    onRetry: null,
    emptyConfig: null,
    errorConfig: null,
    style: null,
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

    const { style } = this.props
    const { icon, title, animate, button, visible, style: statusStyle, iconStyle, animateStyle } = this.statusConfig

    return visible
      ? (
        <View activeOpacity={1} style={[styles.container, style, statusStyle]} >
          {
            icon
              ? <Image style={[styles.icon, iconStyle]} source={icon} />
              : null
          }
          {
            animate
              ? <Lottie style={[styles.animate, animateStyle]} source={animate} />
              : null
          }
          {
            title
              ? <Text style={styles.title}>{title}</Text>
              : null
          }
          {
            button
              ? (
                <Button
                  size={36}
                  fontSize={14}
                  highlight={false}
                  icon={iconRefresh}
                  onPress={this.handlePress}
                  {...button}
                >刷新重试</Button>
              )
              : null
          }
        </View>
      )
      : null
  }

  handlePress = () => {
    const { status, onRetry } = this.props
    typeof onRetry === 'function' && onRetry(status)
  }
}

const styles = Style.create({
  container: {
    alignItems: 'center',
    width: 200,
  },
  icon: {
    width: 150,
    height: 150,
  },
  animate: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    color: '#999',
  },
})

const defaultStatusConfig = {
  'null': {
    icon: null,
    title: '',
    visible: false,
  },
  'empty': {
    icon: require('~/assets/image/placeholder_empty_house.png'),
    title: '暂无相关数据',
    visible: true,
  },
  'error': {
    icon: require('~/assets/image/placeholder_error.jpg'),
    title: '加载失败， 请重新加载',
    button: {
      iconStyle: {
        width: 15,
        height: 15,
      },
      style: {
        marginTop: 33,
        borderRadius: 4,
        backgroundColor: 'transparent',
      },
    },
    visible: true,
  },
  'loading': {
    animate: loading,
    visible: true,
  },
}