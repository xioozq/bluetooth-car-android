import React from 'react'
import storage from '~/storage'
import { Page } from '~/components'
import { AsyncStorage } from '~/utils'
import SelectPage from '~/containers/SelectPage'

export default class SelectDevice extends Page {

  constructor() {
    super(...arguments)

    this.state = {
      list: [
        {
          label: '设备A',
          desc: 'sasas',
          value: 'a',
        },
        {
          label: '设备B',
          desc: 'saSSSSsas',
          value: 'B',
        },
      ],
    }
  }

  render() {
    const { list } = this.state

    return (
      <SelectPage
        key="selector"
        list={list}
        selectedValue={storage.serverEnv}
        title="选择蓝牙设备"
        onSubmit={this.handleSubmitSelect}
        onCancel={this.handleCancelSelect}
      />
    )
  }

  handleSubmitSelect = (data) => {
    this.handleSetServerEnv(data.value)
  }

  handleSetServerEnv = (env, value) => {
    storage.serverEnv = env
    AsyncStorage.setItem('SERVER_ENV', env)
    this.showToast('设置成功')
    this.navBack()
  }

  handleCancelSelect = () => {
    this.navBack()
  }

  handleCustomServerUrlInput = (value) => {
    this.setState({
      customServerUrl: value,
    })
  }

  handleCancelCustomServerUrl = () => {
    this.setState({
      customServerModalVisible: false,
    })
  }

  handleSubmitCustomServerUrl = () => {
    const { customServerUrl } = this.state
    this.setState({
      customServerModalVisible: false,
    })
    this.handleSetServerEnv('CUSTOM', customServerUrl)
  }
}