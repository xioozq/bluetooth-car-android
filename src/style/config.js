import StatusBar from '~/components/StatusBar'
import { isIphoneX } from '~/utils'

const color = {
  primary: '#545DFF', // 主题色

  success: '#00cc99', // 成功
  info: '#66CCFF', // 信息
  danger: '#EA5555', // 异常
  error: '#EA5555', // 错误
  warning: '#FF6600', // 警告

  background: '#eee', // 背景灰
  border: '#eee', // 边框

  pop: 'rgba(50, 50, 50, .9)', // pop提示框默认底色 

  link: '#45ACF3',

  formLabel: '#000',
  formControl: '#000',
  placeholder: '#D3D3D3',

  desc: '#aaa',

  titleBarText: '#333',
}

const size = {
  // 常用字体大小
  textXs: 12,
  textSm: 13,
  text: 14,
  textLg: 15,
  textXl: 16,

  // 全面屏机型底部边距 (ipX)
  pageSafeBottom: isIphoneX ? 34 : 0,

  // 标题栏相关
  titleBarHeight: 64,
  titleBarText: 20,
  titleBarSideWidth: 83,

  // 状态栏
  get statusBarHeight() {
    return StatusBar.currentHeight
  },

  // 整体导航栏
  get navBarHeight() {
    return this.titleBarHeight + this.statusBarHeight
  }
}

export default {
  color,
  size,
}