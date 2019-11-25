import React from 'react'
import { uuid, getItemsFromArray } from '~/utils'
import ModalView from '../ModalView'

export default class ModalManager extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      modalQueue: [],
    }
  }

  render() {
    const { modalQueue } = this.state

    return modalQueue instanceof Array && modalQueue.map((modal) => (
      <ModalView
        key={modal.id}
        {...modal}
        onMaskPress={this.onMaskPress.bind(this, modal)}
        onCloseEnd={this.onCloseEnd.bind(this, modal)}
      />
    ))
  }

  create = (props = {}) => {
    const id = uuid()
    const { modalQueue } = this.state
    const {
      enableClose = false,
      reuse = false,
      onApplyClose = null,
      ...extraProps
    } = props

    const enableBack = enableClose

    modalQueue.push({
      visible: !reuse,
      enableBack,
      enableClose,
      reuse,
      onApplyClose,
      ...extraProps,
      id,
    })

    this.setState({
      modalQueue,
    })

    return id
  }

  update = (id, props) => {
    const { modalQueue } = this.state
    const item = getItemsFromArray(modalQueue, 'id', id)[0]

    if (item) {
      Object.assign(item, {
        ...props,
      })
    }

    this.setState({
      modalQueue,
    })
  }

  remove = (id) => {
    const { modalQueue } = this.state
    const index = getItemsFromArray(modalQueue, 'id', id, 'index')[0]
    if (typeof index === 'number') {
      modalQueue.splice(index, 1)
    }
    this.setState({
      modalQueue,
    })
  }

  open = (id, props) => {
    this.update(id, {
      ...props,
      visible: true,
    })
  }

  close = (id, props) => {
    this.update(id, {
      ...props,
      visible: false,
    })
  }

  closeAll = () => {
    const { modalQueue } = this.state
    modalQueue.forEach((item) => {
      item.visible = false
    })
    this.setState({
      modalQueue,
    })
  }

  onMaskPress = (props) => {
    if (typeof props.onMaskPress === 'function') {
      props.onMaskPress()
    } else if (props.enableClose) {
      if (props.reuse && typeof props.onApplyClose === 'function') {
        // 如果是复用的模态框，控制权在外层，需要申请关闭， 传入类型和所有参数
        props.onApplyClose('mask', props)
      } else if (!props.reuse) {
        // 不复用的情况， 直接关闭并销毁实例
        this.close(props.id)
      }
    }
  }

  onCloseEnd = (props) => {
    if (!props.reuse) {
      this.remove(props.id)
    }
  }

}
