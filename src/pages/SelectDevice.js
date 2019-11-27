import React from 'react'
import { Page } from '~/components'
import { AsyncStorage, connect } from '~/utils'
import SelectPage from '~/containers/SelectPage'

@connect(({ app }) => ({ app }))
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
    const { deviceList } = this.props.app

    return (
      <SelectPage
        key="selector"
        list={deviceList}
        labelKey="name"
        valueKey="id"
        // selectedValue={storage.serverEnv}
        title="选择蓝牙设备"
        onSubmit={this.handleSubmitSelect}
        onCancel={this.handleCancelSelect}
      />
    )
  }

  handleSubmitSelect = async (data) => {
    const result = await this.dispatch({ type: 'app/connectDevice', payload: { id: data.id } })
    if (result) {
      this.navBack()
    }
  }

  handleCancelSelect = () => {
    this.navBack()
  }

}