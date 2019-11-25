import React from 'react'
import { styleMerge } from '~/utils'
import configStyle from '~/style/config'

import StatusBar from '../StatusBar'
import Style from '../Style'
import View from '../View'
import Text from '../Text'
import Button from '../Button'

const leftIcon = require('~/assets/image/icon_left.png')

export default class NavBar extends React.Component {

  static defaultProps = {
    statusBarStyle: 'dark-content', // 状态栏模式，default light-content dark-content
    statusBarTranslucent: true, // 状态栏是否透明（沉浸式）
    statusBarBackgroundColor: 'transparent', // 状态栏颜色
    title: '', // 标题
    navBack: null, // 路由返回方法
    leftRender: null, // 左侧渲染
    rightRender: null, // 右侧渲染
    leftParams: null, // 左侧按钮参数
    rightParams: null, // 右侧按钮参数
    sideStyle: null, // 两侧样式
    contentRender: null, // 主体渲染
    contentStyle: null, // 主体样式
    titleTextStyle: null, // 标题文本样式
    style: null,  // 外层样式
    theme: null, // 主题 light
    align: 'center', // 标题文本对齐
  }

  render() {
    const {
      statusBarStyle,
      statusBarTranslucent,
      statusBarBackgroundColor,
      title,
      contentRender,
      contentStyle,
      titleTextStyle,
      sideStyle,
      rightRender,
      rightParams,
      style,
      theme,
      align,
    } = this.props

    const _sideStyle = styleMerge(styles.titleBarSide, sideStyle)

    let _textStyle = theme === 'light' ? { color: '#fff' } : {}
    _textStyle.textAlign = align
    const Wrapper = View

    return (
      <Wrapper
        style={styleMerge(styles.navBar, theme === 'light' ? { backgroundColor: 'transparent', borderBottomWidth: 0 } : {}, style)}
      >
        <StatusBar
          barStyle={theme === 'light' ? 'light-content' : statusBarStyle}
          backgroundColor={statusBarBackgroundColor}
          translucent={statusBarTranslucent}
        />
        {
          typeof contentRender === 'function'
            ? contentRender()
            : (
              <View style={styleMerge(styles.titleBarContent, contentStyle)}>
                {
                  this.leftRender(_sideStyle, _textStyle)
                }
                <Text style={styleMerge(styles.titleBarText, titleTextStyle, _textStyle)}>{title}</Text>
                {
                  typeof rightRender === 'function'
                    ? rightRender()
                    : rightParams
                      ? <Button type="simple" theme={_textStyle.color} iconStyle={styleMerge(styles.titleBarSideIcon, _textStyle)} style={styles.titleBarSide} {...rightParams} />
                      : <View style={styles.titleBarSide} />
                }
              </View>
            )
        }
      </Wrapper>
    )
  }

  leftRender = (_sideStyle, _textStyle) => {
    const { leftRender, leftParams, navBack, theme } = this.props
    const color = theme === 'light' ? '#fff' : configStyle.color.titleBarText
    const _leftParams = leftParams || { icon: leftIcon, iconStyle: { tintColor: color }, onPress: navBack, text: '返回', textStyle: { fontSize: 16, color } }

    if (typeof leftRender === 'function') {
      return leftRender(styleMerge(styles.titleBarSideIcon, styles.titleBarSideBackIcon))
    }

    if (typeof navBack === 'function' || leftParams) {
      return (
        <Button
          type="simple"
          iconStyle={styleMerge(styles.titleBarSideIcon, typeof navBack === 'function' ? styles.titleBarSideBackIcon : null, _textStyle)}
          style={styles.titleBarSide}
          {..._leftParams}
        />
      )
    }

    return <View style={styles.titleBarSide} />
  }

}

export const styles = Style.create({
  navBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: configStyle.color.border,
    paddingHorizontal: 10,
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: configStyle.size.titleBarHeight,
  },
  titleBarSide: {
    flex: 0,
    flexBasis: 'auto',
    minWidth: configStyle.size.titleBarSideWidth,
  },
  titleBarSideIcon: {
    fontSize: 20,
  },
  titleBarSideBackIcon: {
    color: configStyle.color.titleBarText,
  },
  titleBarText: {
    flex: 1,
    fontSize: configStyle.size.titleBarText,
    fontWeight: '400',
    color: configStyle.color.titleBarText,
  },
})
