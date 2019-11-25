import React from 'react'
import {
  Animated,
  Easing,
} from 'react-native'
import { styleMerge, getClientSize } from '~/utils'
import View from '../View'
import Style from '../Style'
import Touch from '../Touch'

const { width: deviceWidth, height: deviceHeight } = getClientSize()

export default class ModalView extends React.Component {

  static defaultProps = {
    visible: false,
    animate: 'left', // top, left, bottom, right, scale, fade, null
    width: '100%',
    height: '100%',
    left: null,
    right: null,
    top: null,
    bottom: null,
    layoutWidth: null,
    layoutHeight: null,
    duration: 300, // 动画时间
    maskColor: 'rgba(0, 0, 0, 0.65)', // 背景层颜色
    easing: Easing.linear(), // 动画缓动
    horizontalCenter: false, // 水平居中
    verticalCenter: false, // 垂直居中
    renderContent: () => null, // 渲染内容区域
    onMaskPress: () => null, // 点击蒙层事件
    enableClose: true, // 是否允许点击遮罩层关闭
    reuse: false, // 是否复用，与 ModalManager 配合时生效
    modalStyle: {}, // 模态框容器样式
    containerPointerEvents: undefined,
  }

  constructor(props) {
    super(...arguments)
    this.state = {
      visible: props.visible,
      maskAnimateValue: new Animated.Value(0),
      modalAnimateValue: new Animated.Value(0),
    }
    this.status = null
  }

  get layoutWidth() {
    const { layoutWidth } = this.props
    return typeof layoutWidth === 'number' ? layoutWidth : deviceWidth
  }

  get layoutHeight() {
    const { layoutHeight } = this.props
    return typeof layoutHeight === 'number' ? layoutHeight : deviceHeight
  }

  get modalWidth() {
    let { width } = this.props
    if (typeof width === 'number') {
      return width
    } else if (typeof width === 'string') {
      width = Number((/^([0-9|.]+)%$/.exec(width) || [0, NaN])[1])
      if (isNaN(width)) {
        return this.layoutWidth
      } else {
        return this.layoutWidth * width / 100
      }
    }
  }

  get modalHeight() {
    let { height } = this.props
    if (typeof height === 'number') {
      return height
    } else if (typeof height === 'string') {
      // 解析百分比
      height = Number((/^([0-9|.]+)%$/.exec(height) || [0, NaN])[1])
      if (isNaN(height)) {
        return this.layoutHeight
      } else {
        return this.layoutHeight * height / 100
      }
    }
  }

  get animateType() {
    const { animate } = this.props

    return ['top', 'bottom', 'left', 'right', 'scale', 'fade'].includes(animate)
      ? animate
      : null
  }

  get maskTransformStyle() {
    const { maskAnimateValue } = this.state
    const { maskColor } = this.props
    const animate = this.animateType

    return animate
      ? {
        backgroundColor: maskColor,
        opacity: maskAnimateValue,
      }
      : { backgroundColor: maskColor }
  }

  get modalTransformStyle() {
    const { modalAnimateValue, maskAnimateValue } = this.state
    const { horizontalCenter, verticalCenter, left, right, top, bottom } = this.props
    const animate = this.animateType

    const defaultLeft = horizontalCenter === true || animate === 'scale' ? (this.layoutWidth - this.modalWidth) / 2 : undefined
    const defaultTop = verticalCenter === true || animate === 'scale' ? (this.layoutHeight - this.modalHeight) / 2 : undefined
    let horizontalPosition = null
    let verticalPosition = null

    if (left) {
      horizontalPosition = { left }
    } else if (right) {
      horizontalPosition = { right }
    }

    if (top) {
      verticalPosition = { top }
    } else if (right) {
      verticalPosition = { bottom }
    }

    if (['top', 'bottom'].includes(animate)) {
      let ret = {
        transform: [{ translateY: modalAnimateValue }],
        ...horizontalPosition,
        ...verticalPosition,
      }
      if (!horizontalPosition) {
        ret.left = defaultLeft
      }
      return ret
    }

    if (['left', 'right'].includes(animate)) {
      let ret = {
        transform: [{ translateX: modalAnimateValue }],
        ...horizontalPosition,
        ...verticalPosition,
      }
      if (!verticalPosition) {
        ret.top = defaultTop
      }
      return ret
    }

    if (animate === 'fade') {
      let ret = {
        opacity: maskAnimateValue,
        ...horizontalPosition,
        ...verticalPosition,
      }
      if (!horizontalPosition) {
        ret.left = defaultLeft
      }
      if (!verticalPosition) {
        ret.top = defaultTop
      }
      return ret
    }

    if (animate === 'scale') {
      let ret = {
        opacity: maskAnimateValue,
        transform: [{ scale: modalAnimateValue }],
        ...horizontalPosition,
        ...verticalPosition,
      }
      if (!horizontalPosition) {
        ret.left = defaultLeft
      }
      if (!verticalPosition) {
        ret.top = defaultTop
      }
      return ret
    }

    return {
      left,
      top,
    }
  }

  render() {
    const {
      visible,
    } = this.state

    const {
      renderContent,
      modalStyle,
      width,
      height,
      containerPointerEvents,
    } = this.props

    const { modalTransformStyle } = this
    const { maskTransformStyle } = this

    return visible
      ? (
        <View style={styles.container} pointerEvents={containerPointerEvents}>
          <Animated.View
            style={[
              styles.mask,
              maskTransformStyle,
            ]}
          >
            <Touch
              style={styles.maskTouch}
              onPress={this.onMaskPress}
              activeOpacity={1}
            />
          </Animated.View>
          <Animated.View
            style={styleMerge(
              styles.modal,
              modalTransformStyle,
              modalStyle,
              { width, height }
            )}
          >
            {typeof renderContent === 'function' ? renderContent(this.props) : null}
          </Animated.View>
        </View>
      )
      : null
  }

  componentDidMount() {
    if (this.props.visible) {
      this.animationStart()
    }
  }

  componentWillReceiveProps(nextProps) {

    // 外层控制打开
    if (nextProps.visible && !this.state.visible) {
      this.setState({
        visible: true,
      }, () => {
        this.animationStart()
      })
    }

    // 外层控制关闭
    if (!nextProps.visible && this.state.visible) {
      this.animationClose()
    }
  }

  //开始动画
  animationStart = () => {
    if (this.status === 'opening') {
      return
    }

    this.status = 'opening'

    const { animate, horizontalCenter, easing, duration, verticalCenter } = this.props

    let targetValue = 0
    let easingValue = easing || undefined
    let durationValue = this.animateType ? duration : 0

    switch (animate) {
      case 'left': {
        if (horizontalCenter === true) {
          targetValue = this.modalWidth - this.layoutWidth + (this.layoutWidth - this.modalWidth) / 2
        } else {
          targetValue = this.modalWidth - this.layoutWidth
        }
        this.state.modalAnimateValue.setValue(-this.layoutWidth)
        break
      }
      case 'right': {
        if (horizontalCenter === true) {
          targetValue = -(this.layoutWidth - this.modalWidth) / 2
        } else {
          targetValue = 0
        }
        this.state.modalAnimateValue.setValue(this.modalWidth)
        break
      }
      case 'top': {
        this.state.modalAnimateValue.setValue(-this.modalHeight)
        if (verticalCenter === true) {
          targetValue = (this.layoutHeight - this.modalHeight) / 2
        } else {
          targetValue = 0
        }
        break
      }
      case 'bottom': {
        this.state.modalAnimateValue.setValue(this.layoutHeight)
        if (verticalCenter === true) {
          targetValue = (this.layoutHeight - this.modalHeight) / 2
        } else {
          targetValue = this.layoutHeight - this.modalHeight
        }
        break
      }
      case 'scale': {
        this.state.modalAnimateValue.setValue(0)
        targetValue = 1
        if (easing === undefined) {
          easingValue = Easing.bezier(0, 1.34, .55, 1.34)
        } else {
          easingValue = easing
        }
        break
      }
    }

    Animated.parallel([
      Animated.timing(
        this.state.maskAnimateValue,
        {
          toValue: 1,
          duration: durationValue,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        this.state.modalAnimateValue,
        {
          toValue: targetValue,
          duration: durationValue,
          easing: easingValue,
          useNativeDriver: true,
        }
      )
    ]).start(() => {
      this.status = 'opened'
    })
  }

  // 关闭动画
  animationClose = () => {
    if (this.status === 'closing') {
      return
    }

    this.status = 'closing'

    const { animate, duration, easing } = this.props
    let targetValue = 0
    let easingValue = easing || undefined
    let durationValue = this.animateType ? duration : 0

    switch (animate) {
      case 'left': {
        targetValue = -this.layoutWidth
        break
      }
      case 'right': {
        targetValue = this.modalWidth
        break
      }
      case 'top': {
        targetValue = -this.layoutHeight
        break
      }
      case 'bottom': {
        targetValue = this.layoutHeight
        break
      }
      case 'scale': {
        targetValue = 0
        if (easing === undefined) {
          easingValue = Easing.bezier(.92, -0.44, 1, .39)
        } else {
          easingValue = easing
        }
        break
      }
    }
    Animated.parallel([
      Animated.timing(
        this.state.maskAnimateValue,
        {
          toValue: 0,
          duration: durationValue,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        this.state.modalAnimateValue,
        {
          toValue: targetValue,
          duration: durationValue,
          easing: easingValue,
          useNativeDriver: true,
        }
      )
    ]).start(() => {
      const { onCloseEnd } = this.props

      this.setState({
        visible: false
      })

      if (typeof onCloseEnd === 'function') {
        onCloseEnd(this.props)
      }

      this.status = 'closed'
    });
  }

  onMaskPress = () => {
    if (this.status === 'opening' || this.status === 'closeing') {
      return
    }
    const { onMaskPress } = this.props
    typeof onMaskPress === 'function' && onMaskPress(this.props)
  }
}


const styles = Style.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  mask: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  maskTouch: {
    flex: 1,
  },
  modal: {
    position: 'absolute',
    right: 0,
  },
})
