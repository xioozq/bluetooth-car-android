import React from 'react'
import { RefreshHeader as BaseRefreshHeader } from 'react-native-spring-scrollview/RefreshHeader'
import View from '../View'
import Lottie from '../Lottie'

const refreshing = require('./refreshing.json')
const pull = require('./pull.json')

export default class RefreshHeader extends BaseRefreshHeader {

  static height = 100

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {this.renderLoading()}
      </View>
    )
  }

  renderLoading = () => {
    const { offset, maxHeight } = this.props
    let { status } = this.state

    let pullingProgress = offset.interpolate({
      inputRange: [-maxHeight - 1 - 10, -maxHeight - 10, -50, -49],
      outputRange: [1, 1, 0, 0]
    })

    const props = {
      source: pull,
      autoPlay: false,
      loop: false,
      progress: pullingProgress,
      style: {
        width: 60,
        height: 60,
      }
    }

    switch (status) {
      case 'refreshing': {
        delete props.progress
        props.autoPlay = true
        props.loop = true
        props.source = refreshing
        return (
          <Lottie  {...props} key="refreshing" />
        )
      }
    }

    return (
      <Lottie  {...props} key="pull" />
    )
  }

}