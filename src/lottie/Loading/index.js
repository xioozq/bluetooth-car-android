import configStyle from '~/style/config'
import { Color } from '~/utils'
const loading = require('./loading.json')

export default function Loading(color = configStyle.color.primary) {
  const _color = Color.toLottie(color)
  // lottie会缓存渲染资源， 导致修改不同颜色后的动画最终都一同样颜色渲染
  let _loading = JSON.parse(JSON.stringify(loading))

  _loading.assets[0].layers[0].shapes[0].it[2].c.k = _color
  _loading.assets[0].layers[1].shapes[0].it[2].c.k = _color
  _loading.layers[2].shapes[0].it[2].c.k = _color
  _loading.layers[3].shapes[0].it[2].c.k = _color

  return _loading
}