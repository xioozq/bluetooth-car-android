import { Dimensions, Platform, PixelRatio } from 'react-native'
import config from '~/config'
import colors from './colors'

export { default as uuid } from 'uuid'
export { default as md5 } from 'md5'
export { default as AsyncStorage } from '@react-native-community/async-storage'
export { connect } from 'react-redux'
export const getClientSize = () => Dimensions.get('window')

const { width: clientWidth } = getClientSize()

/**
 * 获取对象中深层次节点数据， 避免 a && a.b && a.b.c 这样的代码
 *
 * 如果按照路径能找到，则返回期望值
 * 如果遇到任意异常， 便返回 undefined
 *
 * xiaozq 2018.2.6
 *
 * @param obj 待查找的对象 e.g. { a: { b: [{name: 'hh'}] } }
 * @param path 查找路径 'a.b.0.name'
 *
 */

export function getDeepValue(obj, path) {

  // 安全验证
  if (typeof obj !== 'object' || obj === null || !path || typeof path !== 'string') {
    return undefined
  }

  const paths = path.split('.')
  const length = paths.length

  // 递归结束, 返回目标结果
  if (length <= 1) {
    return obj[paths[0]]
  }

  // 路径未走完，继续递归
  if (paths[0] in obj) {
    return getDeepValue(obj[paths[0]], paths.slice(1, length).join('.'))
  }

}

/**
 * 转换为数组
 * @param {*} item 
 */
export function toArray(item) {
  return item instanceof Array ? item : [item]
}

/**
 * 合并样式
 * @param {*} src 
 * @param  {...any} styles 
 */
export function styleMerge(src, ...styles) {
  src = toArray(src)
  return src.concat(...styles)
}

/**
 * 判断IphoneX， 用于 UI适配
 * 直接一次生成结果，后续不再可执行
 */
export const isIphoneX = (function () {
  // iPhoneX SIZE
  const X_WIDTH = 375
  const X_HEIGHT = 812

  // DEVICE SIZE
  const { width, height } = getClientSize()
  const sizes = [X_WIDTH, X_HEIGHT]

  return Platform.OS === 'ios'
    ? sizes.includes(width) && sizes.includes(height)
    : false

})()

/**
 * @param {string} type (item, index) 获取类型，获取内容或索引 
 */

export function getItemsFromArray(array, key, value, type = 'item') {
  let res = []
  array instanceof Array && array.filter((item, index) => {
    if (item[key] === value) {
      res.push(type === 'item' ? item : index)
    }
  })
  return res
}


/**
 * 颜色处理系列函数
 * 包含解析颜色，透明度处理
 * xiaozq 2019/06/26
 */

export const Color = {

  // 识别正则
  REG_COLOR_HEX: /^#(.+)$/,
  REG_COLOR_RGB: /^rgb\((.+)\)$/,
  REG_COLOR_RGBA: /^rgba\((.+)\)$/,

  // 解析 HEX 颜色， 支持 #3399cc 或 #39c
  parseHexColor(hexColor) {
    const hex = String(hexColor)
    const hexRes = this.REG_COLOR_HEX.exec(hex)
    const hexContent = hexRes ? hexRes[1] : ''

    const l = hexContent.length
    const res = []

    if (l !== 3 && l !== 6) {
      return null
    }

    [0, 1, 2].forEach(i => {
      const _i = l === 6 ? i * 2 : i
      const h = hexContent[_i] + hexContent[_i + (l === 6 ? 1 : 0)]
      res.push(parseInt(h, 16))
    })
    res.push(1)

    return res
  },

  // 解析rgb或rgba格式， rgb(20, 30, 40) 或 rgba(20, 30, 40, .7)
  parseRGBColor(rgbColor) {
    const rgb = String(rgbColor)
    const rgbContent = this.REG_COLOR_RGB.exec(rgb) || this.REG_COLOR_RGBA.exec(rgb)
    const res = []

    if (rgbContent) {
      const r = rgbContent[1].split(',')
      for (let i = 0; i < r.length; i++) {
        const n = r[i].trim()
        if (i <= 2) {
          res.push(parseInt(n))
        }

        if (i === 3) {
          const _n = Number(n)
          !isNaN(_n) && res.push(_n)
          break
        }
      }
    }

    return res
  },

  parseColor(color) {
    color = String(color)
    let colorRes = null

    if (this.REG_COLOR_HEX.test(color)) {
      // #ffffff 十六进制颜色
      colorRes = this.parseHexColor(color)
    } else if (this.REG_COLOR_RGB.test(color) || this.REG_COLOR_RGBA.test(color)) {
      // rgba(255,255,255,0) rgb颜色
      colorRes = this.parseRGBColor(color)
    } else if (colors[color]) {
      // 具名颜色
      return this.parseColor(colors[color])
    }

    return colorRes
  },

  fadeColor(color, fade) {
    const colorRes = this.parseColor(color)
    if (!colorRes) {
      return null
    }
    const [r, g, b] = colorRes
    return colorRes.length >= 3 ? `rgba(${r}, ${g}, ${b}, ${fade})` : ''
  },

  toLottie(color) {
    const colorRes = this.parseColor(color)
    if (!colorRes) {
      return null
    }
    const [r, g, b, a] = colorRes
    return [r / 255, g / 255, b / 255, a]
  },
}

/**
 * 节流修饰器
 * @param {function} fn 待修饰的函数
 * @param {number} time 延迟触发时长，默认300ms
 * @param {boolean} parseValue 是否解析事件对象value  * 注：由于antd的onChange事件为合成事件，且会复用，
 * 当节流器延迟执行时，原先的事件对象会作废，造成节流后无法取到值，因此加这个参数提前解析事件对象获取value，
 * 默认为true，如果为false则不对事件对象做任何处理
 * @return {function} 返回被修饰后的新函数
 */

export function throttle(fn, time = 300, parseValue = false) {
  if (typeof fn !== 'function') {
    console.error('fn必须是函数!')
    return
  }
  const _args = Array.prototype.slice.call(arguments, 3, arguments.length) // 构造时传来的参数
  let timer = null
  return function (e) {
    let __args = Array.prototype.slice.call(arguments, 0) // 实际触发时传来的参数
    if (parseValue && typeof e === 'object' && 'target' in e && 'value' in e.target) { // 解析事件对象
      __args.splice(0, 0, e.target.value)
    }
    const args = _args.concat(__args) // 最终参数
    timer && clearTimeout(timer)
    timer = setTimeout(fn.bind(null, ...args), time)
  }
}

export function delay(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function compareVersion(ver) {
  if (!ver || typeof ver !== 'string') {
    return false
  }
  ver = ver.trim()
  const current = config.appVersion

  if (ver === current) {
    return false
  }

  const splitedVer = ver.split('.')
  const splitedCurrent = current.split('.')

  if (splitedVer.length !== splitedCurrent.length) {
    return false
  }

  for (let i = 0; i < splitedCurrent.length; i++) {
    const currentVal = Number(splitedCurrent[i])
    const nextVal = Number(splitedVer[i])
    if (currentVal < nextVal) {
      return true
    }
    if (currentVal > nextVal) {
      return false
    }
  }

  return false

}

/**
 * 将fields为索引的配置转换为 code 为索引的配置
 */

export function convertConfig(src) {
  let tar = {}
  Object.keys(src).forEach((key) => {
    const item = src[key]
    tar[item.code] = {
      ...item,
      fields: key,
    }
  })
  return tar
}

/**
 * 缩放阿里云图片，减小资源大小
 * @param {string} imgUrl 阿里云图片地址，默认为空
 * @param {number} resizeWidth resize尺寸， 按照像素密度缩放
 * @param {boolean} adaption 是否自适应，按照768设计宽度跟屏幕实际宽度比例适配
 * @returns {string|any} 如果图片资源不是url，则原样返回
 */
export const resizeImg = (imgUrl, resizeWidth = clientWidth, adaption = true) => {
  if (
    !imgUrl ||
    typeof imgUrl !== 'string' ||
    !resizeWidth ||
    typeof resizeWidth !== 'number' ||
    isNaN(resizeWidth)
  ) {
    return imgUrl
  }

  const imgWidth = PixelRatio.getPixelSizeForLayoutSize(
    adaption
      ? resizeWidth * (clientWidth / 768)
      : resizeWidth
  )

  return imgUrl + `?x-oss-process=image/resize,w_${imgWidth}`
}
